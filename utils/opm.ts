import fs from "fs"
import https from "https"
import { EXPLORER } from "../constants";
import { execSync } from "child_process";
import path from "path"

// This will work only in Bun
const dir = path.join(import.meta.dir, "../lib")

import libraries from "../package.opm.json"

function downloadLibrary(library: string, inscriptionId: string) {
  return new Promise((resolve, reject) => {
    const path = `${EXPLORER}/content/${inscriptionId}`;
    https.get(path, (res) => {
      let data = '';
      let ext = '';

      switch (res.headers['content-type']) {
        case 'text/javascript':
          ext = '.js';
          break;
        case 'text/css':
          ext = '.css';
          break;
        case 'text/plain':
          ext = '.txt';
          break;
        case 'text/html':
          ext = '.html';
          break;
        case 'text/html;charset=utf-8':
          ext = '.html';
          break;
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }

        const filePath = `${dir}/${library}${ext}`;
        fs.writeFile(filePath, data, (err) => {
          if (err) {
            reject(err);
            return;
          }
          console.log(`The file ${filePath} has been saved!`);
          resolve(library);
        });
      });
    });
  });
}

async function run() {
  const downloadPromises = Object.keys(libraries).map((library) => {
    const inscriptionId = libraries[library];
    return downloadLibrary(library, inscriptionId);
  });

  try {
    const downloadedLibraries = await Promise.all(downloadPromises);
    console.log('Downloaded libraries:', downloadedLibraries);

    let inscriptions = {};
    fs.readdirSync(dir).forEach((file) => {
      const command = `ord -r wallet inscribe ${dir}/${file} --fee-rate 1 --no-backup`;
      let output = execSync(command);
      const outputString = output.toString();
      const outputObj = JSON.parse(outputString);

      inscriptions[path.parse(file).name] = outputObj.inscription;
    });

    // This will work only in Bun
    const jsonFilePath = path.join(import.meta.dir, '../regtest.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(inscriptions, null, 2));
    console.log(`Inscriptions saved to ${jsonFilePath}`);

    let receiveAddress: string | Buffer = execSync('ord -r wallet receive');
    receiveAddress = receiveAddress.toString().trim();
    receiveAddress = JSON.parse(receiveAddress).address;

    execSync(`bitcoin-cli -regtest generatetoaddress 1 ${receiveAddress}`);
    console.log('Libraries mined!');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
