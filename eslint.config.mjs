// @ts-check

import eslintConfigPrettier from 'eslint-config-prettier/flat';
import withNuxt from './.nuxt/eslint.config.mjs';

// const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

export default withNuxt(
  // {
  //   rules: {
  //     '@stylistic/semi': 'off',
  //   },
  // },
  eslintConfigPrettier,
);
// Your custom configs here
