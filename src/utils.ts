import AureiABI from "@trustline/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import PhiABI from "@trustline/probity/artifacts/contracts/probity/tokens/Phi.sol/Phi.json";
import { AUREI, PHI } from "./constants";

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
      return AureiABI
    case 16:
      return PhiABI
    case 19:
      return PhiABI
    default:
      return AureiABI
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