// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
Ids https://buyselllego.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://buyselllego.vercel.app/sales/search

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `legoSetId` - lego set id to return

GET https://buyselllego.vercel.app/deals/search

Search for deals based on a filter

This endpoint accepts the following optional query string parameters:

- `filterBy` - filter to apply to the deals ('best-discount', 'most-commented', 'hot-deals')
- `page` - page of deals to return
- `size` - number of deals to return
- `price` - return all deals under this price 
- `date` - return all deals published after this date

*/

// Current deals on the page

let currentDeals = [];
let currentPagination = {};
let currentSales = [];

// Instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals = document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const sectionSales = document.querySelector('#vinted');
const spanNbSales = document.querySelector('#nbSales');
const selectSort = document.querySelector('#sort-select');
const averagePrice = document.querySelector('#average');
const p5Value = document.querySelector('#p5');
const p25Value = document.querySelector('#p25');
const p50Value = document.querySelector('#p50');
const p95Value = document.querySelector('#p95');
const lifetimeValue = document.querySelector('#lifetime');
const modalContainer = document.getElementById('modal-container');
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalContent = document.querySelector('.modal-content');
const closeModalButton = document.querySelector(".close-modal");
const infoFilterButton = document.getElementById('info-filters');
const infop5 = document.getElementById('info-p5');
const infop25 = document.getElementById('info-p25');
const infop50 = document.getElementById('info-p50');
const infoLifetime = document.getElementById('info-lifetime');
const infoTuto = document.getElementById('info-tuto');
const discountBTN = document.getElementById('discount-btn');
const commentedBTN = document.getElementById('comment-btn');
const hotDealsBTN = document.getElementById('hotdeals-btn');

const dealSID = document.getElementById('dealS-id');
const dealInfos = document.getElementById('deal-infos');

/** 
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({ result, meta }) => {
  currentDeals = result;
  currentPagination = meta;
};


/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 24) => {
  try {
    // const response = await fetch(
    //   `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    // );
    const response = await fetch(
      `https://buyselllego.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return { currentDeals, currentPagination };
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return { currentDeals, currentPagination };
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
  const favoriteDeals = JSON.parse(localStorage.getItem('favoriteDeals')) || [];

  const template = deals
    .map(deal => {
      const isFavorite = favoriteDeals.includes(deal.uuid) ? 'favorite' : '';
      return `
      <div class="deal" id=${deal.uuid}>
        <div class="deal-info">
          <p> &#128338 ${Duration(deal.published)}</p>
          <button class="favorite-btn" data-uuid="${deal.uuid}" style="background-image: url('${isFavorite ? 'heart.png' : 'empty_heart.png'}');"></button>
        </div>
        <div class="deal-image">
          <img src="${deal.photo}" alt="Deal Image" title="${deal.title}"/>
        </div>
        <div class="deal-title">
          <a href="${deal.link}" target="_blank">${stringExtract(deal.title)}</a>
        </div>
        <div class="deal-price">
          <strong style="color: red;">${deal.price}€ </strong>
          <strike style="color: #706d6d; font-size: 13px">${renderRetail(deal.retail)}</strike>
          <span>${renderDiscount(deal.discount)}</span>
        </div>
        <div class="deal-description">
          <span> ${deal.comments} comments </span>
          <span style="color : ${setColorForTemperature(deal.temperature)}; font-weight: 550;">${deal.temperature}°</span>
          <button class="modal-btn modal-trigger" data-id="${deal.id}" data-uuid="${deal.uuid}">Sales infos</button>
        </div>
      </div>
    `;
    })
    .join('');

  div.className = 'deals';
  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.appendChild(fragment);

  // Feature 7 : Display Vinted Sales
  document.querySelectorAll('.modal-trigger').forEach(button => {
    button.addEventListener('click', event => {
      const dealUuid = event.target.getAttribute('data-uuid');
      const deal = currentDeals.find(deal => deal.uuid === dealUuid);
      //toggleModal(event.target.getAttribute('data-id'), deal);
      if (deal) {
        toggleModal(event.target.getAttribute('data-id'), deal);
      } else {
        console.error(`Deal with UUID ${dealUuid} not found`);
      }
    });
  });

  document.querySelectorAll('.favorite-btn').forEach(button => {
    button.addEventListener('click', event => {
      const dealId = event.target.getAttribute('data-uuid');
      let favoriteDeals = JSON.parse(localStorage.getItem('favoriteDeals')) || [];

      if (favoriteDeals.includes(dealId)) {
        // Remove from favorites
        favoriteDeals = favoriteDeals.filter(id => id !== dealId);
        event.target.style.backgroundImage = `url("empty_heart.png")`;
        event.target.parentElement.classList.remove('favorite');
      } else {
        // Add to favorites
        favoriteDeals.push(dealId);
        event.target.style.backgroundImage = `url("heart.png")`;
        event.target.parentElement.classList.add('favorite');
      }

      localStorage.setItem('favoriteDeals', JSON.stringify(favoriteDeals));
      renderFavorites();
    });
  });
};

/**
 * Render list of favorites
 */
