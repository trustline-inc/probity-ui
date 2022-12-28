import { InjectedConnector } from '@web3-react/injected-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { RPC_URLS, POLLING_INTERVAL } from './constants'

export const injected = new InjectedConnector({
  supportedChainIds: [
    31337,      // Hardhat
    16,         // Coston
    19,         // Songbird
    1440001,    // XRP Ledger
    4294967295, // Localhost (Flare)
  ],
})

export const ledger = {
  connect: (chainId: number) => new LedgerConnector({
    chainId,
    url: RPC_URLS[chainId],
    pollingInterval: POLLING_INTERVAL
  })
};

export const walletconnect = new WalletConnectConnector({})