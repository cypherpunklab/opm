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

## Viewing the html file

run the ord server in regtest mode with:

```
bun run server
```

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
