/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const Fyghters = artifacts.require("Fyghters");
const Dai = artifacts.require("Dai");

const APPROVAL_AMOUNT = `${100e18}`;

// FIXME: This script stucks when some tx is rejected
module.exports = async (callback) => {
  const fyghters = await Fyghters.deployed();
  const dai = await Dai.deployed();

  const accounts = await web3.eth.getAccounts();
  const enemiesAccounts = accounts.slice(1, 5);

  const names = ["Bruce", "Chuck", "Jean", "Jackie"];

  console.log("Creating enemies...");

  for (let i = 0; i < enemiesAccounts.length; ++i) {
    const name = names[i];
    const from = enemiesAccounts[i];
    console.log(`Creating enemy... [name = ${name}, owner = ${from}]`);

    const { tx: tx1 } = await dai.mint(APPROVAL_AMOUNT, { from });
    console.log(`Tokens minted: ${tx1}`);

    const { tx: tx2 } = await dai.approve(fyghters.address, APPROVAL_AMOUNT, { from });
    console.log(`Fyghters contract allowed to spend tokens: ${tx2}`);

    const { tx: tx3 } = await fyghters.create(name, { from });
    console.log(`Fyghter created: ${tx3}`);
  }

  callback();
};
