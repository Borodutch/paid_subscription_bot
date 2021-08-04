import Web3 from 'web3'

export const web3 = new Web3(Web3.givenProvider || process.env.WEB3_PROVIDER)
