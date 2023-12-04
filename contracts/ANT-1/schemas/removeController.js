const removeControllerSchema = {
  $id: '#/definitions/removeController',
  type: 'object',
  properties: {
    function: {
      type: 'string',
      const: 'removeController',
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
  removeControllerSchema,
};
