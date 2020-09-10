module.exports = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "ChessMe - Main API",
        description: "ChessMe Main API",
        contact: {
          name: "Riley"
        },
        servers: ["http://localhost:5000/"]
      }
    },
    apis: ["index.js"]
  };