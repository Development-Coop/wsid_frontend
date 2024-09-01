module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended"],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    // Add specific rules here to turn off warnings
    "vue/multi-word-component-names": "off",
    // Add more rules as needed
  },
};
