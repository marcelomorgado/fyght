/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const Fyghters = artifacts.require("Fyghters");

module.exports = async (callback) => {
  const fyghters = await Fyghters.deployed();

  const accounts = (await web3.eth.getAccounts()).slice(1, 5);

  const names = ["Bruce", "Chuck", "Jean", "Jackie"];

  console.log("Creating enemies...");

  for (let i = 0; i < accounts.length; ++i) {
    const name = names[i];
    const from = accounts[i];
    const { tx: receipt } = await fyghters.create(name, { from });
    console.log(`Name: ${name}, Owner: ${from}, Tx hash: ${receipt}`);
  }

  callback();
};
