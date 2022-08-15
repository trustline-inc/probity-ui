import { InjectedConnector } from '@web3-react/injected-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

interface IDictionary<TValue> {
  [id: string]: TValue;
}
const POLLING_INTERVAL = 12000;
const RPC_URLS: IDictionary<string> = {
  16: process.env.NODE_ENV === "production" ? "https://coston.trustline.co" : "http://127.0.0.1:9650/ext/bc/C/rpc",
  19: "https://songbird.towolabs.com/rpc",
  4294967295: "http://localhost:9650/ext/bc/C/rpc"
};

export const injected = new InjectedConnector({
  supportedChainIds: [
    16,   // Coston
    19,   // Songbird
    4294967295, // Localhost (Hardhat)
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