/**
 * Tailwind CSS configuration file.
 * 
 * @file tailwind.config.js
 * @description This file configures Tailwind CSS, specifying the paths to
 * content files, theme customization, and plugins to use.
 * 
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  /**
   * Array of file paths or glob patterns to scan for Tailwind class names.
   * 
   * @type {Array<string>}
   */
  content: [
    './views/**/*.ejs', // Path to EJS template files for Tailwind class names
    './public/**/*.js', // Path to JavaScript files for Tailwind class names
  ],
  
  /**
   * Theme configuration for Tailwind CSS.
   * 
   * @type {Object}
   * @property {Object} extend - Extend the default Tailwind theme with custom values.
   */
  theme: {
    extend: {}, // Add custom theme extensions here
  },
  
  /**
   * Array of plugins to extend Tailwind CSS functionality.
   * 
   * @type {Array<Function>}
   */
  plugins: [
    require('tailwindcss'), // Base Tailwind CSS plugin
    require('autoprefixer'), // Automatically adds vendor prefixes to CSS rules
  ],
}
