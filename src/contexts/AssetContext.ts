import React from "react"

export default React.createContext({
  asset: process.env.REACT_APP_NATIVE_TOKEN || "CFLR",
  updateAsset: (asset: string): void => {}
});