const removeRecordSchema = {
  $id: '#/definitions/removeRecord',
  type: 'object',
  properties: {
    function: {
      type: 'string',
      const: 'removeRecord',
    },
    subDomain: {
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]+$',
    },
  },
  required: ['subDomain'],
  additionalProperties: false,
};

module.exports = {
  removeRecordSchema,
};
