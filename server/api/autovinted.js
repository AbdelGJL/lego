// import { sandbox } from '../sandboxVinted.js';
// import db from '../db/conn.mjs';

// export default async function handler(req, res) {
//   try {
//     const collection = db.collection('deals');
//     const allDeals = await collection.find({}).toArray();
//     let middle = parseInt(Math.floor(allDeals.length / 2));
//     sandbox(0, middle);
//     await sandbox(middle + 1, allDeals.length);
//     res.status(200).send('Scrapping Vinted executed successfully');
//   } catch (error) {
//     console.error('Error executing sandbox:', error);
//     res.status(500).send('Error when script executed');
//   }
// }

import { exec } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  const scriptPath = path.join(process.cwd(), 'sandboxVinted.js');
  exec(`node ${scriptPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error('Error executing sandbox:', stderr);
      res.status(500).send('Error when script executed');
      return;
    }
    console.log('Sandbox output:', stdout);
    res.status(200).send('Sandbox executed successfully');
  });
}