module.exports = {
  setControllersSchema: require("./setControllers").setControllersSchema,
  setTickerSchema: require("./setTicker").setTickerSchema,
  setNameSchema: require("./setName").setNameSchema,
  removeRecordSchema: require("./removeRecord").removeRecordSchema,
  setRecordSchema: require("./setRecord").setRecordSchema,
  removeControllersSchema: require("./removeControllers")
    .removeControllersSchema,
  balanceSchema: require("./balance").balanceSchema,
  transferTokensSchema: require("./transferTokens").transferTokensSchema,
  initialStateSchema: require("./initial-state").initialStateSchema,
};
