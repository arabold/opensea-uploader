import puppeteer, { Page } from "puppeteer";
import * as dappeteer from "@chainsafe/dappeteer";
import * as DotEnv from "dotenv";
import fs from "fs";
import path from "path";
DotEnv.config();

const seed = process.env.METAMASK_MNEMONIC_PHRASE;
const collectionName = process.env.COLLECTION_NAME;
const createAssetURL = `https://opensea.io/collection/${collectionName}/assets/create`;
const description = process.env.DESCRIPTION;
const link = process.env.URL;
const imageDir = path.join(__dirname, "images");

async function connectWallet(page: Page, metamask: dappeteer.Dappeteer) {
  // OpenSea gives us a list of different wallet options. MetaMask is the first one.
  console.log("Connecting to Metamask...");

  // Force list of wallets to refresh as otherwise OpenSea sometimes doesn't detect MetaMask properly
  const moreButton = await page.$x('//button[contains(.,"Show more options")]');
  await moreButton[0].click();
  await page.waitForTimeout(1000);

  // Find the MetaMask button and click it
  const metaMaskButton = await page.$x(
    '//button[.//span[contains(text(),"MetaMask")]]'
  );
  await metaMaskButton[0].click();
  await page.waitForTimeout(2000);

  await metamask.approve();
  console.log("Wallet connected");
}

async function uploadImage(page: Page, filepath: string) {
  const elementHandle = await page.$("#media");
  await elementHandle.uploadFile(filepath);
}

async function fillFields(
  page: Page,
  name: string,
  description: string,
  link: string
) {
  // Get and fill in the input name
  await page.focus("#name");
  await page.keyboard.type(name, { delay: 25 });

  // Get and fill in the description
  await page.focus("#description");
  await page.keyboard.type(description, { delay: 25 });

  await page.focus("#external_link");
  await page.keyboard.type(link, { delay: 25 });
}

async function main() {
  // Launch the browser with MetaMask
  const browser = await dappeteer.launch(puppeteer, {
    metamaskVersion: "v10.1.1",
  });
  const metamask = await dappeteer.setupMetamask(browser, { seed });

  // Open OpenSea.io website in a new tab
  console.log("Launching OpenSea...");
  const page = await browser.newPage();
  await page.goto(createAssetURL, { waitUntil: "networkidle0" });
  await page.bringToFront();

  // Close first empty tab
  const tabs = await browser.pages();
  await tabs[0].close();

  // Connect OpenSea with MetaMask
  await connectWallet(page, metamask);
  await page.waitForTimeout(2000);

  // The first request will need to be signed explicitly
  console.log("Sign initial request...");
  await metamask.sign();
  await page.bringToFront();
  await page.waitForTimeout(2000);

  // Read the contents of the images folder
  const files = fs.readdirSync(imageDir);

  // Start the loop on each image of images folder
  for (const file of files) {
    if (file === ".DS_Store") {
      continue; // Skip macOS hidden file
    }

    // On every iteration (re-)open the asset creation page
    console.log("Creating new asset...");
    const filepath = path.join(imageDir, file);
    await page.bringToFront();
    await page.goto(createAssetURL);
    await page.waitForSelector("#media"); // wait for the upload button to be available

    // Upload the current image file
    await uploadImage(page, filepath);

    // Fill the fields using the asset name with the count
    const name = file.split(".")[0];
    await fillFields(page, name, description, link);

    console.log(`Minting NFT: ${name}...`);
    const createButton = await page.$x('//button[contains(., "Create")]');
    await createButton[0].click();

    // Now wait for the success popup to appear
    console.log("Waiting for success popup...");
    await page.waitForSelector(
      "div.AssetSuccessModalContentreact__DivContainer-sc-1vt1rp8-1"
    );
    await page.waitForTimeout(1000);

    // Delete the local files to remember which ones we already uploaded
    fs.rmSync(filepath);
  }

  console.log("Successfully minted all NFTs");
}

main();
