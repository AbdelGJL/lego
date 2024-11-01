// Invoking strict mode
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_DEALERS = [
  {
    'name': 'Dealabs',
    'url': 'https://www.dealabs.com/groupe/lego'
  },
  {
    'name': 'Avenue de la brique',
    'url': 'https://www.avenuedelabrique.com/promotions-et-bons-plans-lego'
  }
];



/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO 1: The highest reduction
// 0. I have 2 favorite lego sets shopping communities stored in MY_FAVORITE_DEALERS variable
// 1. Create a new variable and assign it the link of the lego set with the highest reduction I can find on these 2 websites
// 2. Log the variable

console.log("TODO 1 : \n");
MY_FAVORITE_DEALERS.push(
  {
    'name': 'Dealabs',
    'url': 'https://www.dealabs.com/bons-plans/set-de-dejeuner-lego-harry-potter-ou-ninjago-2865911',
  }
);

console.table(MY_FAVORITE_DEALERS);
console.log(MY_FAVORITE_DEALERS);

/**
 * 🧱
 * Easy 😁?
 * Now we manipulate the variable `deals`
 * `deals` is a list of deals from several shopping communities
 * The variable is loaded by the file `data.js`
 * 🧱
 */

// 🎯 TODO 2: Number of deals
// 1. Create a variable and assign it the number of deals
// 2. Log the variable

console.log("TODO 2 : \n");
const nbDeals = MY_FAVORITE_DEALERS.length;
console.log(nbDeals);

// 🎯 TODO 3: Website name
// 1. Create a variable and assign it the list of shopping community name only
// 2. Log the variable
// 3. Log how many shopping communities we have

console.log("TODO 3 : \n");
const dealersName = new Set(deals.map(deal => deal.community));
console.log(dealersName);
console.log(Array.from(dealersName).length);


// 🎯 TODO 4: Sort by price
// 1. Create a function to sort the deals by price
// 2. Create a variable and assign it the list of sets by price from lowest to highest
// 3. Log the variable

console.log("TODO 4 : \n");
function sortByPriceLow() {
  return deals.sort(function (a, b){
    return a.price - b.price;
  });
}

const sortedDeals = sortByPriceLow();

const dealsWithTitleAndPrice = sortedDeals.map(deal => ({
  title: deal.title,
  price: deal.price
}));

console.table(dealsWithTitleAndPrice);


// 🎯 TODO 5: Sort by date
// 1. Create a function to sort the deals by date
// 2. Create a variable and assign it the list of deals by date from recent to old
// 3. Log the variable

console.log("TODO 5 : \n");
const dealsByDate = deals;
dealsByDate.sort(function(a,b){
  return new Date(b.published) - new Date(a.published);
});

console.table(dealsByDate);


// 🎯 TODO 6: Filter a specific percentage discount range
// 1. Filter the list of deals between 50% and 75%
// 2. Log the list

console.log("TODO 6 : \n");
const dealDiscount = deals.filter(a => a.discount >= 50 && a.discount <= 75);
console.table(dealDiscount);

// 🎯 TODO 7: Average percentage discount
// 1. Determine the average percentage discount of the deals
// 2. Log the average

console.log("TODO 7 : \n");
const Discounts = deals.map(deal => deal.discount);
const initialValue = 0;
const sumWithInitial = Discounts.reduce(
  (accumulator, currentValue) => accumulator + currentValue, 
  initialValue,
);
const average = sumWithInitial / Discounts.length; 

console.log(average);

