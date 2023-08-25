#!/usr/bin/env node
const { exec } = require('child_process');

function generateBlocks(num = 1) {
  const num_blocks = num;

  exec('ord -r wallet receive', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error fetching receive address: ${error}`);
      return;
    }

    const receive_address = JSON.parse(stdout.trim()).address;

    const cmd = `bitcoin-cli -chain=regtest generatetoaddress ${num_blocks} ${receive_address}`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating blocks: ${error}`);
        return;
      }

      console.log(`Result: ${stdout}`);
    });
  });
}

const num = parseInt(process.argv[2], 10) || 1;

generateBlocks(num);
