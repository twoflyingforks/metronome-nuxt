// @ts-check

import eslintConfigPrettier from 'eslint-config-prettier/flat';
import withNuxt from './.nuxt/eslint.config.mjs';

// const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

export default withNuxt(eslintConfigPrettier);
// Your custom configs here

// {
//   rules: {
//     '@stylistic/semi': 'off',
//   },
// },