/**
 * 🏎
 * We are almost done with the `deals` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO 8: Deals by community
// 1. Create an object called `communities` to manipulate deals by community name 
// The key is the community name
// The value is the array of deals for this specific community
//
// Example:
// const communities = {
//   'community-name-1': [{...}, {...}, ..., {...}],
//   'community-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'community-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of deals by community

console.log("TODO 8 : \n");
const communities = [];

for(let i = 0; i < deals.length; i++) {
  const deal = deals[i];
  if(!communities[deal.community]){
    communities[deal.community] = [];
  }
  communities[deal.community].push(deal);
}

console.table(communities);

const keys = Object.keys(communities);
console.log("Number of deals by community : \n");
for(let j = 0; j < keys.length; j++){
  console.log(keys[j] + " : " + communities[keys[j]].length);
}


// 🎯 TODO 9: Sort by price for each community
// 1. For each community, sort the deals by discount price, from highest to lowest
// 2. Log the sort

console.log("TODO 9 : \n");
function sortByPriceHigh(k) {
  return k.sort(function (a, b){
    return b.price - a.price;
  });
}

for(let j = 0; j < keys.length; j++){
  communities[keys[j]] = sortByPriceHigh(communities[keys[j]]);
}

console.table(communities);

// 🎯 TODO 10: Sort by date for each community
// 1. For each set, sort the deals by date, from old to recent
// 2. Log the sort

console.log("TODO 10 : \n");
for(let j = 0; j < keys.length;j++){  
  communities[keys[j]] = communities[keys[j]].sort(function(a,b){
    return new Date(a.published) - new Date(b.published);
  });
}

console.table(communities);

/**
 * 🧥
 * Cool for your effort.
 * Now we manipulate the variable `VINTED`
 * `VINTED` is the listing of current items from https://www.vinted.fr/catalog?search_text=43230&time=1727075774&status_ids[]=6&status_ids[]=1&brand_ids[]=89162&page=1
 * The target set is 43230 (Walt Disney Tribute Camera)
 * 🧥
 */

