// const fetch = (...args) => import('node-fetch').then(module => module.default(...args));
// const cheerio = require('cheerio');
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Cookie': 'f_v=%22d38d513a-66ac-11ef-8885-0242ac110002%22; dont-track=1; f_c=0; g_p=0; cookie_policy_agreement=3; browser_push_permission_requested=1727095720; cf_clearance=Igo6UMGKv.zLs6iHnFbIMrGb1GucwV2yQdpIzazrqu8-1727697815-1.2.1.1-k8EX33g9gWKJzqVzuDOfIdcLGDkll0ykOgc15JADlItgYU8ZWyS5SQ9Y06hq2fA4HVqBns2PEKtBZeQTBOZKS0tg99JCr83pjStt5ZLgL5ZsRlN0ZutF4ExYyv7JbROEW4KFBC7APM1SDNidr_bZur9VR6w7__H1ormVWCjaj0COIXU7TYAXp1OCFDvmRQD_m.yATayiJq.MFQjlYRmu2uY.y6_8KN6HiWtF2erK_o9GKPeXnuGYtdfn6CwW7S3B1WFK.yMMuNK4XCTmZR6FOSlniZqBKqZTuL0XRLO5BURlFMdXcL5W6v2FGFJuPAH5gun_yYyH2FAXv44Ka4UmTEOQQ7SSRxjWkgzMjvn.3BV7zs0Qk1tlo2xWibHvGmb4SwnXaN0KYljGNMwrpE0b9bHykevb_tNPUpPdJmUsR.B8Zi9b6Mxsen2H7rjzyOVE; _groove_session_2=MU11dzJkV0hqSzlEeGxFR2M1MVFOMkFNT2Y0aUFWVE54cm1UbGU4by9RUWd0U0Exd1ZsRk5TM0JhTkpJRlpSN2NkcDFIRlU3SWZBNkdmRUQ4RG45UDBEMDFlMGpqN2VCbm9kVDhDd1UyMnF3cUhUeHpPcjFxZkxSbTdJTWJjR0ZtcUhUWC9BS0p6NVhtQmRaSnlzWlF3PT0tLVQ5ck94OERaMC9Cd2dMMFZTNmhmalE9PQ%3D%3D--3149455dd748a72ef8d98573c8614010ad6281de; DI=%7B%22CW%22%3A%7B%22targets%22%3A%5B%22N%22%5D%2C%22data%22%3Anull%7D%2C%22TV%22%3A%7B%22targets%22%3A%5B%7B%222890883%22%3A%22down%22%7D%5D%2C%22data%22%3Anull%7D%7D; navi=%7B%22homepage%22%3A%22highlights%22%2C%22threadTypeId-1%22%3A%22hot%22%7D; mascot=eyJpdiI6ImtEQlRUR0JMOU5McXZ3UzVHU0h0U3c9PSIsInZhbHVlIjoiZEtwNUpSL1ZvbExyR2FkY0lPblJUSHR1ZGFkUFZmQUg4ODBtb25saGp2UVlicW9hanJUeDlucUw0NUN4eFYxOTdXcFhIaFp4bERsbDBIUDZRdnh3d3U0K09iVXl6czZId01Yd1ZiZXNaYnoybWNXNkQ1b0xONkRXTVl4MnBTak9lK3VJRzYzWjZSY0wwVWJ4bUlKZzFrTFplcDVIeDRXRHRFbFhuc1MxN3c3Sk56MlltVDM5N0FEZ2tneUtzcVc5VWZrWFNYdUtzRjlvZzN4bGNvWkFRWU1pdzNiZTBnQndjTDlmNjhCbWl4VT0iLCJtYWMiOiJmOGZiMWNiMDEyMTcxN2I1ZjIzOTQ3NjU3OWFjMTM1OGJjM2QwODAyOGUwYjc3NDQ3ZDc2Y2ZlNWI4MDA3MDgxIiwidGFnIjoiIn0%3D; pepper_session=%22lo2jdyer02As0Zkf5Nhz4iKEccsh4MC4JQDQikki%22; xsrf_t=%22HbsuIlu2eIkSXYKyoyq7aX04n7J7g0gnGtxQqdZQ%22; u_l=0; __cf_bm=7Q1luScM4nutyXiPcvGL64CYjVWWtgs6u084oI6HHhM-1730811624-1.0.1.1-jmyN.26pYx7Pq_D7AyBWxH0yRbxnzO64VLHmkse32qBwRuZMSo5kIilxtyB0TtdfQYVh_VDnj4LcRwcU2l2YEQ'
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