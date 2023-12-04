module.exports = async function (globalConfig, projectConfig) {
  await global.arlocal.stop();
  global.arlocal = undefined;
  global.arweave = undefined;
  global.wallets = undefined;
  global.contractIds = undefined;
  global.warp = undefined;
};
