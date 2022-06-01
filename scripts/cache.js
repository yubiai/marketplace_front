const fs = require('fs')
const axios = require('axios')

try {
  fs.readdirSync('cache')
} catch (e) {
  fs.mkdirSync('cache')
}

async function getItems() {
  await axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/items/`)
    .then((res) => {
      const items = res.data.result;
      const fileContents = `export const items = ${JSON.stringify(items)}`;

      fs.writeFile('cache/data.js', fileContents, function (err) {
        // writing to the cache/data.js file
        if (err) return console.log(err)
        console.log('Items cached.')
      })

      return
    })
    .catch((err) => {
      console.log(err)
      return
    })
}

getItems()
