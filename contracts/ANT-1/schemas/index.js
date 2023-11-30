module.exports = {
  setControllerSchema: require('./setController').setControllerSchema,
  setTickerSchema: require('./setTicker').setTickerSchema,
  setNameSchema: require('./setName').setNameSchema,
  removeRecordSchema: require('./removeRecord').removeRecordSchema,
  setRecordSchema: require('./setRecord').setRecordSchema,
  removeControllerSchema: require('./removeController').removeControllerSchema,
  balanceSchema: require('./balance').balanceSchema,
  transferTokensSchema: require('./transferTokens').transferTokensSchema,
  initialStateSchema: require('./initial-state').initialStateSchema,
};
