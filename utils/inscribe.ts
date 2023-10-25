import { exec } from "child_process";

function runCommand(filename: string) {
  return new Promise((resolve, reject) => {
    const command = `ord -r wallet inscribe ${filename} --fee-rate 1 --no-backup`;
    console.log(command);
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
