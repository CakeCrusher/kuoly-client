const withLess = require("next-with-less");

module.exports = withLess({
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
});
