/* eslint-disable no-console, no-process-exit */
const { Console } = require('console');
const dealabs = require('./websites/dealabs');
const vinted = require('./websites/vinted');
const fs = require('fs').promises;

const array = [
  {
    "id": "60400",
    "title": "2 bonnets de père Noël",
    "price": 1.75,
    "link": "https://www.vinted.fr/items/4432393717-2-bonnets-de-pere-noel",
    "published": 1714373356,
    "uuid": "0e9b1b7e-744d-4fab-8cf6-c040ef3559cc"
  },
  {
    "id": "76914",
    "title": "Lego speed champion Ferrari 76914 neuf",
    "price": 20.65,
    "link": "https://www.vinted.fr/items/5327925020-lego-speed-champion-ferrari-76914-neuf",
    "published": 1730716359,
    "uuid": "1d15488e-a734-4302-bd41-7c6f6fe1fcb0"
  }
]

async function scrapePage(url, website, id = 0) {
  if (website === "dealabs") {
    try {
      const deals = await dealabs.scrape(url);
      return deals;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }
  else {
    try {
      const sales = await vinted.scrape(url, id);
      return sales;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }

}

async function sandbox(website = 'https://www.dealabs.com/groupe/lego') {
  try {
    let allDeals = [];
    let page = 1;
    let hasMorePages = true;
    // Scrapping dealabs
    console.log(`🕵️‍♀️  browsing ${website}`);

    while (hasMorePages) {
      const url = `${website}?hide_expired=true&time_frame=30&page=${page}`;
      console.log(`📃 Scraping page ${page}...`);
      const deals = await scrapePage(url, "dealabs");

      if (deals.length === 0) {
        hasMorePages = false;
      } else {
        allDeals = allDeals.concat(deals);
        page++;
      }
    }

    console.log(`📥 Saving...`);
    await SaveInJSON(allDeals, "deals");
    console.log("📂 All deals saved in deals.json!");

    //Scrapping vinted
    website = 'https://www.vinted.fr/';
    console.log(`🕵️‍♀️  browsing ${website}`);
    let allSales = [];
    let allIds = idsArray(allDeals);
    allIds = allIds.filter(item => item !== null);
    for (const id of allIds) {
      page = 1;
      hasMorePages = true;
      allSales = [];
      console.log(`📃 Scraping lego ${id}...`);
      while (hasMorePages) {
        const url = `${website}api/v2/catalog/items?page=${page}&per_page=96&search_text=${id}&catalog_ids=&size_ids=&brand_ids=&status_ids=&color_ids=&material_ids=`;
     // https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1731934165&search_text=10306&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&material_ids=
        const sales = await scrapePage(url, "vinted", id);

        if (sales.length === 0) {
          hasMorePages = false;
        } else {
          allSales = allSales.concat(sales);
          console.log(`sale of page ${page} added!`);
          page++;
        }
      }
      //Here we ask the function our sales scrapped are all lego one or not before saving
      //à tester
      //allSales = CleanSales(allSales)
      console.log(`📥 Saving...`);
      await SaveInJSON(allSales, id);
      console.log(`📂 All sales of lego ${id} saved in ${id}.json!`);
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function SaveInJSON(data, filename) {
  const jsonContent = JSON.stringify(data, null, 2);
  if (filename === "deals")
    await fs.writeFile("./deals/" + filename + ".json", jsonContent, 'utf8');
  else
    await fs.writeFile("./sales/" + filename + ".json", jsonContent, 'utf8');
}

function idsArray(array) {
  const uniqueIds = new Set(array.map(item => item.id));
  return Array.from(uniqueIds);
}

function CleanSales(array) {
  array.forEach(obj => {
    console.log(obj.title.substring('lego'));
    if (obj.id === '60400') {
      array.pop(obj);
    }
  });
  return array;
}

const [, , eshop] = process.argv;
const newArray = CleanSales(array);
console.log(newArray);

//sandbox(eshop);

/* A ajouter/tester : 
Tester la fonction CleanSales (il faut changer la condition + .pop qui n'est pas la bonne fonction)
Créer une fonction qui delete tous les JSON du dossier sales
*/
// Pas besoin du coup faut utiliser ce lien à la place : https://www.vinted.fr/catalog?search_text=10306&time=1731934165&brand_ids%5B%5D=89162&page=1&status_ids%5B%5D=6&status_ids%5B%5D=1