// const fetch = (...args) => import('node-fetch').then(module => module.default(...args));
// const cheerio = require('cheerio');
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";
dotenv.config();

const cookie = process.env.SCRAPER_COOKIES;

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Cookie': cookie
};

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.js-threadList article')
    .map((i, element) => {
      // Extract
      const dataVue = $(element).find('div.js-vue2').attr('data-vue2');
      const dataVueJson = JSON.parse(dataVue);

      const title = dataVueJson.props.thread.title;
      const link = dataVueJson.props.thread.shareableLink;
      const price = parseFloat(dataVueJson.props.thread.price);
      const retail = parseFloat(dataVueJson.props.thread.nextBestPrice);
      const discountValue = Math.round((1 - (price/retail))*100);
      let discount = 0;
      if(isNaN(discountValue)){
        discount = null;
      }
      else{
        discount = Math.abs(parseInt(discountValue));
      }
      const temperature = dataVueJson.props.thread.temperature;
      const comments = dataVueJson.props.thread.commentCount;
      const published = dataVueJson.props.thread.publishedAt;
      const community = "dealabs";

      const parenthesisMatch = title.match(/\((\d{5,})\)/);
      let id = parenthesisMatch ? parenthesisMatch[1] : null;
      if (!id) {
        const words = title.split(' ');
        id = words.find(word => /^\d{5,}$/.test(word)) || null;
      }

      const dataVue2 = $(element).find('div.threadGrid div div').attr('data-vue2');
      const dataVue2Json = JSON.parse(dataVue2);

      const photo = dataVue2Json.props.threadImageUrl;
      const uuid = uuidv4();

      return {
        title,
        link,
        price,
        retail,
        discount,
        temperature,
        comments,
        published,
        community,
        id,
        photo,
        uuid
      };
      
    })
    .get();
};

/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */
export async function scrape(url) {
  const response = await fetch(url, { headers });

  if (response.ok) {
    const body = await response.text();

    return parse(body);
  }

  console.error(response);

  return [];
}