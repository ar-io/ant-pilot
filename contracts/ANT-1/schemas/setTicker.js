const setTickerSchema = {
  $id: '#/definitions/setTicker',
  type: 'object',
  properties: {
    function: {
      type: 'string',
      const: 'setTicker',
    },
    ticker: {
      type: 'string',
    },
  },
  required: ['ticker'],
  additionalProperties: false,
};

module.exports = {
  setTickerSchema,
};
