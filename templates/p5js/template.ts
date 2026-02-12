import fs from "fs";
import Handlebars from "handlebars";
import { execSync } from "child_process";
import path from "path";
import { isOrdVersionGreaterOrEqual } from "../../utils/checkordversion";

const isOrdV_GTE_0_10_0 = isOrdVersionGreaterOrEqual("0.10.0");
const dir = path.join(import.meta.dir, "../../build");

// Read template file
const templateFile = fs.readFileSync(
  path.join(import.meta.dir, "template.html"),
  "utf8"
);
const template = Handlebars.compile(templateFile);

// Read regtest inscription IDs
const libraries = JSON.parse(
  fs.readFileSync(path.join(import.meta.dir, "../../regtest.json"), "utf8")
);

// Generate the HTML with OCM Dimensions + p5.js inscription IDs
const html = template({
  OCMDimensions: libraries.OCMDimensions,
  p5js: libraries.p5js,
});

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

fs.writeFileSync(path.join(dir, "inscription.html"), html);
console.log("p5.js inscription built → build/inscription.html");

async function inscribe() {
  const command = `ord -r wallet inscribe ${isOrdV_GTE_0_10_0 ? "--file" : ""} ${dir}/inscription.html --fee-rate 1 --no-backup`;
  await execSync(command);

  let receiveAddress: string | Buffer = execSync("ord -r wallet receive");
  receiveAddress = receiveAddress.toString().trim();
  receiveAddress = JSON.parse(receiveAddress).address;

  await execSync(
    `bitcoin-cli -regtest generatetoaddress 1 ${receiveAddress}`
  );

  console.log("p5.js inscription mined!");
}

inscribe();
