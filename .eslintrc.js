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
  ignorePatterns: ["dist/**"],
  rules: {
    // Add specific rules here to turn off warnings
    "vue/multi-word-component-names": "off",
    "no-console": "off", // Disable no-console rule globally
    "vue/max-attributes-per-line": "off",
    "linebreak-style": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/html-self-closing": "off",
  },
};
