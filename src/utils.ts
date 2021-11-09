import { AUREI, PHI, INTERFACES } from "./constants";

export const getNativeTokenSymbol = (chainId: number) => {
  switch (chainId) {
    case 14:
      return "FLR"
    case 16:
      return "FLR"
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
      return "AUR"
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
      return "Aurei"
    case 19:
      return "Phi"
    default:
      return "Aurei"
  }
}

export const getStablecoinABI = (chainId: number) => {
  switch (chainId) {
    case 14:
      return INTERFACES[AUREI.toLowerCase()]
    case 16:
      return INTERFACES[AUREI.toLowerCase()]
    case 19:
      return INTERFACES[PHI.toLowerCase()]
    default:
      return INTERFACES[AUREI.toLowerCase()]
  }
}

export const getStablecoinAddress = (chainId: number) => {
  switch (chainId) {
    case 14:
      return AUREI.toLowerCase()
    case 16:
      return AUREI.toLowerCase()
    case 19:
      return PHI.toLowerCase()
    default:
      return AUREI.toLowerCase()
  }
}