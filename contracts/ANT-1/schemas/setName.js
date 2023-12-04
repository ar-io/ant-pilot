const setNameSchema = {
  $id: '#/definitions/setName',
  type: 'object',
  properties: {
    function: {
      type: 'string',
      const: 'setName',
    },
    name: {
      type: 'string',
    },
  },
  required: ['name'],
  additionalProperties: false,
};

module.exports = {
  setNameSchema,
};
