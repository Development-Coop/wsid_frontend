module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "prettier", // This disables ESLint rules that conflict with Prettier
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  ignorePatterns: ["dist/**"],
  rules: {
    // Add specific rules here to turn off warnings
    "vue/multi-word-component-names": "off",
    "no-console": "off", // Disable no-console rule globally
    "linebreak-style": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/html-self-closing": "off",
    // Disable Vue formatting rules that conflict with Prettier
    "vue/html-indent": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/html-closing-bracket-spacing": "off",
    "vue/max-attributes-per-line": "off",
    "vue/first-attribute-linebreak": "off",
  },
};
