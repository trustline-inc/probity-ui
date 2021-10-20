export const getNativeTokenSymbol = (chainId: number) => {
  switch(chainId) {
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
  switch(chainId) {
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