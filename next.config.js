const nextTranslate = require('next-translate');
const withTM = require('next-transpile-modules')(['@lens-protocol/widgets-react']);

module.exports = nextTranslate(
  withTM({
    // ... your existing config
    reactStrictMode: false,
  }),
);