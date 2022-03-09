export enum Activity {
  Auction,

  // Equity Management
  Invest,
  Redeem,
  Collect,

  // Debt Management
  Borrow,
  Repay,

  // Vault
  Deposit,
  Withdraw,

  // Transfer
  InboundTransfer,
  OutboundTransfer,

  // Auth
  Login,

  // Liquidations
  Liquidate
}