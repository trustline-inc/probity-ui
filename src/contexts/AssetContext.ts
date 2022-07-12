import React from "react"

export default React.createContext({
  asset: "USD",
  updateAsset: (asset: string): void => {}
});