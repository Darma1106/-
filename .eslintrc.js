module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // 解析 .ts 文件
    sourceType: 'module'
  },
  extends: [
    // "eslint:recommended",
    'plugin:vue/base',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    // 'no-unused-vars': 'off',
    // Enforce import order
    'import/order': 'error',
    // Imports should come first
    'import/first': 'error',
    // Other import rules
    'import/no-mutable-exports': 'error',
    // Allow unresolved imports
    'import/no-unresolved': 'off',
    'no-console': [
      'off',
      {
        allow: ['warn', 'error']
      }
    ],
    'no-debugger': 0,
    'vue/require-default-prop': 0,
    'vue/no-v-html': 0,
    'vue/prop-name-casing': 0,
    'vue/no-multiple-template-root': 0,
    'vue/no-v-model-argument': 0,
    'vue/script-setup-uses-vars': 1,
    // 'vue/script-setup-uses-vars': 0,
    // 禁止ts-ignore
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prettier/prettier': [
      1,
      {
        printWidth: 120,
        singleQuote: true,
        semi: false,
        arrowParens: 'always',
        jsxBracketSameLine: true,
        trailingComma: 'none',
        endOfLine: 'auto'
      }
    ]
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    },
    {
      files: ['**/demo/*.{vue,js}'],
      rules: {
        'no-console': 'off'
      }
    },
    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': ['error']
      }
    }
  ]
}
