import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RetroTokenModule = buildModule("RetroTokenModule", (m) => {
  // Deploy the RetroToken contract
  const retroToken = m.contract("RetroToken", []);

  return { retroToken };
});

export default RetroTokenModule;