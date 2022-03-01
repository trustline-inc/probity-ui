import { Contract, utils } from "ethers";

const fetcher = (library: any, abi?: any) => (...args: any) => {
  const [arg1, arg2, ...params] = args

  // A Contract
  if (utils.isAddress(arg1)) {
    const address = arg1
    const method = arg2
    const contract = new Contract(address, abi, library.getSigner())
    return contract.callStatic[method](...params)
  }

  // An EVM call using provider
  const method = arg1
  return (library as any)[method](arg2, ...params)
}

export default fetcher;