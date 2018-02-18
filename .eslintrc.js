module.exports = {
  "extends": "google",
  "parserOptions": {
    "ecmaVersion": 8,
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
    "indent": ["error", 2]
  }
};
