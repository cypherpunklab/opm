#!/usr/bin/env node

import { exec } from "child_process"

function executeCommand(command: string) {
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
    let receiveAddress = await executeCommand('ord -r wallet receive') as any;
    receiveAddress = receiveAddress.toString().trim();
    receiveAddress = JSON.parse(receiveAddress).address;

    await executeCommand(`bitcoin-cli -regtest generatetoaddress 120 ${receiveAddress}`);

    let balance = await executeCommand('ord -r wallet balance') as any;
    balance = balance.toString().trim();
    balance = JSON.parse(balance);
    console.log('Initialized ord wallet');
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }
}

main();
