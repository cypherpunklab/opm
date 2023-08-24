const fs = require('fs');
const Handlebars = require('handlebars');
const execSync = require('child_process').execSync;

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
  await execSync(
    `ord -r wallet inscribe ../build/inscription.html --fee-rate 1 --no-backup`
  );

  // mine the inscription
  let receiveAddress = execSync('ord -r wallet receive');
  receiveAddress = receiveAddress.toString().trim();
  receiveAddress = JSON.parse(receiveAddress).address;

  await execSync(`bitcoin-cli generatetoaddress 1 ${receiveAddress}`);
  console.log('Inscription mined!');
}

inscribe();