const VINTED = [
  {
    title: 'Notice Lego « Caméra Disney »',
    link: 'https://www.vinted.fr/items/3605077693-notice-lego-camera-disney',
    price: 5,
    released: '2024-09-18',
    uuid: 'aee175f6-bce6-5f7d-9b99-f6ec96671c4a'
  },
  {
    title: 'LEGO 43230 Disney 100 Camera Tribute',
    link: 'https://www.vinted.fr/items/4964644230-lego-43230-disney-100-camera-tribute',
    price: 60,
    released: '2024-09-17',
    uuid: 'd2462dbb-ba6e-5437-862c-12b4518cfc7b'
  },
  {
    title: 'Lego 43230 Cámara Disney 100',
    link: 'https://www.vinted.fr/items/5061282955-lego-43230-camara-disney-100',
    price: 48,
    released: '2024-09-18',
    uuid: '713819bc-b0d4-58db-bb44-3bdc89a3ffde'
  },
  {
    title: '[NEUF] Lego Disney 43230 La Caméra Hommage à Walt Disney',
    link: 'https://www.vinted.fr/items/4263906992-neuf-lego-disney-43230-la-camera-hommage-a-walt-disney',
    price: 80,
    released: '2024-09-16',
    uuid: '43aa847d-fa49-5f09-b0e5-fe5692916bd8'
  },
  {
    title: 'Lego 43230 caméra Disney 100 ans',
    link: 'https://www.vinted.fr/items/4198605861-lego-43230-camera-disney-100-ans',
    price: 74,
    released: '2024-09-17',
    uuid: '5089f876-98a1-50a8-a85d-e3d29db1ae5c'
  },
  {
    title: 'Lego Camera Disney 43230 NEUF et scellé',
    link: 'https://www.vinted.fr/items/4778200935-lego-camera-disney-43230-neuf-et-scelle',
    price: 79,
    released: '2024-09-18',
    uuid: '9084115a-ea2a-5b37-8521-a4112053a2cc'
  },
  {
    title: 'LEGO Disney - Camera - 43230',
    link: 'https://www.vinted.fr/items/5017548194-lego-disney-camera-43230',
    price: 80,
    released: '2024-09-16',
    uuid: 'd0f5fd54-8661-5ea5-8fca-a9817bf1885d'
  },
  {
    title: 'Lego Disney 43230',
    link: 'https://www.vinted.fr/items/4508766073-lego-disney-43230',
    price: 79,
    released: '2024-09-22',
    uuid: 'de2c5905-7bc5-5061-914a-99809f698141'
  },
  {
    title: '43230 Homenaje a Walt Disney New LEGO',
    link: 'https://www.vinted.fr/items/5060103695-43230-homenaje-a-walt-disney-new-lego',
    price: 76,
    released: '2024-09-21',
    uuid: 'ac474b4a-6fe0-5fed-8317-b057277ddf81'
  },
  {
    title: 'Figurine Lego disney mickey mouse',
    link: 'https://www.vinted.fr/items/4538856243-figurine-lego-disney-mickey-mouse',
    price: 8,
    released: '2024-09-23',
    uuid: 'f965e5d2-d3a4-597c-9fe4-90d501b436cf'
  },
  {
    title: 'Lego cinepresa omaggio a walt disney 43230',
    link: 'https://www.vinted.fr/items/4023316953-lego-cinepresa-omaggio-a-walt-disney-43230',
    price: 85,
    released: '2024-09-16',
    uuid: 'b03ce63e-e69e-5335-847a-0032f18ac9d2'
  },
  {
    title: 'Gioco Lego 43230 Disney 100',
    link: 'https://www.vinted.fr/items/4896272400-gioco-lego-43230-disney-100',
    price: 89,
    released: '2024-09-22',
    uuid: 'b1d6748f-0b09-54c4-801b-be63bbdd897a'
  },
  {
    title: 'LEGO - Disney - La caméra Hommage à Walt Disney',
    link: 'https://www.vinted.fr/items/4167039593-lego-disney-la-camera-hommage-a-walt-disney',
    price: 99,
    released: '2024-09-20',
    uuid: '22f38d93-d41b-57ec-b418-626b8dc98859'
  },
  {
    title: 'Minifigurine lego disney minnie mouse',
    link: 'https://www.vinted.fr/items/4538862515-minifigurine-lego-disney-minnie-mouse',
    price: 10,
    released: '2024-09-19',
    uuid: 'ef4efcbf-ed3f-5801-8d50-93878ede9618'
  },
  {
    title: 'Lego 43230',
    link: 'https://www.vinted.fr/items/4756756098-lego-43230',
    price: 100,
    released: '2024-09-15',
    uuid: '2c915f88-9d39-5a39-9a11-bf2d2295a59c'
  },
  {
    title: 'Lego 43230 - Disney 100 Years',
    link: 'https://www.vinted.fr/items/4385404925-lego-43230-disney-100-years',
    price: 80,
    released: '2024-09-21',
    uuid: 'f2c5377c-84f9-571d-8712-98902dcbb913'
  },
  {
    title: 'Istruzioni Lego 43230',
    link: 'https://www.vinted.fr/items/4576548365-istruzioni-lego-43230',
    price: 8,
    released: '2024-09-16',
    uuid: 'e90b87b4-abba-5554-ba03-47981dc1041c'
  },
  {
    title: 'Lego Disney dumbo ',
    link: 'https://www.vinted.fr/items/4049649178-lego-disney-dumbo',
    price: 16,
    released: '2024-09-15',
    uuid: 'ac861b7e-e3bf-5e76-aa0d-1dc8a2544901'
  },
  {
    title: 'Lego Disney 100 43230',
    link: 'https://www.vinted.fr/items/4648154373-lego-disney-100-43230',
    price: 80,
    released: '2024-09-21',
    uuid: 'b5ad9808-18d9-5d98-a32b-c7aa57b391fd'
  },
  {
    title: 'Légo Caméra Disney 100ans 43230',
    link: 'https://www.vinted.fr/items/4126171841-lego-camera-disney-100ans-43230',
    price: 90,
    released: '2024-09-17',
    uuid: 'a4ca82af-3e8b-518a-8f55-59e0cbc1d81d'
  },
  {
    title: 'Lego 43230 Disney new',
    link: 'https://www.vinted.fr/items/3872250639-lego-43230-disney-new',
    price: 85,
    released: '2024-09-15',
    uuid: '5eb7f1d4-f871-526f-93e0-7b65057f68fd'
  },
  {
    title: 'Lego 43230',
    link: 'https://www.vinted.fr/items/3588915159-lego-43230',
    price: 84,
    released: '2024-09-20',
    uuid: 'ffc42f22-259c-5c06-b190-784577a2f282'
  },
  {
    title: 'Lego 43230 Disney 100 Years',
    link: 'https://www.vinted.fr/items/4896899367-lego-43230-disney-100-years',
    price: 90,
    released: '2024-09-16',
    uuid: 'b7c5c9b6-0b5e-553a-898f-c37f53062088'
  },
  {
    title: 'La caméra Hommage à Walt Disney lego set 43230',
    link: 'https://www.vinted.fr/items/4872522741-la-camera-hommage-a-walt-disney-lego-set-43230',
    price: 95,
    released: '2024-09-15',
    uuid: '5357bbf5-7232-5a6a-b48c-1e4f9a26ac68'
  },
  {
    title: 'LEGO Disney Cinepresa Omaggio a Walt Disney',
    link: 'https://www.vinted.fr/items/4804901822-lego-disney-cinepresa-omaggio-a-walt-disney',
    price: 100,
    released: '2024-09-17',
    uuid: '6819f6aa-5f4d-5acf-a663-caa52d8a8c90'
  },
  {
    title: 'Nieuw lego 100j disney camera 43230',
    link: 'https://www.vinted.fr/items/4210242141-nieuw-lego-100j-disney-camera-43230',
    price: 89,
    released: '2024-09-21',
    uuid: '493893cb-eb3b-5e0b-aa93-2b0d40723282'
  },
  {
    title: 'Lego Disney 43212 Le train en fête 100 ans édition limitée ',
    link: 'https://www.vinted.fr/items/4169227310-lego-disney-43212-le-train-en-fete-100-ans-edition-limitee',
    price: 34,
    released: '2024-09-16',
    uuid: '8f94784c-0871-53f4-abed-aebffabcd25a'
  },
  {
    title: 'Lego 43230 cinepresa Disney',
    link: 'https://www.vinted.fr/items/4111571308-lego-43230-cinepresa-disney',
    price: 90,
    released: '2024-09-16',
    uuid: 'bd568392-3a6d-54e0-a8e2-20791cf59ea6'
  }
];

