
const verifyFiles = (listFiles) => {
  let files = new Promise((resolve, reject) => {
    try {
      const result = listFiles;
      resolve(result)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
  return files;
}

export { verifyFiles }
