const Lottery = artifacts.require("./Lottery.sol");

module.exports = deployer => {
  deployer.deploy(Lottery);
};
