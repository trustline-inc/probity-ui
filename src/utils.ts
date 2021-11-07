import { AUREI, PHI, INTERFACES } from "./constants";

export const getNativeTokenSymbol = (chainId: number) => {
  switch (chainId) {
    case 14:
      return "FLR"
    case 16:
      return "SGB"
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
      return "PHI"
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
      return "Phi"
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
      return INTERFACES[PHI]
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
      return PHI
    case 19:
      return PHI
    default:
      return AUREI
  }
}