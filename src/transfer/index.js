require('dotenv').config()
const { API_URL_MUMBAI, PRIVATE_KEY_MUMBAI, MY_ADDRESS_MUMBAI } = process.env
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const web3 = createAlchemyWeb3(API_URL_MUMBAI, { maxRetries: 0 })

const sendTransaction = async (address) => {
  try {
    const nonce = await web3.eth.getTransactionCount(
      MY_ADDRESS_MUMBAI,
      'latest',
    ) // nonce starts counting from 0
    const transaction = {
      from: MY_ADDRESS_MUMBAI,
      to: address, // faucet address to return eth
      gasLimit: 285000, 
      gasPrice: await web3.eth.getGasPrice(),
      value: web3.utils.toWei('0.05', 'gwei'),
      nonce: (1 + nonce),
      // optional data field to send message or execute smart contract
    }
    console.log('send transcation: ', JSON.stringify(transaction))

    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      PRIVATE_KEY_MUMBAI,
    )

    return await new Promise(async (resolve, reject) => {
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
            if (!error) {
                 console.log('🎉 The hash of your transaction is: ', 
                 hash
                 )
            } else {
                console.error(error)
                resolve(false)
            }
            resolve(true)
        })
    });
  } catch (error) {
    console.log(
      '❗Something went wrong while submitting your transaction:',
      error,
    )
    return false
  }
}

module.exports = {
  sendTransaction,
}
