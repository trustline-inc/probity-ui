import React from "react"
import { CONTRACTS } from "../constants"

export default React.createContext({
  asset: "USD",
  address: CONTRACTS[4294967295].USD?.address,
  updateAsset: (asset: string): void => {}
});