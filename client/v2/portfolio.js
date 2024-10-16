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
let currentSales = [];

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const sectionSales = document.querySelector('#vinted');
const spanNbSales = document.querySelector('#nbSales');
const selectSort = document.querySelector('#sort-select');
const averagePrice = document.querySelector('#average');
const p5Value = document.querySelector('#p5');
const p25Value = document.querySelector('#p25');
const p50Value = document.querySelector('#p50');
const p95Value = document.querySelector('#p95');

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
        <span> - ${Duration(deal.published)}</span>
        
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

const render = (deals, pagination, page) => {
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
  //Sorting(selectSort.value);
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

  let curDeals = deals.result;

  sortDeals(curDeals, selectSort.value);

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});
/*
document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();


  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});*/

function sortDeals(deals, sortValue) {
  if (sortValue === "price-asc") {
    deals.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    deals.sort((a, b) => b.price - a.price);
  } else if (sortValue === "date-asc") {
    deals.sort((a, b) => new Date(a.published) - new Date(b.published));
  } else if (sortValue === "date-desc") {
    deals.sort((a, b) => new Date(b.published) - new Date(a.published));
  }
}

// Fonction de rendu initial
async function initialRender() {
  const deals = await fetchDeals();
  let curDeals = deals.result;

  sortDeals(curDeals, selectSort.value);

  setCurrentDeals({ result: curDeals, meta: deals.meta });
  render(currentDeals, currentPagination);
}

// Appelez initialRender lors de l'ouverture de la page
document.addEventListener('DOMContentLoaded', initialRender);

// Feature 1 : Browse pages
selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals(parseInt(event.target.value), selectShow.value);

  let curDeals = deals.result;
  sortDeals(curDeals, selectSort.value);

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

// Feature 5 : Sort by price AND 6 ; Sort by date

selectSort.addEventListener('change', async (event) => {  
  Sorting(event.target.value);
});

async function Sorting(event){
  const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
  let curDeals = deals.result;
  if(event === "price-asc"){
    curDeals.sort((a, b) => a.price - b.price);
  }
  else if(event === "price-desc"){
    curDeals.sort((a, b) => b.price - a.price);
  }
  else if(event === "date-asc"){
    curDeals.sort((a, b) => new Date(a.published) - new Date(b.published));
  }
  else if(event === "date-desc"){
    curDeals.sort((a, b) => new Date(b.published) - new Date(a.published));
  }

  render(curDeals, currentPagination);
}

// This function calculates the duration of the deal and displays it in Deals section
function Duration(time){
  const today = new Date();
  
  let Difference_In_Time = Math.abs(today.getTime() - time * 1000);
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  
  if(Difference_In_Days <= 1){
    let Difference_In_Hours = Math.round(Difference_In_Time / (1000 * 3600));
    console.log(Difference_In_Hours + " hours ago");
  }
  else{
    return Difference_In_Days + " days ago";
  }
}

// Feature 7 : Display Vinted Sales
selectLegoSetIds.addEventListener('change', async (event) => {
  let sale = await fetchSales(event.target.value);
  renderSales(sale, event.target.value);
  let salesPrice = sale.map(sale => sale.price);
  averagePrice.innerText = Average(salesPrice) + " €"; // Feature 9 : average price
  p5Value.innerText = pValue(salesPrice, 0.05) + " €"; // Feature 9 : p5 price
  p25Value.innerText = pValue(salesPrice, 0.25) + " €"; // Feature 9 : p25 price
  p50Value.innerText = pValue(salesPrice, 0.50) + " €"; // Feature 9 : p50 price
  p95Value.innerText = pValue(salesPrice, 0.95) + " €"; // Feature 9 : p95 price


});

const fetchSales = async id => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/sales?id=${id}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return [];
    }

    return body.data.result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/** 
 * Set global value
 * @param  {Array} sales - deals to display
 */
const renderSales = (sales, dealID) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = sales
    .map(sale => {
      return `
      <div class="sale" id=${sale.uuid}>
        <span>${dealID} | </span>
        <a href="${sale.link}">${sale.title}</a>
        <span> - ${sale.price}€</span>
        <span> - ${Duration(sale.published)}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionSales.innerHTML = '<h2>Vinted</h2>';
  sectionSales.appendChild(fragment);
  spanNbSales.innerText = sales.length; // Feature 8 : Total number of sales
};

// Feature 9 - average, p25, p50 and p95 price value indicators
// Average value
function Average(sales){
  let initialValue = 0;
  let sumWithInitial = sales.reduce(
    (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue), 
    initialValue,
  );
  const average = sumWithInitial / sales.length; 
  return average.toFixed(2);
}

function pValue(salesPrice, pvalue){
  if(salesPrice.length !== 0 && salesPrice !== null && salesPrice !== undefined)
  {
    const N = Math.ceil(salesPrice.length * pvalue);
    const sortedSales = salesPrice.sort(function(a,b) {return a - b;});
    return sortedSales[N-1];
  }
  else return 0;
}


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
