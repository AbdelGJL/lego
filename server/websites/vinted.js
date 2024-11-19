const fetch = (...args) => import('node-fetch').then(module => module.default(...args));
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

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
    const price = parseFloat(item.total_item_price); // total_item_price.amount sinon ça marche pas partout à confirmer c'est pas normal
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
module.exports.scrape = async (url, id) => {
  try {
    const { csrfToken, cookies } = await TokenCookie();
    const response = await fetch(url, {
      headers: {
        ...headers,
        'X-Csrf-Token': csrfToken,
        Cookie: cookies
      }
    });

    if (response.ok) {
      const data = await response.json();
      const jsonData = await parse(data, id);
      return jsonData;
    } else {
      const errorText = await response.text();
      console.error(`Response error : status ${response.status} - ${response.statusText}\n${errorText}`);
      throw new Error(`Resonse error : status ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error("Fetch error :", error);
    throw error;
  }

  return null;
};

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
