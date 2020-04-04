const { BN, constants, expectEvent, expectRevert, time } = require("@openzeppelin/test-helpers");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const { expect } = chai;
global.expect = expect;

module.exports = {
  BN,
  constants,
  expectEvent,
  expectRevert,
  time,
};
