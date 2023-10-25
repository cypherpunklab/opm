import fs from "fs"
import Handlebars from "handlebars"
import { execSync } from "child_process";
import path from "path"
import { isOrdVersionGreaterOrEqual } from "../utils/checkordversion";

const isOrdV_GTE_0_10_0 = isOrdVersionGreaterOrEqual("0.10.0");

// This will work only in Bun
const  dir = path.join(import.meta.dir, "../build")

// Read template file
let templateFile = fs.readFileSync('./templates/template.html', 'utf8');

// Compile the template
let template = Handlebars.compile(templateFile);

// Read and parse the JSON data file
let libraries = JSON.parse(fs.readFileSync('./regtest.json', 'utf8'));

// Generate the HTML
let html = template({ MatterJS: libraries.MatterJS });

// Check if build directory exists, if not, create it
if (!fs.existsSync('./build')) {
  fs.mkdirSync('./build');
}

// Write the HTML to a new file in the build directory
fs.writeFileSync('./build/inscription.html', html);

async function inscribe() {
  // inscribe the HTML file

  const command = `ord -r wallet inscribe ${isOrdV_GTE_0_10_0 ? "--file": ""} ${dir}/inscription.html --fee-rate 1 --no-backup`;

  await execSync(command);

  // mine the inscription
  let receiveAddress: string | Buffer = execSync('ord -r wallet receive');
  receiveAddress = receiveAddress.toString().trim();
  receiveAddress = JSON.parse(receiveAddress).address;

  await execSync(`bitcoin-cli generatetoaddress 1 ${receiveAddress}`);
  console.log('Inscription mined!');
}

inscribe();
