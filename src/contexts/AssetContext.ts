import React from "react"

export default React.createContext({
  asset: process.env.REACT_APP_NATIVE_TOKEN_SYMBOL || "CFLR",
  updateAsset: (asset: string): void => {}
});