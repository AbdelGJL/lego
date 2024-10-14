// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
Ids https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page

let currentDeals = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const selectSort = document.querySelector('#sort-select');

/** 
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};


/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

/**
 * Render list of deals
 * @param  {Array} deals
 * @param  {Object} pagination
 * @param  {Number} page
 */
const renderDeals = deals => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = deals
    .map(deal => {
      return `
      <div class="deal" id=${deal.uuid}>
        <span>${deal.id} | </span>
        <a href="${deal.link}">${deal.title}</a>
        <span> - ${deal.price}€</span>
        <span> - ${deal.discount}%</span>
        <span> - ${deal.comments} comments</span>
        <span> - ${deal.temperature}°</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = deals => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');

  selectLegoSetIds.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbDeals.innerHTML = count;
};

const render = (deals, pagination,page) => {
  sectionDeals.innerHTML = deals.slice((page - 1) * selectShow.value, page * selectShow.value).map(deal => `
    <div class="deal">
      <h3>${deal.name}</h3>
      <p>Discount: ${deal.discount}%</p>
    </div>
  `).join('');

  spanNbDeals.innerText = deals.length;
  
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals)
};

/**
 * Declaration of all Listeners
 */


// Feature 0 : Show more
/**
 * Select the number of deals to display
 */
selectShow.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

// Feature 1 : Browse pages
selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals(parseInt(event.target.value), selectShow.value);

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

/*
selectPage.addEventListener('change', async (event) => {
  currentPage = parseInt(event.target.value); // Mettre à jour la page actuelle
  const deals = await fetchDeals(currentPage, selectShow.value);

  // Mettre à jour les données globales avec les nouvelles offres
  setCurrentDeals(deals);
  render(currentDeals, currentPagination, currentPage);
});*/

// Feature 2 : Filter by best discount

let isDiscount = false;
async function Discount(){
  if(isDiscount){ 
    const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
    setCurrentDeals(deals);
    isDiscount = false;
  }
  else{ 
    let filteredDeals = [];
    currentDeals.forEach(deal => {
      if(deal.discount >= 30){
        filteredDeals.push(deal);
      }
    });
    filteredDeals.sort((a, b) => b.discount - a.discount);
    isDiscount = true;
    currentDeals = filteredDeals;
  }
  render(currentDeals, currentPagination);
}

// Feature 3 : Filter by most commented
let isCommented = false;
async function Commented(){
  if(isCommented){ 
    const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
    setCurrentDeals(deals);
    isCommented = false;
  }
  else{ 
    let filteredDeals = [];
    currentDeals.forEach(deal => {
      if(deal.comments >= 15){
        filteredDeals.push(deal);
      }
    });
    filteredDeals.sort((a, b) => b.comments - a.comments);
    isCommented = true;
    currentDeals = filteredDeals;
  }
  render(currentDeals, currentPagination);
}

// Feature 4 : Filter by most liked
let isHotDeals = false;
async function HotDeals(){
  if(isHotDeals){ 
    const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
    setCurrentDeals(deals);
    isHotDeals = false;
  }
  else{ 
    let filteredDeals = [];
    currentDeals.forEach(deal => {
      if(deal.temperature >= 100){
        filteredDeals.push(deal);
      }
    });
    filteredDeals.sort((a, b) => b.temperature - a.temperature);
    isHotDeals = true;
    currentDeals = filteredDeals;
  }
  render(currentDeals, currentPagination);
}

// Feature 5 : Sort by price

selectSort.addEventListener('change', async (event) => {  
  const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
  let curDeals = deals.result;
  if(event.target.value === "price-asc"){
    curDeals.sort((a, b) => a.price - b.price);
  }
  else if(event.target.value === "price-desc"){
    curDeals.sort((a, b) => b.price - a.price);
  }
  render(curDeals, currentPagination);
});

document.querySelectorAll('input[name="filter"]').forEach((radio) => {
  radio.addEventListener('change', (event) => {
    if (event.target.value === 'discount') {
      discount();
    } else if (event.target.value === 'noFilter') {
      // Ajouter d'autres filtres ici si nécessaire
      fetchAllDeals(); // Réinitialiser les filtres
    }
    else {
      fetchAllDeals();
    }
  });
});
