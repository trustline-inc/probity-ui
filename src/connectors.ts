import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'

export const network = new NetworkConnector({
  urls: {
    31337: 'http://localhost:8545',
  },
  defaultChainId: 1,
});

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