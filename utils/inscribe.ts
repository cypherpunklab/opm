import { exec } from 'child_process';
import { isOrdVersionGreaterOrEqual } from './checkordversion';

const isOrdV_GTE_0_10_0 = isOrdVersionGreaterOrEqual('0.10.0');

function runCommand(filename: string) {
  return new Promise((resolve, reject) => {
    const command = `ord -r wallet inscribe ${
      isOrdV_GTE_0_10_0 ? '--file' : ''
    } ${filename} --fee-rate 1 --no-backup`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      resolve(JSON.parse(stdout));
    });
  });
}

runCommand(process.argv[2])
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
