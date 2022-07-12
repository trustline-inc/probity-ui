export enum Activity {
  Auction,

  // Equity Management
  IssueEquity,
  RedeemEquity,
  Collect,

  // Debt Management
  Borrow,
  Repay,

  // Currencies
  IssueCurrency,
  RedeemCurrency,

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