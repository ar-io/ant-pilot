const setControllersSchema = {
  $id: "#/definitions/setControllers",
  type: "object",
  properties: {
    function: {
      type: "string",
      const: "setControllers",
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
  setControllersSchema,
};
