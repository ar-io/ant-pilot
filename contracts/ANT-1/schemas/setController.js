
const setControllerSchema = {
    $id: '#/definitions/setController',
    type: 'object',
    properties: {
      function: {
        type: 'string',
        const: 'setController',
      },
      target: {
        type: 'string',
        pattern: "^[a-zA-Z0-9_-]{43}$",
      },
    },
    required: ['target'],
    additionalProperties: false,
  };

  module.exports = {
    setControllerSchema
  }