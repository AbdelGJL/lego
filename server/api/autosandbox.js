import { exec } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  const scriptPath = path.join(process.cwd(), 'sandboxDealabs.js');
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