const removeControllersSchema = {
  $id: "#/definitions/removeControllers",
  type: "object",
  properties: {
    function: {
      type: "string",
      const: "removeControllers",
    },
    targets: {
      type: "array",
      items: {
        type: "string",
        pattern: "^[a-zA-Z0-9_-]{43}$",
      },
    },
  },
  required: ["targets"],
  additionalProperties: false,
};

module.exports = {
  removeControllersSchema,
};
