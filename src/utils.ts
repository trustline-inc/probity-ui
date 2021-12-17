import { AUREI, PHI, INTERFACES } from "./constants";

export const getCollateralId = (hash: string) => {
  const id = {
    "0x34f0798059a90d875925407ee1d283ae0650aaa8085071fb70c8c42029adc150": "SGB"
  }[hash]
  return id || "UNRECOGNIZED_COLL_ID"
}

export const getNativeTokenSymbol = (chainId: number) => {
  switch (chainId) {
    case 14:
      return "FLR"
    case 16:
      return process.env.REACT_APP_NATIVE_TOKEN_SYMBOL_LOCAL || "FLR"
    case 19:
      return "SGB"
    default:
      return "FLR"
  }
}

export const getStablecoinSymbol = (chainId: number) => {
  switch (chainId) {
    case 14:
      return "AUR"
    case 16:
      return process.env.REACT_APP_STABLECOIN_SYMBOL_LOCAL || "AUR"
    case 19:
      return "PHI"
    default:
      return "AUR"
  }
}

export const getStablecoinName = (chainId: number) => {
  switch (chainId) {
    case 14:
      return "Aurei"
    case 16:
      return process.env.REACT_APP_STABLECOIN_NAME_LOCAL || "Aurei"
    case 19:
      return "Phi"
    default:
      return "Aurei"
  }
}

export const getStablecoinABI = (chainId: number) => {
  switch (chainId) {
    case 14:
      return INTERFACES[AUREI]
    case 16:
      if (process.env.REACT_APP_STABLECOIN_SYMBOL_LOCAL === "AUR")
        return INTERFACES[AUREI]
      if (process.env.REACT_APP_STABLECOIN_SYMBOL_LOCAL === "PHI")
        return INTERFACES[PHI]
      else
        return INTERFACES[AUREI]
    case 19:
      return INTERFACES[PHI]
    default:
      return INTERFACES[AUREI]
  }
}

export const getStablecoinAddress = (chainId: number) => {
  switch (chainId) {
    case 14:
      return AUREI
    case 16:
      if (process.env.REACT_APP_STABLECOIN_SYMBOL_LOCAL === "AUR")
        return AUREI
      if (process.env.REACT_APP_STABLECOIN_SYMBOL_LOCAL === "PHI")
        return PHI
      else
        return AUREI
    case 19:
      return PHI
    default:
      return AUREI
  }
}