const renderFavorites = () => {
  const favoriteDeals = JSON.parse(localStorage.getItem('favoriteDeals')) || [];
  const favoritesList = document.getElementById('favorites-list');
  if (!favoritesList) {
    console.error('Element with ID favorites-list not found');
    return;
  }
  favoritesList.innerHTML = '';

  if (favoriteDeals.length === 0) {
    favoritesList.innerHTML = '<p>No favorites yet.</p>';
    return;
  }

  favoriteDeals.forEach(dealId => {
    const dealElement = document.getElementById(dealId);
    if (dealElement) {
      const clone = dealElement.cloneNode(true);
      clone.querySelector('.favorite-btn').remove(); // Remove the favorite button from the clone

      const unfavoriteButton = document.createElement('button');
      unfavoriteButton.classList.add('favorite-btn');
      unfavoriteButton.style.backgroundImage = `url("heart.png")`;
      unfavoriteButton.classList.add('unfavorite-btn');
      unfavoriteButton.setAttribute('data-id', dealId);
      const dealInfoDiv = clone.querySelector('.deal-info');

      if (dealInfoDiv) {
        dealInfoDiv.appendChild(unfavoriteButton);
      }

      const modalTrigger = clone.querySelector('.modal-trigger');
      if (modalTrigger) {
        modalTrigger.addEventListener('click', event => {
          const dealId = event.target.getAttribute('data-id');
          toggleModal(dealId);
        });
      }

      favoritesList.appendChild(clone);
    }
  });

  // Add event listeners for unfavorite buttons
  document.querySelectorAll('.unfavorite-btn').forEach(button => {
    button.addEventListener('click', event => {
      const dealId = event.target.getAttribute('data-id');
      let favoriteDeals = JSON.parse(localStorage.getItem('favoriteDeals')) || [];

      // Remove from favorites
      favoriteDeals = favoriteDeals.filter(id => id !== dealId);
      localStorage.setItem('favoriteDeals', JSON.stringify(favoriteDeals));

      // Update the favorites list
      renderFavorites();

      // Also update the main deals list to reflect the change
      const dealElement = document.getElementById(dealId);
      if (dealElement) {
        const favoriteButton = dealElement.querySelector('.favorite-btn');
        if (favoriteButton) {
          favoriteButton.style.backgroundImage = `url("empty_heart.png")`;
          dealElement.classList.remove('favorite');
        }
      }
    });
  });
};



/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {

  const { currentPage, pageCount } = pagination;
  const options = Array.from(
    { 'length': pageCount },
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');


  const select = document.createElement('select');
  select.innerHTML = options;
  select.value = currentPage;

  select.addEventListener('change', event => {
    const selectedPage = event.target.value;
    // Fetch and render deals for the selected page
    fetchDeals(selectedPage);
  });


  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
  selectPage.appendChild(select);

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
  const { count } = pagination;

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
  renderLegoSetIds(deals);
};

/**
 * Declaration of all Listeners
 */


// Feature 0 : Show more
/**
 * Select the number of deals to display
 */
// Call initialRender at the beginning of the loading page
document.addEventListener('DOMContentLoaded', initialRender);

// Function to check if filters are active
function areFiltersActive() {
  const price = document.getElementById('price-input').value;
  const date = document.getElementById('date-input').value;
  return price || date;
}

selectShow.addEventListener('change', async (event) => {
  // const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));

  // let curDeals = deals.result;

  // sortDeals(curDeals, selectSort.value);

  // setCurrentDeals(deals);
  // render(currentDeals, currentPagination);
  if (discountBTN.classList.contains('actived')) {
    filterButtons('best-discount');
  } else if (commentedBTN.classList.contains('actived')) {
    filterButtons('most-commented');
  } else if (hotDealsBTN.classList.contains('actived')) {
    filterButtons('hot-deals');
  } else if (areFiltersActive()) {
    await validateFilters();
  } else {
    const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));
    let curDeals = deals.result;
    sortDeals(curDeals, selectSort.value);
    setCurrentDeals(deals);
    render(currentDeals, currentPagination);
  }
});

