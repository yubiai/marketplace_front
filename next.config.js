const nextTranslate = require('next-translate')

module.exports = nextTranslate({
  // ... your existing config
  reactStrictMode: false,
  transpilePackages: ['@lens-protocol']
})


