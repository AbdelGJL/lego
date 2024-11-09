/* eslint-disable no-console, no-process-exit */
const { Console } = require('console');
const dealabs = require('./websites/dealabs');
const vinted = require('./websites/vinted');
const fs = require('fs').promises;

async function scrapePage(url, website, id = 0) {
  if(website === "dealabs"){
    try {
      const deals = await dealabs.scrape(url);
      return deals;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }
  else{
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
        const sales = await scrapePage(url, "vinted", id);
            
        if (sales.length === 0) {
          hasMorePages = false;
        } else {
          allSales = allSales.concat(sales); 
          console.log(`sale of page ${page} added!`);
          page++;
        }
      }
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

async function SaveInJSON(data, filename){
  const jsonContent = JSON.stringify(data, null, 2);
  if (filename === "deals")
    await fs.writeFile("./deals/"+filename+".json", jsonContent, 'utf8');
  else
    await fs.writeFile("./sales/"+filename+".json", jsonContent, 'utf8');
}

function idsArray(array){
  const uniqueIds = new Set(array.map(item => item.id));
  return Array.from(uniqueIds);
}

const [, , eshop] = process.argv;

sandbox(eshop);