// Feature 1 : Browse pages
selectPage.addEventListener('change', async (event) => {
  // const deals = await fetchDeals(parseInt(event.target.value), selectShow.value);

  // let curDeals = deals.result;
  // sortDeals(curDeals, selectSort.value);

  // setCurrentDeals(deals);
  // render(currentDeals, currentPagination);
  if (discountBTN.classList.contains('actived')) {
    filterButtons('best-discount');
  } else if (commentedBTN.classList.contains('actived')) {
    filterButtons('most-commented');
  } else if (hotDealsBTN.classList.contains('actived')) {
    filterButtons('hot-deals');
  } else if (areFiltersActive()) {
    await validateFilters();
  } else {
    const deals = await fetchDeals(parseInt(event.target.value), selectShow.value);
    let curDeals = deals.result;
    sortDeals(curDeals, selectSort.value);
    setCurrentDeals(deals);
    render(currentDeals, currentPagination);
  }
});

// Function to sort the deals based on the selected value
function sortDeals(deals, sortValue) {
  if (sortValue === "price-asc") {
    deals.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    deals.sort((a, b) => b.price - a.price);
  } else if (sortValue === "date-asc") {
    deals.sort((a, b) => new Date(b.published) - new Date(a.published));
  } else if (sortValue === "date-desc") {
    deals.sort((a, b) => new Date(a.published) - new Date(b.published));
  }
}

// Render the initial page
async function initialRender() {
  const deals = await fetchDeals();
  let curDeals = deals.result;

  sortDeals(curDeals, selectSort.value);

  setCurrentDeals({ result: curDeals, meta: deals.meta });
  render(currentDeals, currentPagination);
  renderFavorites();
}


// Fuction for reinitializing the filters style of other buttons and the filters applied
async function resetFilters(keep = null) {
  const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
  setCurrentDeals(deals);

  if (keep !== "discount") {
    isDiscount = false;
    discountBTN.classList.remove("actived");
  }

  if (keep !== "commented") {
    isCommented = false;
    commentedBTN.classList.remove("actived");
  }

  if (keep !== "hotDeal") {
    isHotDeals = false;
    hotDealsBTN.classList.remove("actived");
  }
}

// Feature 2 : Filter by best discount
let isDiscount = false;
async function Discount() {
  await resetFilters("discount");
  if (isDiscount) {
    const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
    setCurrentDeals(deals);
    isDiscount = false;
    discountBTN.classList.remove("actived");
    render(currentDeals, currentPagination);
  }
  else {
    // let filteredDeals = [];
    // currentDeals.forEach(deal => {
    //   if (deal.discount >= 50) {
    //     filteredDeals.push(deal);
    //   }
    // });
    // filteredDeals.sort((a, b) => b.discount - a.discount);
    // // setCurrentDeals(deals);
    discountBTN.classList.add("actived");
    isDiscount = true;
    // currentDeals = filteredDeals;
    await filterButtons('best-discount');
  }
}

// Feature 3 : Filter by most commented
let isCommented = false;
async function Commented() {
  await resetFilters("commented");
  if (isCommented) {
    const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
    setCurrentDeals(deals);
    isCommented = false;
    commentedBTN.classList.remove("actived");
    render(currentDeals, currentPagination);
  }
  else {
    // let filteredDeals = [];
    // currentDeals.forEach(deal => {
    //   if (deal.comments >= 15) {
    //     filteredDeals.push(deal);
    //   }
    // });
    // filteredDeals.sort((a, b) => b.comments - a.comments);
    commentedBTN.classList.add("actived");
    isCommented = true;
    // currentDeals = filteredDeals;
    await filterButtons('most-commented');
  }
}

