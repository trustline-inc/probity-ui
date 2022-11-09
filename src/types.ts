export enum Activity {
  // Auctions
  Auction,

  // Equity Management
  IssueEquity,
  RedeemEquity,
  Collect,

  // Loan Management
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

  // Monitor
  Monitor,

  // Exchange
  Trade,
  Provide
}