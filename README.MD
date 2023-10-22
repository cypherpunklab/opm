# Ord Package Manager

A simple package manager for Ord with a html template engine. Provides scripts to test the packages in regtest mode.

## Requirements

- Node.js
- npm
- [Ord](https://github.com/ordinals/ord#installation)
- [Bitcoin Core](https://bitcoincore.org/en/download/)

## Installation

```bash
npm i
```

In one terminal run Bitcoind in regtest mode with:

```bash
npm run regtest
```

In another terminal initialize ord to run in regtest creating a wallet and funding it with:

```
npm run create
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
npm run opm
```

This will create a new file `regtest.json` with the package `inscriptionIds` in your local regtest blockchain.

## Using packages

Inside the `./templates` folder create a template html file. This
uses the `./templates/template.js` to inject the recusive `inscritionId` into the html file. This uses [handlbar.js](https://handlebarsjs.com/). The packages are injected into the html with the following syntax `{{packageName}}`.

Run the following command to create the html file and inscribe it to regtest. The file will be created in the `./build` folder.

```
npm run generate
```

## Viewing the html file

run the ord server in regtest mode with:

```
npm run server
```

Then open the browser to `http://localhost:8080/`

## Utilites

Getting more sats to inscribe with or to mine an inscription. It will default to 1 block unless more are specified. Mine 100 blocks with:

```
npm run mine 100
```

Inscribe a file to regtest with:

```
npm run inscribe <file>
```

## Troubleshooting

You may need to delete the regtest index if you have issues. This is located in the following locations by default.

Linux: `~/.local/share/ord/`
Windows: `/roaming/ord/`
Mac: `/Users/<your-username>/Library/Application Support/ord/`

Delete the `regtest` folder. When you inscribe or run the server it will reindex.

If you also want to delete the regtest blockchain that is in the regtest folder on your bitcoin data directory. This will delete your regtest wallet you will need to initialize that again.

WARNING: Don't delete your mainnet index on accident it is also located in the `ord` folder.

## TODO

- Make packages that have recursive dependencies example react
- Make work with mainnet
- Make compatible with OCM three.js and other libraries under that workflow
- Make GPT-4 library analysis tool for libraries to index what they do and what they are used for. Have it find orginal library documentation and link to it, come up with a percentage of how much the library is similar to the original library. Could also be useful for updates to libraries. This could live in its own seperate repo. With a github action.
- Index libraries that update to new versions by inscribing to the same sat as the original library.
- Create a global commandline tool to automate `opm.libraries.json` file creation.
- Make it so it will skip downloading if the package already exits in the lib folder.
