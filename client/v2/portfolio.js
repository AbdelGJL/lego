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
//const dealsLink = document.getElementById('deals-link');
const infoFilterButton = document.getElementById('info-filters');
const infop5 = document.getElementById('info-p5');
const infop25 = document.getElementById('info-p25');
const infop50 = document.getElementById('info-p50');
const infoLifetime = document.getElementById('info-lifetime');

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
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
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
          <button class="favorite-btn" data-id="${deal.uuid}" style="background-image: url('${isFavorite ? 'heart.png' : 'empty_heart.png'}');"></button>
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
          <button class="modal-btn modal-trigger" data-id="${deal.id}">Sales infos</button>
        </div>
      </div>
    `;
    })
    .join('');

  div.className = 'deals';
  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.appendChild(fragment);
  document.querySelector('a[href="#deals"]').style.textDecoration = 'underline';

  document.querySelectorAll('.modal-trigger').forEach(button => {
    button.addEventListener('click', event => {
      toggleModal(event.target.getAttribute('data-id'))
    });
  });



  document.querySelectorAll('.favorite-btn').forEach(button => {
    button.addEventListener('click', event => {
      const dealId = event.target.getAttribute('data-id');
      let favoriteDeals = JSON.parse(localStorage.getItem('favoriteDeals')) || [];

      if (favoriteDeals.includes(dealId)) {
        // Remove from favorites
        favoriteDeals = favoriteDeals.filter(id => id !== dealId);
        //event.target.textContent = 'Favorite'; //à modifier
        event.target.style.backgroundImage = `url("empty_heart.png")`;
        event.target.parentElement.classList.remove('favorite');
      } else {
        // Add to favorites
        favoriteDeals.push(dealId);
        //event.target.textContent = 'Unfavorite'; //à modifier
        event.target.style.backgroundImage = `url("heart.png")`;
        event.target.parentElement.classList.add('favorite');
      }

      localStorage.setItem('favoriteDeals', JSON.stringify(favoriteDeals));
      renderFavorites();
    });
  });
};

// <span>${deal.id} | </span>
//modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));
//closeModalButton.addEventListener('click', closeModal);


/**
 * Render favorites
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

/*
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('favorite.html')) {
    renderFavorites();
  }
});*/

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
    deals.sort((a, b) => new Date(b.published) - new Date(a.published));
  } else if (sortValue === "date-desc") {
    deals.sort((a, b) => new Date(a.published) - new Date(b.published));
  }
}

// Fonction de rendu initial
async function initialRender() {
  const deals = await fetchDeals();
  let curDeals = deals.result;

  sortDeals(curDeals, selectSort.value);

  setCurrentDeals({ result: curDeals, meta: deals.meta });
  render(currentDeals, currentPagination);
  renderFavorites();
}

// Appelez initialRender lors de l'ouverture de la page ou lorsqu'un utilisateur clique sur le menu "Deals"
document.addEventListener('DOMContentLoaded', initialRender);
/*dealsLink.addEventListener('click', event => {
  event.preventDefault();
  initialRender();
});*/

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
async function Discount() {
  if (isDiscount) {
    const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
    setCurrentDeals(deals);
    isDiscount = false;
  }
  else {
    let filteredDeals = [];
    currentDeals.forEach(deal => {
      if (deal.discount >= 50) {
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
async function Commented() {
  if (isCommented) {
    const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
    setCurrentDeals(deals);
    isCommented = false;
  }
  else {
    let filteredDeals = [];
    currentDeals.forEach(deal => {
      if (deal.comments >= 15) {
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
async function HotDeals() {
  if (isHotDeals) {
    const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
    setCurrentDeals(deals);
    isHotDeals = false;
  }
  else {
    let filteredDeals = [];
    currentDeals.forEach(deal => {
      if (deal.temperature >= 100) {
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
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  if (Difference_In_Days <= 1) {
    let Difference_In_Hours = Math.round(Difference_In_Time / (1000 * 3600));
    console.log(Difference_In_Hours + " hours ago");
  }
  else {
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

  let salesDate = sale.map(sale => sale.published);
  lifetimeValue.innerText = Lifetime(salesDate); // Feature 9 : lifetime of the deal

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
// Average value
function Average(sales) {
  let initialValue = 0;
  let sumWithInitial = sales.reduce(
    (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue),
    initialValue,
  );
  const average = sumWithInitial / sales.length;
  return average.toFixed(2);
}

function pValue(salesPrice, pvalue) {
  if (salesPrice.length !== 0 && salesPrice !== null && salesPrice !== undefined) {
    const N = Math.ceil(salesPrice.length * pvalue);
    const sortedSales = salesPrice.sort(function (a, b) { return a - b; });
    return sortedSales[N - 1];
  }
  else return 0;
}

function Lifetime(sale) {
  let sortSale = sale.sort(function (a, b) { return a - b; });
  return Duration(sortSale[0]);

}

function handleMenuClick(event, sectionToShow) {
  event.preventDefault();
  if (sectionToShow === 'favorites') {
    document.getElementById('options').style.display = 'none';
    document.getElementById('vinted').style.display = 'none';
    document.getElementById('indicators').style.display = 'none';
    document.getElementById('deals').style.display = 'none';
    document.getElementById('lego').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
  } else if (sectionToShow === 'deals') {
    document.getElementById('options').style.display = 'block';
    document.getElementById('vinted').style.display = 'none';
    document.getElementById('indicators').style.display = 'none';
    document.getElementById('favorites').style.display = 'none';
    document.getElementById('lego').style.display = 'none';
    document.getElementById('pagination').style.display = 'flex';
  }
  document.getElementById(sectionToShow).style.display = 'block';
}


// For Menu 'My Favorites'
document.querySelector('a[href="#favorites"]').addEventListener('click', event => {
  handleMenuClick(event, 'favorites');
  document.querySelector('a[href="#favorites"]').style.textDecoration = 'underline';
  document.querySelector('a[href="#deals"]').style.textDecoration = 'none';
  renderFavorites();
});

// For Menu 'Deals'
document.querySelector('a[href="#deals"]').addEventListener('click', event => {
  handleMenuClick(event, 'deals');
  document.querySelector('a[href="#deals"]').style.textDecoration = 'underline';
  document.querySelector('a[href="#favorites"]').style.textDecoration = 'none';
});

// Change the color of the temperature based on the value
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

async function toggleModal(id) {
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
  
}
closeModalButton.addEventListener('click', () => {
  modalContainer.classList.remove('active');
});

// Info part for filter buttons
infoFilterButton.addEventListener('mouseover', event => {
  const tooltipText = event.target.nextElementSibling;
  tooltipText.innerHTML = `
    <u>Infos about filters :</u> <br> 
    - <u>Discount</u> : Display deals with a discount <b style="color:#D94C36;">>30%</b> <br> 
    - <u>Commented</u> : Display deals with more than <b style="color:#D94C36;">15 comments</b> <br> 
    - <u>Hot Deals</u> : Display deals with a temperature <b style="color:#D94C36;">>100</b>`;
});

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


/*
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
});*/
