/* eslint-disable no-console, no-process-exit */
import { scrape as vintedScrape } from './websites/vinted.js';
import db from './db/conn.mjs';
import { promises as fs } from 'fs';
import * as mongo from './scripts/server.js';

async function scrapePage(url, id = 0) {
  let attempts = 0;
  const maxAttempts = 10;
  const retryDelay = 10000; // 10 seconds delay between retries

  while (attempts < maxAttempts) {
    try {
      const sales = await vintedScrape(url, id);
      return sales;
    } catch (error) {
      attempts++;
      console.error(`Error scraping ${url}, attempt ${attempts} of ${maxAttempts}:`, error);
      if (attempts >= maxAttempts) {
        return [];
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

async function scrapeLegoId(id) {
  let page = 1;
  let hasMorePages = true;
  let allSales = [];
  const website = 'https://www.vinted.fr/';
  console.log(`📃 Scraping lego ${id}...`);
  while (hasMorePages) {
    const url = `${website}api/v2/catalog/items?page=${page}&per_page=96&search_text=${id}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&material_ids=`;
    const sales = await scrapePage(url, id);

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
    await mongo.run(allSales, id);
    console.log(`📂 All sales of lego ${id} stored in ${id} collection !`);
  }
}

export async function sandbox(allDeals) {
  try {
    const allIds = idsArray(allDeals);
    const batchSize = 3;

    for (let i = 0; i < allIds.length; i += batchSize) {
      const batch = allIds.slice(i, i + batchSize);
      await Promise.all(batch.map(id => scrapeLegoId(id)));
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
  const website = 'https://www.vinted.fr/';
  console.log(`🕵️‍♀️  browsing ${website}`);
  let allSales = [];
  let page = 1;
  let hasMorePages = true;
  allSales = [];
  console.log(`📃 Scraping lego ${id}...`);
  while (hasMorePages) {
    const url = `${website}api/v2/catalog/items?page=${page}&per_page=96&search_text=${id}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&material_ids=`;
    const sales = await scrapePage(url, id);

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
    await mongo.run(allSales, id);
    console.log(`📂 All sales of lego ${id} stored in ${id} collection !`);
  }
}

const [, , eshop] = process.argv;
const collection = db.collection('deals');
const allDeals = await collection.find({}).toArray();
await sandbox(allDeals).catch(console.error);