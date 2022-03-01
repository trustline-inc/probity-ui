export enum Activity {
  Auction,

  // Equity
  Supply,
  Redeem,
  Interest,

  // Loans
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