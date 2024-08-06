module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended', // 使用推荐的eslint
    'plugin:vue/vue3-recommended' // 使用插件支持vue3
    // 如果你没有安装第7步,以下两个包不要引入,否则报错
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  globals: {
    ethereum: 'readonly',
    zE: 'readonly'
  },
  // eslint-plugin-vue
  plugins: [
    'vue', // 引入vue的插件 vue <==> eslint-plugin-vue
    '@typescript-eslint'
    // 这个包需要安装了第7步的三个包再引入
  ],
  // 这里时配置规则的,自己看情况配置
  rules: {
    semi: ['error', 'never'], // 禁止尾部使用分号
    'no-multi-spaces': 'error', // 禁止使用多个空格
    'no-multiple-empty-lines': ['error', { max: 1 }], // 禁止出现多行空行
    'no-trailing-spaces': 'error', // 禁止一行结束后面不要有空格
    'no-empty': 'off',
    eqeqeq: 'off', // 要求使用 === 和 !==
    'arrow-spacing': 'error', // 要求箭头函数的箭头前后使用一致的空格
    indent: ['error', 2], // 要求使用JS一致缩进4个空格
    'max-statements-per-line': ['error', { max: 4 }], // 要求每一行中所允许的最大语句数量
    quotes: ['error', 'single', 'avoid-escape'], // 要求统一使用单引号符号
    // 要求每一行标签的最大属性不超三个
    'vue/max-attributes-per-line': ['error', { singleline: 3 }],
    // 要求html标签的缩进为需要4个空格
    'vue/html-indent': ['error', 2],
    // 取消关闭标签不能自闭合的限制设置
    'vue/html-self-closing': ['error'],
    'vue/multi-word-component-names': ['off'],
    // 无保留组件名称
    'vue/no-reserved-component-names': ['off'],
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand']
  }
}
