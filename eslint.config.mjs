/**
 * @file ESLint configuration file.
 * @description This file sets up ESLint for JavaScript files, specifying
 * language options and recommended rules.
 * 
 * @module eslint.config.mjs
 */

import globals from "globals";
import pluginJs from "@eslint/js";

/**
 * ESLint configuration array.
 * 
 * @type {Array<Object>}
 * @property {Array<string>} files - An array of glob patterns for files to lint.
 * @property {Object} languageOptions - Options related to language syntax.
 * @property {Object} globals - Global variables for different environments.
 * @property {Object} pluginJs.configs.recommended - ESLint recommended rules.
 * 
 */
export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: { ...globals.node, ...globals.browser, ...globals.jest } } },
  pluginJs.configs.recommended,
];
