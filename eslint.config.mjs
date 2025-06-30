// @ts-check
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import withNuxt from "./.nuxt/eslint.config.mjs";

// const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

export default withNuxt(
  // Your custom configs here
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
);
