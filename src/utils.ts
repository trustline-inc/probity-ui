import { useEffect, useState } from "react";

/* Scroll */

export const scrollToTop = () =>
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

const throttle = (callback: any, sleepTime: any) => {
  let time = Date.now();

  return (...args: any) => {
    if (time + sleepTime - Date.now() < 0) {
      callback(...args);
      time = Date.now();
    }
  };
};

export const useScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(window.scrollY);

  const updateScrollPosition = throttle(() => {
    setScrollPosition(window.scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener("scroll", updateScrollPosition);
    return () => window.removeEventListener("scroll", updateScrollPosition);
  }, [updateScrollPosition]);

  return scrollPosition;
};

/* Assets */

export const getAssetId = (hash: string) => {
  const id = {
    "0x277471588dc8a8a12d9c788cbcd8dc8e5bfbd906b1c63d46bdba8d080442bf82": "FLR",
    "0x34f0798059a90d875925407ee1d283ae0650aaa8085071fb70c8c42029adc150": "SGB",
    "0x3394a96ae3d76664d9a21dad8ede426bf36b6faee767e047d6aaf44653934fa9": "CFLR",
    "0xaeb724422620edb430dcaf22aeeff2e9388a578c02754cd08699652fb76035c7": "XRP",
    "0xaaaebeba3810b1e6b70781f14b2d72c1cb89c0b2b320c43bb67ff79f562f5ff4": "ETH",
    "0xc4ae21aac0c6549d71dd96035b7e0bdb6c79ebdba8891b666115bc976d16a29e": "USD",
  }[hash]
  return id || "UNRECOGNIZED_ID"
}

export const getNativeTokenSymbol = (chainId: number) => {
  switch (chainId) {
    // Goerli
    case 5:
      return "ETH"
    // Flare
    case 14:
      return "FLR"
    // Coston
    case 16:
      return process.env.REACT_APP_NATIVE_TOKEN || "CFLR"
    // Songbird
    case 19:
      return "SGB"
    // XRP Ledger EVM Sidechain
    case 31337:
      return "XRP"
    default:
      return process.env.REACT_APP_NATIVE_TOKEN || "XRP"
  }
}
