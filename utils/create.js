#!/usr/bin/env node

const { exec } = require('child_process');

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function main() {
  try {
    await executeCommand('ord -r wallet create');
    let receiveAddress = await executeCommand('ord -r wallet receive');
    receiveAddress = receiveAddress.toString().trim();
    receiveAddress = JSON.parse(receiveAddress).address;

    await executeCommand(`bitcoin-cli -regtest generatetoaddress 120 ${receiveAddress}`);

    let balance = await executeCommand('ord -r wallet balance');
    balance = balance.toString().trim();
    balance = JSON.parse(balance);
    console.log('Initialized ord wallet');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();
