const items = require('../../cache/data').items

export default function search(req, res) {
  const results = req.query.q
    ? items.filter((item) =>
        item.title.toLowerCase().includes(req.query.q.toLowerCase())
      )
    : []
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ results }))
}
