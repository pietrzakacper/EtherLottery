const LotteryHelper = artifacts.require("./LotteryHelper.sol")
const LotteryTestable = artifacts.require("./LotteryTestable.sol")

module.exports = deployer => {
  deployer.deploy(LotteryHelper)
  deployer.deploy(LotteryTestable)
};
