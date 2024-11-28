/* eslint-disable no-console, no-process-exit */
// const { Console } = require('console');
// const dealabs = require('./websites/dealabs');
// const vinted = require('./websites/vinted');
// const mongo = require('./server.js');
// const fs = require('fs').promises;
import { scrape as dealabsScrape } from './websites/dealabs.js';
import { scrape as vintedScrape } from './websites/vinted.js';
import * as mongo from './server.js';
import { promises as fs } from 'fs';

async function scrapePage(url, website, id = 0) {
  if (website === "dealabs") {
    try {
      const deals = await dealabsScrape(url);
      return deals;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }
  else {
    try {
      const sales = await vintedScrape(url, id);
      return sales;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }
}

async function sandbox(website = 'https://www.dealabs.com/groupe/lego') {
  try {
    await mongo.clearUpdate();
    
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
    allDeals = allDeals.filter(item => item.id !== null);


    console.log(`📥 Saving...`);
    await mongo.run(allDeals, "deals");
    await SaveInJSON(allDeals, "deals");
    console.log("📂 All deals stored in deals collection !");

    
    //Scrapping vinted
    website = 'https://www.vinted.fr/';
    console.log(`🕵️‍♀️  browsing ${website}`);
    let allSales = [];
    let allIds = idsArray(allDeals);
    //allIds = allIds.filter(item => item !== null);
    for (const id of allIds) {
      page = 1;
      hasMorePages = true;
      allSales = [];
      console.log(`📃 Scraping lego ${id}...`);
      while (hasMorePages) {
        const url = `${website}api/v2/catalog/items?page=${page}&per_page=96&search_text=${id}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&material_ids=`;
        const sales = await scrapePage(url, "vinted", id);

        if (sales.length === 0) {
          hasMorePages = false;
        } else {
          allSales = allSales.concat(sales);
          console.log(`sale of page ${page} added!`);
          page++;
        }
      }

      if (allSales.length !== 0) {
        console.log(`📥 Saving...`);
        await SaveInJSON(allSales, id);
        await mongo.run(allSales, id);
        console.log(`📂 All sales of lego ${id} stored in ${id} collection !`);
      }

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

async function AddManualy(id = "42151") {
  website = 'https://www.vinted.fr/';
  console.log(`🕵️‍♀️  browsing ${website}`);
  let allSales = [];
  //let allIds = idsArray(allDeals);
  page = 1;
  hasMorePages = true;
  allSales = [];
  console.log(`📃 Scraping lego ${id}...`);
  while (hasMorePages) {
    const url = `${website}api/v2/catalog/items?page=${page}&per_page=96&search_text=${id}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&material_ids=`;
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

  if (allSales.length !== 0) {
    console.log(`📥 Saving...`);
    await SaveInJSON(allSales, id);
    await mongo.run(allSales, id);
    console.log(`📂 All sales of lego ${id} stored in ${id} collection !`);
  }

}

const [, , eshop] = process.argv;
sandbox().catch(console.error);
//sandbox(eshop);
//AddManualy();