/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO 11: Compute the average, the p95 and the p99 price value
// 1. Compute the average price value of the listing
// 2. Compute the p95 price value of the listing
// 3. Compute the p99 price value of the listing
// The p95 value (95th percentile) is the lower value expected to be exceeded in 95% of the vinted items


console.log("TODO 11 : \n");
//A. Average price value of the listing
const VINPrice = VINTED.map(vinted => vinted.price);
const initial = 0;
const sumInitial = VINPrice.reduce(
  (accumulator, currentValue) => accumulator + currentValue, 
  initial,
);
const avg = sumInitial / VINTED.length; 

console.log("Average price value : ", avg);

//B. p95 price value of the listing
/* The formula for the 95th percentile is:
The total number of entries (K) in the report is 50. So, K = 50.
Since the 95th percentile value (N) is being calculated, multiply the number of entries (K) with 0.95.
Therefore, N = 50 x 0.95 = 47.5.
In the below image, the section marked as 'Sorted based on Value' has the values arranged in ascending order. 
The 48th value in the sorted list is 289.615K. This is The 95th percentile value.
*/

const N = Math.round(VINPrice.length * 0.95);
const sortedVINPrice = VINPrice.sort(function(a,b) {return a - b;});
const p95 = sortedVINPrice[N-1];
console.log("p95 price value : ", p95);

//C. p99 price value of the listing

const N99 = Math.round(VINPrice.length * 0.99);
const p99 = sortedVINPrice[N99-1];
console.log("p99 price value : ", p99);

function Percentile(data, p){
  if(data !== null && data !== undefined && data.length !== 0){
    const k = data.length;
    let n = (k-1) * p; // because index starts at 0
    n = Math.ceil(n); // always rounds up
    let data_sorted = data.sort((a,b) => SortByPrice(a,b, "inc"));
    return data_sorted[n].price;
  }
  else return 0;
}


// 🎯 TODO 12: Very old listed items
// // 1. Log if we have very old items (true or false)
// // A very old item is an item `released` more than 3 weeks ago.

