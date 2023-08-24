const fs = require('fs');
const https = require('https');
const { EXPLORER } = require('../constants');
const execSync = require('child_process').execSync;
const path = require('path');
const dir = path.join(__dirname, '../lib');

const libraries = require('../package.opm.json');

function downloadLibrary(library, inscriptionId) {
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
      let output = execSync(
        `ord -r wallet inscribe ${dir}/${file} --fee-rate 1 --no-backup`
      );
      const outputString = output.toString();
      const outputObj = JSON.parse(outputString);

      inscriptions[path.parse(file).name] = outputObj.inscription;
    });

    const jsonFilePath = path.join(__dirname, '../regtest.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(inscriptions, null, 2));
    console.log(`Inscriptions saved to ${jsonFilePath}`);

    let receiveAddress = await execSync('ord -r wallet receive');
    receiveAddress = receiveAddress.toString().trim();
    receiveAddress = JSON.parse(receiveAddress).address;

    await execSync(`bitcoin-cli generatetoaddress 1 ${receiveAddress}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
