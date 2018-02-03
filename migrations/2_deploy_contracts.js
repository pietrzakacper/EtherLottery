const LotteryHelper = artifacts.require("./LotteryHelper.sol");

module.exports = deployer => {
  deployer.deploy(LotteryHelper);
};