console.log("TODO 12 : \n");
const dealsWithDate = VINTED.map(deal => ({
  title: deal.title,
  released: deal.released
}));
const today = new Date();

for(let i = 0; i < dealsWithDate.length; i++){
  let Difference_In_Time = Math.abs(new Date(dealsWithDate[i].released).getTime() - today.getTime());
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  if(Difference_In_Days <= 21){
    dealsWithDate[i].isOld = true;
  }
  else{
    dealsWithDate[i].isOld = false;
  }
}

console.table(dealsWithDate); 


// 🎯 TODO 13: Find a specific item
// 1. Find the item with the uuid `f2c5377c-84f9-571d-8712-98902dcbb913`
// 2. Log the item

console.log("TODO 13 : \n");
const item = VINTED.find((element) => element.uuid === 'f2c5377c-84f9-571d-8712-98902dcbb913');
console.log(item);

// 🎯 TODO 14: Delete a specific item
// 1. Delete the item with the uuid `f2c5377c-84f9-571d-8712-98902dcbb913`
// 2. Log the new list of items

console.log("TODO 14 : \n");
for(let j = 0; j < VINTED.length; j++){
  if(VINTED[j].uuid === 'f2c5377c-84f9-571d-8712-98902dcbb913'){
    VINTED.splice(j, 1);
  }
}
console.log(VINTED);


// 🎯 TODO 15: Save a favorite item
// We declare and assign a variable called `sealedCamera`

console.log("TODO 15 : \n");
let sealedCamera = {
  title: 'La caméra Hommage à Walt Disney lego set 43230',
  link: 'https://www.vinted.fr/items/4872522741-la-camera-hommage-a-walt-disney-lego-set-43230',
  price: 95,
  released: '2024-09-15',
  uuid: '5357bbf5-7232-5a6a-b48c-1e4f9a26ac68'
};


// we make a copy of `sealedCamera` to `camera` variable
// and set a new property `favorite` to true
let camera = sealedCamera;

camera.favorite = true;

// 1. Log `sealedCamera` and `camera` variables
// 2. What do you notice?

console.log(sealedCamera);
console.log(camera);

//2. We notice that the 'favorite' proprety is added to 'camera' and 'sealedCamera' variables. 

// we make (again) a new assignment again
sealedCamera = {
  title: 'La caméra Hommage à Walt Disney lego set 43230',
  link: 'https://www.vinted.fr/items/4872522741-la-camera-hommage-a-walt-disney-lego-set-43230',
  price: 95,
  released: '2024-09-15',
  uuid: '5357bbf5-7232-5a6a-b48c-1e4f9a26ac68'
};

// 3. Update `camera` property with `favorite` to true WITHOUT changing sealedCamera properties

camera = {...sealedCamera, favorite: true};
console.log("New Update : \n",camera);
console.log(sealedCamera);

// 🎯 TODO 16: Compute the profitability
// From a specific deal called `deal`

const deal = {
  'title':  'La caméra Hommage à Walt Disney',
  'retail': 75.98,
  'price': 56.98,
  'legoId': '43230'
}

const pro = Math.round((deal.retail - deal.price)*100)/100;
console.log("Profitability : ", pro);

// 1. Compute the potential highest profitability based on the VINTED items
// 2. Log the value

//1. 
console.log("TODO 16 \n")
// We compute the profitability for each item in VINTED
for(let i = 0; i < VINTED.length; i++){
  VINTED[i].profitability = Math.round((VINTED[i].price - deal.price)*100)/100;
}

// We sort the items by profitability from highest to lowest
VINTED.sort(function(a,b){
  return b.profitability - a.profitability;
})

//2.
console.log(VINTED[0]); // The first item of the array contains the highest profitability


/**
 * 🎬
 * The End: last thing to do
 * 🎬
 */

// 🎯 LAST TODO: Save in localStorage
// 1. Save MY_FAVORITE_DEALERS in the localStorage
// 2. log the localStorage

let string = JSON.stringify(MY_FAVORITE_DEALERS);
localStorage.setItem('MY_FAVORITE_DEALERS', string);

