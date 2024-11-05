/* eslint-disable no-console, no-process-exit */
const dealabs = require('./websites/dealabs');
const fs = require('fs').promises;

async function scrapePage(url) {
  try {
    const deals = await dealabs.scrape(url);
    return deals;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return [];
  }
}

async function sandbox(website = 'https://www.dealabs.com/groupe/lego') {
  try {
    let allDeals = [];
    let page = 1;
    let hasMorePages = true;
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
  
    const jsonContent = JSON.stringify(allDeals, null, 2);
    await fs.writeFile("./deals.json", jsonContent, 'utf8');
    console.log("📂 All deals saved in deals.json!");


    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [, , eshop] = process.argv;

sandbox(eshop);

//https://www.avenuedelabrique.com/nouveautes-lego
//https://www.dealabs.com/groupe/lego?hide_expired=true&time_frame=30
//https://www.vinted.fr/catalog?search_text=21333&page=1