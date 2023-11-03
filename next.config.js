const nextTranslate = require('next-translate')

module.exports = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1" ? {
  async redirects() {
    return [{ source: "/((?!maintenance).*)", destination: "/maintenance.html", permanent: false }]
  }
} : nextTranslate({
  // ... your existing config
  reactStrictMode: false,
  transpilePackages: ['@lens-protocol']
});