// Feature 4 : Filter by most liked
let isHotDeals = false;
async function HotDeals() {
  await resetFilters("hotDeal");
  if (isHotDeals) {
    const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
    setCurrentDeals(deals);
    isHotDeals = false;
    hotDealsBTN.classList.remove("actived");
    render(currentDeals, currentPagination);
  }
  else {
    // let filteredDeals = [];
    // currentDeals.forEach(deal => {
    //   if (deal.temperature >= 100) {
    //     filteredDeals.push(deal);
    //   }
    // });
    // filteredDeals.sort((a, b) => b.temperature - a.temperature);
    hotDealsBTN.classList.add("actived");
    isHotDeals = true;
    // currentDeals = filteredDeals;
    await filterButtons('hot-deals');
  }
}

// Feature 5 : Sort by price AND 6 ; Sort by date
selectSort.addEventListener('change', async (event) => {
  Sorting(event.target.value);
});

// Function to sort the deals based on the selected value
async function Sorting(event) {
  const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
  let curDeals = deals.result;
  if (event === "price-asc") {
    curDeals.sort((a, b) => a.price - b.price);
  }
  else if (event === "price-desc") {
    curDeals.sort((a, b) => b.price - a.price);
  }
  else if (event === "date-asc") {
    curDeals.sort((a, b) => new Date(b.published) - new Date(a.published));
  }
  else if (event === "date-desc") {
    curDeals.sort((a, b) => new Date(a.published) - new Date(b.published));
  }

  render(curDeals, currentPagination);
}

// This function calculates the duration of the deal and displays it in Deals section
function Duration(time) {
  const today = new Date();

  let Difference_In_Time = Math.abs(today.getTime() - time * 1000);
  let Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
  let Difference_In_Hours = Math.floor(Difference_In_Time / (1000 * 3600));

  if (Difference_In_Hours <= 23) {
    return Difference_In_Hours + " hours ago";
  }
  else if (Difference_In_Days <= 31) {
    return Difference_In_Days + " days ago";
  }
  else {
    return parseInt(Difference_In_Days / 30) + " months ago (" + Difference_In_Days + " days)";
  }
}

function DurationInDays(time) {
  const today = new Date();

  let Difference_In_Time = Math.abs(today.getTime() - time * 1000);
  let Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24));
  const InDays = Difference_In_Days.toFixed(2);
  return InDays;
}

// Feature 7 : Display Vinted Sales
// Here, we display sales based on the selected deal
// But here we add a button to display the sales directly in our Deals
/*
selectLegoSetIds.addEventListener('change', async (event) => {
  let sale = await fetchSales(event.target.value);
  renderSales(sale, event.target.value);
  let salesPrice = sale.map(sale => sale.price);
  averagePrice.innerText = Average(salesPrice) + " €"; // Feature 9 : average price
  p5Value.innerText = pValue(salesPrice, 0.05) + " €"; // Feature 9 : p5 price
  p25Value.innerText = pValue(salesPrice, 0.25) + " €"; // Feature 9 : p25 price
  p50Value.innerText = pValue(salesPrice, 0.50) + " €"; // Feature 9 : p50 price
  p95Value.innerText = pValue(salesPrice, 0.95) + " €"; // Feature 9 : p95 price

  let salesDate = sale.map(sale => sale.published);
  lifetimeValue.innerText = Lifetime(salesDate); // Feature 9 : lifetime of the deal

});*/

