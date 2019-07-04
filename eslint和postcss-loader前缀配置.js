// 01 webpack.dev: eslint-loader 语法检测    paskage.json加配置
"eslintConfig": {
    "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module"
    },
    "extends": "eslint:recommended",
    "rules": {
      "no-console": 0
    },
    "env": {
      "browser": true
    }
  }
  
// 02 webpack.pro: postcss-loader 加前缀	paskage.json加配置
  "browserslist": [
    "last 2 version",
    "> 1%",
    "not ie <= 8"
  ]
  // https://github.com/browserslist/browserslist