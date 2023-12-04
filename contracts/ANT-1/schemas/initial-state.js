const initialStateSchema = {
  $id: '#/definitions/buyRecord',
  type: 'object',
  properties: {
    ticker: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    owner: {
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]{43}$',
    },
    controllers: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^[a-zA-Z0-9_-]{43}$',
      },
    },
    records: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        transactionId: {
          type: 'string',
          pattern: '^[a-zA-Z0-9_-]{43}$',
        },
        ttlSeconds: {
          type: 'integer',
          minimum: 900,
          maximum: 2_592_000,
        },
      },
    },
    balances: {
      type: 'object',
      additionalProperties: {
        type: 'integer',
      },
    },
  },
  required: ['name', 'ticker', 'owner', 'controllers', 'records', 'balances'],
  additionalProperties: false,
};

module.exports = {
  initialStateSchema,
};
