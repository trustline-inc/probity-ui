/**
 * This script is used to populate auctions for testing the UI
 */
 import { existsSync } from "fs";
import { Contract, providers, utils } from "ethers"
import { AUCTIONEER, INTERFACES } from "../src/constants"

const RPC_URL = "http://127.0.0.1:9650/ext/bc/C/rpc";

// Add Flare local accounts from Flare config
const flareLocalAccounts: any[] = [];
const flareConfPath = `${process.env.FLARE_DIR}/src/stateco/client/config.json`;
if (existsSync(flareConfPath)) {
  // tslint:disable-next-line no-var-requires
  const flareConf = require(flareConfPath);
  flareLocalAccounts.push(flareConf.accounts[0].privateKey);
  flareLocalAccounts.push(flareConf.accounts[1].privateKey);
}

const provider = new providers.JsonRpcProvider(RPC_URL);

;(async () => {
  const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, provider)
})()