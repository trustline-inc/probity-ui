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

  // Liquidations
  Liquidate
}