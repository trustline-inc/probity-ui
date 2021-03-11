const fetcher = (library: any) => (...args: any) => {
  const [method, ...params] = args
  console.log(method, params)
  return library[method](...params)
}

export default fetcher;