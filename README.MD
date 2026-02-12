# Ord Package Manager

A simple package manager for Ord with a html template engine. Provides scripts to test the packages in regtest mode.

## Requirements

- [Bun](https://bun.sh/)
- [Ord](https://github.com/ordinals/ord#installation)
- [Bitcoin Core](https://bitcoincore.org/en/download/)

## Installation

```bash
bun i
```

In one terminal run Bitcoind in regtest mode with:

```bash
sh regtest.sh
```

In another terminal initialize ord to run in regtest creating a wallet and funding it with:

```
sh create.sh
```

## Importing Ord Packages

Inside the `package.opm.json` file put the package name and the mainnet `inscriptionId` of the package.

```json
{
  "SomePackage": "<inscriptionId>",
  "SomeOtherPackage": "<inscriptionId>"
}
```

Download the package and inscribe them to regtest with.

```bash
bun run opm
```

This will create a new file `regtest.json` with the package `inscriptionIds` in your local regtest blockchain.

## Using packages

Inside the `./templates` folder create a template html file. This
uses the `./templates/template.ts` to inject the recusive `inscritionId` into the html file. This uses [handlbar.js](https://handlebarsjs.com/). The packages are injected into the html with the following syntax `{{packageName}}`.

Run the following command to create the html file and inscribe it to regtest. The file will be created in the `./build` folder.

```
bun run generate
```

## OCM Libraries (Three.js & p5.js)

OPM includes built-in support for [OCM Dimensions](https://github.com/metagood/OCM-Dimensions) on-chain libraries. These are production-proven libraries inscribed on Bitcoin that enable rich 3D and generative art via recursive inscriptions.

### Available OCM Packages

| Package | Library | Inscription |
|---------|---------|-------------|
| `OCMDimensions` | fflate + Three.js bundle | `2dbdf9ebb...i0` |
| `p5js` | p5.js creative coding | `255ce0c5a...i0` |

### How OCM Libraries Differ

Standard packages (like Matter.js) are plain JS files loaded via `<script src="/content/{{id}}">`. OCM libraries use a different pattern:

- **OCM Dimensions** is an HTML inscription containing compressed fflate (line 28) and Three.js (line 32) as embedded scripts
- Libraries are loaded by fetching the inscription, splitting by lines, and extracting the code
- This recursive approach is extremely space-efficient on Bitcoin

### Quick Start: Three.js

```bash
# 1. Download and inscribe all packages to regtest
bun run opm

# 2. Build and inscribe a Three.js artwork
bun run generate:threejs

# 3. View it
sh server.sh
```

Edit your artwork in `templates/threejs/template.html` — put your Three.js code inside the `userCode()` function.

### Quick Start: p5.js

```bash
bun run opm
bun run generate:p5js
sh server.sh
```

Edit your sketch in `templates/p5js/template.html` — put your p5.js code inside the `userCode()` function.

### Creating Custom OCM Templates

You can create your own templates that use the OCM loader pattern. The key is fetching the OCM Dimensions inscription and extracting libraries by line number:

```javascript
// Fetch OCM Dimensions bundle
const resp = await fetch("/content/{{OCMDimensions}}");
const html = await resp.text();
const lines = html.split("\n");

// Extract libraries
const fflateCode = lines[28];  // fflate compression library
const threeCode = lines[32];   // Three.js 3D library
```

For more details on the OCM workflow, compression, and advanced techniques, see the [OCM Dimensions repository](https://github.com/metagood/OCM-Dimensions).

## Viewing the html file

run the ord server in regtest mode with:

```
sh server.sh
```

will default to 8080 unless a port is passed `sh server 3000`

Then open the browser to `http://localhost:8080/`

## Utilites

Getting more sats to inscribe with or to mine an inscription. It will default to 1 block unless more are specified. Mine 100 blocks with:

```
sh mine.sh 100
```

Inscribe a file to regtest with:

```
bun run inscribe <file>
```

## Troubleshooting

You may need to delete the regtest index if you have issues. This is located in the following locations by default.

Linux: `~/.local/share/ord/`
Windows: `/roaming/ord/`
Mac: `/Users/<your-username>/Library/Application Support/ord/`

Delete the `regtest` folder. When you inscribe or run the server it will reindex.

If you also want to delete the regtest blockchain that is in the regtest folder on your bitcoin data directory. This will delete your regtest wallet you will need to initialize that again.

WARNING: Don't delete your mainnet index on accident it is also located in the `ord` folder.
