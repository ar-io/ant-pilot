const transferTokensSchema = {
  $id: '#/definitions/transferTokens',
  type: 'object',
  properties: {
    function: {
      type: 'string',
      const: 'transfer',
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
  transferTokensSchema,
};
