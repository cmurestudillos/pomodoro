module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'max-nesting-depth': 10,
    'string-quotes': 'single',
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'declaration-block-no-redundant-longhand-properties': null,
    'shorthand-property-no-redundant-values': null,
    'number-max-precision': null,
    'value-keyword-case': ['lower', { camelCaseSvgKeywords: true }],
  },
};
