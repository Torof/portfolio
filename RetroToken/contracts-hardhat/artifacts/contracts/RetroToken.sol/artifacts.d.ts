// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { RetroToken$Type } from "./RetroToken";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["RetroToken"]: RetroToken$Type;
    ["contracts/RetroToken.sol:RetroToken"]: RetroToken$Type;
  }

  interface ContractTypesMap {
    ["RetroToken"]: GetContractReturnType<RetroToken$Type["abi"]>;
    ["contracts/RetroToken.sol:RetroToken"]: GetContractReturnType<RetroToken$Type["abi"]>;
  }
}
