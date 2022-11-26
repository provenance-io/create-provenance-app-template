module.exports = {
  parser: 'babel',
  printWidth: 85,
  singleQuote: true,
  trailingComma: 'es5',
  semi: false,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'typescript',
      },
    },
  ],
};
