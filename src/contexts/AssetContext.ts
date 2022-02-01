import React from "react"

export default React.createContext({
  asset: process.env.REACT_APP_NATIVE_TOKEN_SYMBOL_LOCAL,
  updateAsset: (asset: string): void => {}
});