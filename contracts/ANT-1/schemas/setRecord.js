const setRecordSchema = {
  $id: '#/definitions/setRecord',
  type: 'object',
  properties: {
    function: {
      type: 'string',
      const: 'setRecord',
    },
    subDomain: {
      type: 'string',
      pattern: '^(?:[a-zA-Z0-9_-]+|@)$',
    },
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
  required: ['subDomain', 'transactionId', 'ttlSeconds'],
  additionalProperties: false,
};

module.exports = {
  setRecordSchema,
};
