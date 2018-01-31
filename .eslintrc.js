module.exports = {
  "extends": "google",
  "parserOptions": {
    "ecmaVersion": 6,
  },
  "env": {
    "node": true,
    "browser": false,
    "es6": true
  },
  "rules": {
    "require-jsdoc": 0,
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "always",
      "asyncArrow": "always"
    }],
  }
};