const fetchSales = async id => {
  try {
    // const response = await fetch(
    //   `https://lego-api-blue.vercel.app/sales?id=${id}`
    // );
    const response = await fetch(
      `https://buyselllego.vercel.app/sales/search?legoSetId=${id}`
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
 * Render list of sales
 * @param  {Array} sales - sales to display
 * @param  {String} dealID - id of the deal
 */
const renderSales = (sales, dealID) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = sales
    .map(sale => {
      return `
      <div class="sale" id=${sale.uuid}>
        <div class="sale-title">  
          <a href="${sale.link}" target="_blank">${stringExtract(sale.title)}</a>
        </div>
        <div class="sale-price">
          <strong style="color: red;">${sale.price}€</strong>
        </div>
        <div class="sale-info">
          <span>Published since : </span>
          <span style="font-weight: 550;">${Duration(sale.published)}</span>
        </div>
      </div>
    `;
    })
    .join('');

  div.className = 'vinted';
  div.innerHTML = template;
  fragment.appendChild(div);
  sectionSales.innerHTML = `
    <h2>Sales available (on Vinted)</h2>
    <div style="text-align: right;" id="numb-sales">
                <span>${sales.length}</span>
                <span> sales found</span>
              </div>`;
  sectionSales.appendChild(fragment);
  //spanNbSales.innerText = sales.length; // Feature 8 : Total number of sales
};

// Feature 9 - average, p25, p50 and p95 price value indicators
// Average value function
function Average(sales) {
  let initialValue = 0;
  let sumWithInitial = sales.reduce(
    (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue),
    initialValue,
  );
  const average = sumWithInitial / sales.length;
  return average.toFixed(2);
}

// Percentile value function
function pValue(salesPrice, pvalue) {
  if (salesPrice.length !== 0 && salesPrice !== null && salesPrice !== undefined) {
    const N = Math.ceil(salesPrice.length * pvalue);
    const sortedSales = salesPrice.sort(function (a, b) { return a - b; });
    return sortedSales[N - 1];
  }
  else return 0;
}

// Feature 10 - Lifetime of the deal
function Lifetime(sale) {
  let sortSale = sale.sort(function (a, b) { return a - b; });
  return Duration(sortSale[0]);
}

/**
 * Display the section based on the menu clicked
 * @param {Event} event 
 * @param {String} sectionToShow 
 */
function handleMenuClick(event, sectionToShow) {
  event.preventDefault();
  if (sectionToShow === 'favorites') {
    document.getElementById('options').style.display = 'none';
    document.getElementById('deals').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
    document.getElementById('title').style.display = 'none';
    document.getElementById('whoAmIsection').style.display = 'none';
    document.getElementById('infosSection').style.display = 'none';
  } else if (sectionToShow === 'deals') {
    document.getElementById('options').style.display = 'block';
    document.getElementById('favorites').style.display = 'none';
    document.getElementById('pagination').style.display = 'flex';
    document.getElementById('title').style.display = 'block';
    document.getElementById('whoAmIsection').style.display = 'none';
    document.getElementById('infosSection').style.display = 'none';
  } else if (sectionToShow === 'whoAmIsection') {
    document.getElementById('favorites').style.display = 'none';
    document.getElementById('options').style.display = 'none';
    document.getElementById('deals').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
    document.getElementById('title').style.display = 'none';
    document.getElementById('infosSection').style.display = 'none';
  } else if (sectionToShow === 'infosSection') {
    document.getElementById('favorites').style.display = 'none';
    document.getElementById('options').style.display = 'none';
    document.getElementById('deals').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
    document.getElementById('title').style.display = 'none';
    document.getElementById('whoAmIsection').style.display = 'none';
  }
  document.getElementById(sectionToShow).style.display = 'block';
}

// For Menu 'My Favorites'
document.querySelector('a[href="#favorites"]').addEventListener('click', event => {
  handleMenuClick(event, 'favorites');
  document.querySelector('a[href="#favorites"]').style.textDecoration = 'underline';
  document.querySelector('a[href="#deals"]').style.textDecoration = 'none';
  document.querySelector('a[href="#whoamI"]').style.textDecoration = 'none';
  document.querySelector('a[href="#infos"]').style.textDecoration = 'none';
});

// For Menu 'Deals'
document.querySelector('a[href="#deals"]').addEventListener('click', event => {
  handleMenuClick(event, 'deals');
  document.querySelector('a[href="#deals"]').style.textDecoration = 'underline';
  document.querySelector('a[href="#favorites"]').style.textDecoration = 'none';
  document.querySelector('a[href="#whoamI"]').style.textDecoration = 'none';
  document.querySelector('a[href="#infos"]').style.textDecoration = 'none';
});

//For Menu 'Who am I ?'
document.querySelector('a[href="#whoamI"]').addEventListener('click', event => {
  handleMenuClick(event, 'whoAmIsection');
  document.querySelector('a[href="#deals"]').style.textDecoration = 'none';
  document.querySelector('a[href="#favorites"]').style.textDecoration = 'none';
  document.querySelector('a[href="#whoamI"]').style.textDecoration = 'underline';
  document.querySelector('a[href="#infos"]').style.textDecoration = 'none';
});

//For Menu "Infos"
document.querySelector('a[href="#infos"]').addEventListener('click', event => {
  handleMenuClick(event, 'infosSection');
  document.querySelector('a[href="#deals"]').style.textDecoration = 'none';
  document.querySelector('a[href="#favorites"]').style.textDecoration = 'none';
  document.querySelector('a[href="#whoamI"]').style.textDecoration = 'none';
  document.querySelector('a[href="#infos"]').style.textDecoration = 'underline';
});

/**
 * Function to set the color of the temperature based on the value
 * @param {float} temp 
 * @returns HEX color
 */
function setColorForTemperature(temp) {
  if (temp >= 90) {
    return '#ce1734';
  }
  else if (temp >= 50 && temp < 90) {
    return '#f7641b';
  }
  else {
    return '#005498';
  }
}

// Display only 46 characters of the title
function stringExtract(str) {
  if (str.length <= 46) {
    return str;
  }
  else {
    return str.substring(0, 46) + '...';
  }
}

function renderDiscount(discount) {
  if (discount === null) {
    return '';
  }
  else {
    return '-' + discount + '%';
  }
}

function renderRetail(retail) {
  if (retail === 0) {
    return '';
  }
  else {
    return retail + '€';
  }
}

// Display the popup for the sales
async function toggleModal(id, deal) {
  modalContainer.classList.toggle("active");

  let sale = await fetchSales(id);

  renderSales(sale, id);

  let salesPrice = sale.map(sale => sale.price);

  averagePrice.innerText = Average(salesPrice) + " €"; // Feature 9 : average price
  p5Value.innerText = pValue(salesPrice, 0.05) + " €"; // Feature 9 : p5 price
  p25Value.innerText = pValue(salesPrice, 0.25) + " €"; // Feature 9 : p25 price
  p50Value.innerText = pValue(salesPrice, 0.50) + " €"; // Feature 9 : p50 price
  //p95Value.innerText = pValue(salesPrice, 0.95) + " €"; // Feature 9 : p95 price

  let salesDate = sale.map(sale => sale.published);
  lifetimeValue.innerText = Lifetime(salesDate); // Feature 9 : lifetime of the deal


  // Display additional deal information in the td
  document.getElementById('dealS-id').innerText = deal.id;
  document.getElementById('deal-title').innerText = stringExtract(deal.title);
  document.getElementById('deal-price').innerText = `${deal.price}€`;
  document.getElementById('deal-discount').innerText = `${deal.discount}%`;
  document.getElementById('deal-comments').innerText = deal.comments;
  document.getElementById('deal-temperature').innerText = `${deal.temperature}°`;
  document.getElementById('deal-published').innerText = Duration(deal.published);

  // Update the image source and title
  const dealImage = document.getElementById('deal-image');
  dealImage.src = deal.photo;
  dealImage.title = deal.title;
  dealImage.style.width = '200px';
  dealImage.style.height = '200px';
  advice(sale, deal, averagePrice, p5Value, p25Value, p50Value, lifetimeValue);
}

/**
 * Function to display an advice to know if the deal is good or not
 * @param {Array} sales 
 * @param {Array} deal 
 */
function advice(sales, deal) {
  let adviceText = '';
  let trueCount = 0;

  // Check margin
  let salesPrice = sales.map(sale => sale.price);
  const p40V = pValue(salesPrice, 0.4);
  const marginP40 = ((p40V - deal.price) / deal.price) * 100;
  console.log(marginP40);
  const isMarginGood = marginP40 >= 20;
  if (isMarginGood) trueCount++;

  // Check temperature and comments
  const daysSincePublished = DurationInDays(deal.published);
  let isTempCommentsGood = false;

  if (daysSincePublished < 1 && deal.comments > 1 && deal.temperature > 80) {
    isTempCommentsGood = true;
  } else if (daysSincePublished >= 1 && daysSincePublished < 2 && deal.comments > 3 && deal.temperature > 120) {
    isTempCommentsGood = true;
  } else if (daysSincePublished >= 2 && deal.comments > 10 && deal.temperature > 160) {
    isTempCommentsGood = true;
  }

  if (isTempCommentsGood) trueCount++;

  // Check Vinted sales duration
  const salesPublishedDates = sales.map(sale => sale.published);
  const percentile20Date = pValue(salesPublishedDates, 0.20); // 20th percentile date
  const isVintedDurationGood = DurationInDays(percentile20Date) <= 31;

  if (isVintedDurationGood) trueCount++;


  // Final advice based on trueCount
  if (trueCount === 0) {
    adviceText += `<div class="result-advice">
                    <span style="color: #D94C36;">Not a good deal &emsp;&emsp;</span>
                    <img id="gif" src="burk.gif" alt="burk" style="width: 150px; height: auto;"/>
                    </div>`;
  } else if (trueCount === 1) {
    adviceText += `<div class="result-advice">
                    <span style="color: orange;">Not recommended, unlikely to resell &emsp;&emsp;</span>
                    <img id="gif" src="meh-so-what.gif" alt="meh" style="width: 150px; height: auto;"/>
                  </div>`;
  } else if (trueCount === 2) {
    adviceText += `<div class="result-advice">
                    <span style="color:rgb(70, 191, 33);">Worth a try &emsp;&emsp;</span>
                    <img id="gif" src="looks_good.gif" alt="looks good" style="width: 150px; height: auto;"/>
                  </div>`;
  } else if (trueCount === 3) {
    adviceText += `<div class="result-advice">
                      <span style="color: green;">Jump on the opportunity &emsp;&emsp;</span>
                      <img id="gif" src="siuuu.gif" alt="SIUUUUUUUUUUUUUUUUUUUU" style="width: 150px; height: auto;"/>
                    </div>`;
  }

  adviceText += '<h4>Explanation of the advice</h4>';
  adviceText += '<ul>';
  adviceText += isMarginGood ?
    `<li>The margin rate is good : <span style="color: green;">${marginP40.toFixed(2)}%</span> </li>` :
    `<li>It's possible that this set of lego doesn't generate a lot of money. Estimated margin rate : <span style="color: ${setColorForMarginRate(marginP40.toFixed(2))};">${marginP40.toFixed(2)}%</span> </li>`;
  adviceText += isTempCommentsGood ?
    `<li>Temperature : <span style="color: green;">${deal.temperature}°</span></li>
    <li> Comments : <span style="color: green;">${deal.comments} comments</span></li>` :
    `<li>Temperature : <span style="color: ${setColorForTemperature(deal.temperature)};">${deal.temperature}°</span></li>
    <li> Comments : <span style="color: orange;">${deal.comments} comments</span></li>
    <p style="font-size: 16px;"><i class="material-icons">&#xe5da;</i> The deal has not generated enough reactions since it was shared, due to a lack of comments and/or a low temperature.</p>`;
  adviceText += isVintedDurationGood ?
    `<li>The date of offers on Vinted is recent (<span style="color: green;">${Duration(percentile20Date)}</span>), indicating ongoing interest in this Lego set.</li>` :
    `<li>We found a lack of recent offers for this set of lego in Vinted : <span style="color: orange;"> it's been ${Duration(percentile20Date)} since the last offer</span></li>`;
  adviceText += '</ul>';
  document.getElementById('advice').innerHTML = `
    <h2>Advice</h2>
    <p>${adviceText}</p>
  `;
}

/**
 * Function to set the color based on value of the margin rate
 * @param {number} margin 
 * @returns HEX color
 */
function setColorForMarginRate(margin) {
  if (margin < 0) {
    return '#D94C36';
  }
  else if (margin >= 10 && margin < 20) {
    return '#bf7521';
  }
}

// Close the modal window
closeModalButton.addEventListener('click', () => {
  modalContainer.classList.remove('active');
});

// Info part for filter buttons
infoFilterButton.addEventListener('mouseover', event => {
  const tooltipText = event.target.nextElementSibling;
  tooltipText.innerHTML = `
    <u>Infos about filters :</u> <br> 
    - <u>Discount</u> : Display deals with a discount <b style="color:#D94C36;">>50%</b> <br> 
    - <u>Commented</u> : Display deals with more than <b style="color:#D94C36;">15 comments</b> <br> 
    - <u>Hot Deals</u> : Display deals with a temperature <b style="color:#D94C36;">>100°</b>`;
});

// Info part for indicators
infop5.addEventListener('mouseover', event => {
  const tooltipText = event.target.nextElementSibling;
  tooltipText.innerHTML = `The price displayed means that <b style="color:#D94C36;">95%</b> of the sales are above this price`;
});

infop25.addEventListener('mouseover', event => {
  const tooltipText = event.target.nextElementSibling;
  tooltipText.innerHTML = `The price displayed means that <b style="color:#D94C36;">75%</b> of the sales are above this price`;
});

infop50.addEventListener('mouseover', event => {
  const tooltipText = event.target.nextElementSibling;
  tooltipText.innerHTML = `The price displayed means that <b style="color:#D94C36;">50%</b> of the sales are above this price`;
});

infoLifetime.addEventListener('mouseover', event => {
  const tooltipText = event.target.nextElementSibling;
  tooltipText.innerHTML = `The 1st sale was published since what displayed`;
});

infoTuto.addEventListener('mouseover', event => {
  const tooltipText = event.target.nextElementSibling;
  tooltipText.innerHTML = `Let's go you understand how to use the icon. But here, I have any info to give you. Sorry ! :P`;
});

// Toggle the display of the filters section
document.getElementById('toggle-filters').addEventListener('click', () => {
  const filters = document.getElementById('filters');
  const sort = document.getElementById('sort');
  const nFilters = document.getElementById('new-filters');
  const cFilters = document.getElementById('clear-filters');
  const filterContainer = document.querySelector('.filter-container');
  if (filters.style.display === 'none') {
    filters.style.display = 'block';
    sort.style.display = 'block';
    nFilters.style.display = 'block';
    filterContainer.style.display = 'block';
    cFilters.style.display = 'block';
    document.getElementById('toggle-filters').innerHTML = `Hide Filters &#128314;`;
  } else {
    filters.style.display = 'none';
    sort.style.display = 'none';
    nFilters.style.display = 'none';
    filterContainer.style.display = 'none';
    cFilters.style.display = 'none';
    document.getElementById('toggle-filters').innerHTML = `Show Filters &#128315;`;
  }
});

// Validate filters and call the API
async function validateFilters() {
  const price = document.getElementById('price-input').value;
  const date = document.getElementById('date-input').value;

  // Check if both fields are empty
  if (!price && !date) {
    alert('Please enter at least one filter criteria (price or date).');
    return;
  }

  try {
    const url = new URL('http://localhost:3000/deals/search');

    // Append price if provided
    if (price) {
      url.searchParams.append('price', price);
    }

    // Append date if provided and format it to YYYY-MM-DD
    if (date) {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      url.searchParams.append('date', formattedDate);
    }
    url.searchParams.append('page', selectPage.value);
    url.searchParams.append('size', selectShow.value);

    const response = await fetch(url);
    const body = await response.json();

    if (!body.success) {
      console.error('No results found');
      return;
    }

    const deals = body.data.result;
    const meta2 = body.data.meta;

    setCurrentDeals({ result: deals, meta: meta2 });
    render(currentDeals, currentPagination);
    //renderPagination(currentPagination);
  } catch (error) {
    console.error(error);
  }
}

// Clear filters
function clearFilters() {
  initialRender();
  isDiscount = false;
  discountBTN.classList.remove("actived");
  isCommented = false;
  commentedBTN.classList.remove("actived");
  isHotDeals = false;
  hotDealsBTN.classList.remove("actived");
}

/**
 * Filter the deals based on the selected value using API
 * @param {string} filter 
 */
async function filterButtons(filter) {
  try {
    const url = new URL(`http://localhost:3000/deals/search?filterBy=${filter}`);
    url.searchParams.append('page', selectPage.value);
    url.searchParams.append('size', selectShow.value);
    const response = await fetch(url);
    const body = await response.json();

    if (!body.success) {
      console.error('No results found');
      return;
    }

    const deals = body.data.result;
    const meta2 = body.data.meta;

    setCurrentDeals({ result: deals, meta: meta2 });
    render(currentDeals, currentPagination);
  } catch (error) {
    console.error(error);
    return [];
  }
}