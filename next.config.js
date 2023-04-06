const { withAxiom } = require('next-axiom')
const nextTranslate = require('next-translate')

module.exports = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1" ? {
  redirects() {
    return [{ source: "/((?!maintenance).*)", destination: "/maintenance.html", permanent: false }].filter(Boolean);
  }
} : nextTranslate(withAxiom({
  // ... your existing config
  reactStrictMode: false
}))



