//const fetch = (...args) => import('node-fetch').then(module => module.default(...args));
import fetch from 'node-fetch';
//import { TokenCookie, headers } from './utils.js'; // Assurez-vous que ces modules existent et sont correctement exportés
//import * as cheerio from 'cheerio';
//const cheerio = require('cheerio');
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
import { v4 as uuidv4 } from 'uuid';
//import { promises as fs } from 'fs';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*"',
  'Accept-Language': 'fr',
  Connection: 'keep-alive',
  Referer: `https://www.vinted.fr/catalog?search_text=10306&time=1731934165&brand_ids%5B%5D=89162&page=1&status_ids%5B%5D=6&status_ids%5B%5D=1`
};

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @param  {String} item_id - item id
 * @return {Object} deal
 */
const parse = (data, item_id) => {

  return data.items.map(item => {
    const title = item.title;
    const id = item_id;
    const price = parseFloat(item.total_item_price.amount); // total_item_price.amount sinon ça marche pas partout à confirmer c'est pas normal
    const link = item.url;
    const uuid = uuidv4();
    const published = item.photo.high_resolution.timestamp;
    return {
      id,
      title,
      price,
      link,
      published,
      uuid
    };
  });
};

/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @param {String} id - item id
 * @returns 
 */
// export async function scrape (url, id) {
//   try {
//     const { csrfToken, cookies } = await TokenCookie();
//     const response = await fetch(url, {
//       headers: {
//         ...headers,
//         'X-Csrf-Token': csrfToken,
//         Cookie: cookies
//       }
//     });

//     if (response.ok) {
//       const data = await response.json();
//       const jsonData = await parse(data, id);
//       return jsonData;
//     } else {
//       const errorText = await response.text();
//       console.error(`Response error : status ${response.status} - ${response.statusText}\n${errorText}`);
//       throw new Error(`Resonse error : status ${response.status} - ${response.statusText}`);
//     }
//   } catch (error) {
//     //console.error("Fetch error :", error);
//     console.error(`Error scraping ${url}:`, error);
//     //throw error;
//     return null;
//   }
// }

export async function scrape(url, id) {
  let attempts = 0;
  const maxAttempts = 10;
  const retryDelay = 10000; // 5 seconds delay between retries

  while (attempts < maxAttempts) {
    try {
      const { csrfToken, cookies } = await TokenCookie();
      const response = await fetch(url, {
        headers: {
          ...headers,
          'X-Csrf-Token': csrfToken,
          Cookie: cookies
        },
        timeout: 20000 // 10 seconds timeout
      });

      if (response.ok) {
        const data = await response.json();
        const jsonData = await parse(data, id);
        return jsonData;
      } else if (response.status === 429) {
        // Too Many Requests - wait and retry
        console.warn(`Rate limit exceeded, retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        attempts++;
      } else {
        const errorText = await response.text();
        console.error(`Response error : status ${response.status} - ${response.statusText}\n${errorText}`);
        throw new Error(`Response error : status ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      attempts++;
      console.error(`Error scraping ${url}, attempt ${attempts} of ${maxAttempts}:`, error);
      if (attempts >= maxAttempts) {
        return null;
      }
    }
  }
}

async function TokenCookie() {
  const response1 = await fetch("https://www.vinted.fr/", {
    headers: {
      "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    },
  });
  if (!response1.ok) {
    console.error(`Initial request failed with status: ${response1.status}`);
    return [];
  }
  const cookies = response1.headers.get("set-cookie");
  const text = await response1.text();
  const csrfTokenMatch = text.match(/"CSRF_TOKEN":"([^"]+)"/);
  const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : null;
  return { cookies, csrfToken };
}
