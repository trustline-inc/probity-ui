import { InjectedConnector } from '@web3-react/injected-connector'

export const injected = new InjectedConnector({
  supportedChainIds: [
    1,    // Ethereum Mainet
    3,    // Ethereum Ropsten
    4,    // Ethereum Rinkeby
    5,    // Ethereum Goerli
    14,   // Flare Mainnet
    16,   // Flare Coston
    42,   // Ethereum Kovan
    1337, // Localhost (Hardhat)
  ],
})