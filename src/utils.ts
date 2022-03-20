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
    "0x3394a96ae3d76664d9a21dad8ede426bf36b6faee767e047d6aaf44653934fa9": "CFLR"
  }[hash]
  return id || "UNRECOGNIZED_ID"
}

export const getNativeTokenSymbol = (chainId: number) => {
  switch (chainId) {
    case 14:
      return "FLR"
    case 16:
      return process.env.REACT_APP_NATIVE_TOKEN_SYMBOL || "CFLR"
    case 19:
      return "SGB"
    default:
      return process.env.REACT_APP_NATIVE_TOKEN_SYMBOL || "CFLR"
  }
}
