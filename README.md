# OpenSea Uploader

This is the example repository for my blog post [How to Mint 100,000 NFTs For Free](https://medium.com/@andre.rabold/how-to-mint-100-000-nfts-for-free-62d83888ff6).

Please note that this is merely a proof of concept on how to use dAppeteer/Puppeteer and JavaScript (more specifically TypeScript) to automate websites. **I do not encourage using any of the code below to interact with OpenSea.io or any other 3rd party websites**. Please make sure to explicitly check the respective terms of services of the website you interact with, to avoid being permanently banned and getting your content removed. Please don't use this script to mint 100,000 tokens on OpenSea.io - that was just a flashy headline trying to grab your attention ¯\\\_(ツ)\_/¯. Having that said, using scripting to automate manual tasks is a great way to learn JavaScript, HTML, as well as to save time and money.

![Preview](./docs/preview.gif)

## Prerequisites

You will need the [mnemonic phrase for your MetaMask wallet](https://metamask.zendesk.com/hc/en-us/articles/360015290032-How-to-reveal-your-Secret-Recovery-Phrase) (aka "Secret Recovery Phrase") that should receive the newly minted NFTs. The code below will use the phrase to automatically set up and connect your wallet. However, the phrase is a secret, so make sure to not share it with anyone and don't ever commit it to git.

You will also need an OpenSea.io account by connecting the same MetaMask wallet and a [new empty collection](https://opensea.io/collection/create). Note the name and URL of the collection. You will need it below.

## First Start

First, install all dependencies using `npm`:

```sh
npm install
```

Then create a new file `.env` and add your information:

```sh
METAMASK_MNEMONIC_PHRASE="add your twelve word secret metamask recovery phrase here"
COLLECTION_NAME="my-first-collection"
DESCRIPTION="My first NFT created in OpenSea"
URL=https://example.com
```

This file must never be committed to git. The secret mnemonic phrase is used to automatically set up your wallet and connect it to the OpenSea.io account. The collection name is the ID of an existing collection on OpenSea.io. Set a short description and the URL for an external link that will be added to every NFT minted.

Finally, create a new subdirectory `images`, and place your images in there. The name of each file will also be used as the NFT asset name in OpenSea.

Then run the script:

```sh
npm start
```
