export const web3Requested = () => ({
    type: 'WEB3_REQUESTED'
})

export const web3Injected = (web3) => ({
    type: 'WEB3_INJECTED',
    web3
})