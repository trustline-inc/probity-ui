import React from "react"

export default React.createContext({
  transactions: [],
  updateTransactions: (transaction: any): void => {}
});