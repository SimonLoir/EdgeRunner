/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ['@repo/eslint-config/expo.js'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
    },
    ignorePatterns: [
        'babel.config.js',
        'metro.config.js',
        'jest.config.js',
        'tailwind.config.js',
    ],
};
