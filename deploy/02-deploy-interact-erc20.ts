import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network, ethers } from "hardhat";
import { networkConfig } from "../helper-hardhat-config";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const deployErc20Mock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const erc20Contract = await ethers.getContract("ERC20Mock");

  log("----------------------------------------------------");
  let args: any[] = [erc20Contract.address];
  const interactErc20 = await deploy("InteractERC20", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(interactErc20.address, args);
  }
};

export default deployErc20Mock;
deployErc20Mock.tags = ["all", "mock", "interact-erc20"];
