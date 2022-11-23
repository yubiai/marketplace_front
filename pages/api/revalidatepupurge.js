export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  if (!req.query.path) {
    return res.status(401).json({ message: 'The path is missing' })
  }

  try {
    await res.revalidate(`/item/${req.query.path}`)
    return res.json({ revalidated: true })
  } catch (err) {
    console.error(err)
    return res.status(500).send('Error revalidating')
  }
}