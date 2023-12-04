const balanceSchema = {
  $id: '#/definitions/balance',
  type: 'object',
  properties: {
    function: {
      type: 'string',
      const: 'balance',
    },
    target: {
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]{43}$',
    },
  },
  required: ['target'],
  additionalProperties: false,
};

module.exports = {
  balanceSchema,
};
