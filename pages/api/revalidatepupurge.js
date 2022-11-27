import axios from "axios";

export default async function handler(req, res) {

  // Verify Path
  if (!req.query.path) {
    return res.status(401).json({ message: 'The path is missing' })
  }

  // Verify Token
  let auth = false;

  const authorization = req.headers.authorization;

  if (authorization) {
    const response = await axios.get('/auth/session/', {
      headers: {
        Authorization: authorization
      }
    })

    auth = response.status === 200 ? true : false;
  }

  // Check for secret to confirm this is a valid request
  if (req.query.secret == process.env.NEXT_PUBLIC_SECRET_PURGE) {
    auth = true
  }

  if (auth) {
    try {
      await res.revalidate(`/item/${req.query.path}`)
      return res.json({ revalidated: true })
    } catch (err) {
      console.error(err)
      return res.status(500).send('Error revalidating')
    }
  }

  return res.status(500).send('Error revalidating')
}