import Eth from 'ethjs'

export const getEth = () => new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', () => {
      resolve({eth: new Eth(window.web3.currentProvider)})
  })
})


export const promisify = cb => (...args) => new Promise(
  (resolve, reject) => {
    cb(...args, (err, response) => {
      if(err){
        reject(err)
        return
      }

      resolve(response)
    })
  })


export const getEventFromLogs = (logs, _event) => (logs.find(({event}) => event === _event)).args
