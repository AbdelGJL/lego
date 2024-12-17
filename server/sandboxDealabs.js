/* eslint-disable no-console, no-process-exit */

import { scrape as dealabsScrape } from './websites/dealabs.js';
import { scrape as vintedScrape } from './websites/vinted.js';
import * as mongo from './scripts/server.js';
import { promises as fs } from 'fs';

async function scrapePage(url) {

    try {
      const deals = await dealabsScrape(url);
      return deals;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  
}

// async function scrapePage(url, website, id = 0) {
//   let attempts = 0;
//   const maxAttempts = 5;
//   while (attempts < maxAttempts) {
//     try {
//       if (website === "dealabs") {
//         const deals = await dealabsScrape(url);
//         return deals;
//       } else {
//         const sales = await vintedScrape(url, id);
//         return sales;
//       }
//     } catch (error) {
//       attempts++;
//       console.error(`Error scraping ${url}, attempt ${attempts} of ${maxAttempts}:`, error);
//       if (attempts >= maxAttempts) {
//         return [];
//       }
//     }
//   }
// }

export async function sandbox(website = 'https://www.dealabs.com/groupe/lego') {
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
      const deals = await scrapePage(url);

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
    //await SaveInJSON(allDeals, "deals");
    console.log("📂 All deals stored in deals collection !");

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [, , eshop] = process.argv;
sandbox().catch(console.error);