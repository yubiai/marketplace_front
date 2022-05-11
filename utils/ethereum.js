
// Login Metamask
const loginMetamask = async() => {

  if (!window.ethereum) {
    console.log("no hay metamask")
    return null;
  }

  try {
    let signerAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return signerAddress[0];
  } catch (error) {
    if (error.code === 4001) {
      // User rejected request
      console.log(error.code);
    }
    console.log(error, "error")
    return null;
  }
}

export { loginMetamask };
