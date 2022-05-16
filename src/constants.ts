import { BigNumber } from "ethers";
import AureiABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import AuctioneerABI from "@trustline-inc/probity/artifacts/contracts/probity/Auctioneer.sol/Auctioneer.json";
import BridgeABI from "@trustline-inc/bridge/artifacts/contracts/Bridge.sol/Bridge.json";
import LiquidatorABI from "@trustline-inc/probity/artifacts/contracts/probity/Liquidator.sol/Liquidator.json";
import PriceFeedABI from "@trustline-inc/probity/artifacts/contracts/probity/PriceFeed.sol/PriceFeed.json";
import NativeAssetManagerABI from "@trustline-inc/probity/artifacts/contracts/probity/assets/NativeAssetManager.sol/NativeAssetManager.json";
import RegistryABI from "@trustline-inc/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import ReservePoolABI from "@trustline-inc/probity/artifacts/contracts/probity/ReservePool.sol/ReservePool.json";
import StateConnectorABI from "@trustline-inc/bridge/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import PbtTokenABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/PbtToken.sol/PbtToken.json";
import TellerABI from "@trustline-inc/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import VaultEngineLimitedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineLimited.sol/VaultEngineLimited.json";
import VaultEngineUnrestrictedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineUnrestricted.sol/VaultEngineUnrestricted.json";

/**
 * Contract addresses
 */
export const CONTRACTS: { [key: number]: any } = {
  // Local
  1337: {
    AUREI: {
      address: "0x0eb4CF8C5a0329e957051b358e005023d3bBA4a4",
      abi: AureiABI.abi
    },
    AUCTIONEER: {
      address: "0xEBDC1a90ffc62242f007F852b11A628A6eb3c624",
      abi: AuctioneerABI.abi
    },
    BRIDGE: {
      address: "",
      abi: null
    },
    LIQUIDATOR: {
      address: "0xc288dB1B350cEABBea57AE61b196817e7c4ea280",
      abi: LiquidatorABI.abi
    },
    PRICE_FEED: {
      address: "0x0320240768ee381157B6Dac64eC6B4867963356f",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x766737C9D5b59473e2ea7d46b440624b9c8aAaE8",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x3E9fD2b335458Ac4f75Be93A6A1Dd85919f72233",
      abi: RegistryABI.abi
    },
    PBT_TOKEN: {
      address: "0xEcA5d93e0f4550E49d101654aD0F60ce3dcF7579",
      abi: PbtTokenABI.abi
    },
    RESERVE_POOL: {
      address: "0x625D2424e4BC2e5717a742678FFd5Fdbc92E2e93",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x04b414dDAf079E51689a1367e59Ce6A1A9d94D37",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0xdc52022f48163c8920f20D48C964CE21F8255F22",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0xC5D94BC7fAcaF84FF25aF180cFc98703E7Bd9E04",
      abi: VaultEngineLimitedABI.abi
    },
    INTERFACES: {
      "0x0eb4CF8C5a0329e957051b358e005023d3bBA4a4": AureiABI,
      "0xEBDC1a90ffc62242f007F852b11A628A6eb3c624": AuctioneerABI,
      "0xc288dB1B350cEABBea57AE61b196817e7c4ea280": LiquidatorABI,
      "0x0320240768ee381157B6Dac64eC6B4867963356f": PriceFeedABI,
      "0x766737C9D5b59473e2ea7d46b440624b9c8aAaE8": NativeAssetManagerABI,
      "0x3E9fD2b335458Ac4f75Be93A6A1Dd85919f72233": RegistryABI,
      "0xEcA5d93e0f4550E49d101654aD0F60ce3dcF7579": PbtTokenABI,
      "0x625D2424e4BC2e5717a742678FFd5Fdbc92E2e93": ReservePoolABI,
      "0x04b414dDAf079E51689a1367e59Ce6A1A9d94D37": TellerABI,
      "0xdc52022f48163c8920f20D48C964CE21F8255F22": TreasuryABI,
      "0xC5D94BC7fAcaF84FF25aF180cFc98703E7Bd9E04": VaultEngineLimitedABI
    }
  },
  // Songbird
  16: {
    AUREI: {
      address: "0x5322E9cE9DFc60372222F899D2B3683D45D9C167",
      abi: AureiABI.abi
    },
    AUCTIONEER: {
      address: "0x80584b42bC51219fB5556e27fa6c16ADbaEA1E53",
      abi: AuctioneerABI.abi
    },
    BRIDGE: {
      address: "",
      abi: null
    },
    LIQUIDATOR: {
      address: "0xfE850285031a976de274b969d098fBb9E94fc7bb",
      abi: LiquidatorABI.abi
    },
    PRICE_FEED: {
      address: "0x51D82d9d17fAdaC40cDef03cf9CB07b1Fb65563C",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x836BD8CBf5baFc971012397879490Ef7Ede64a38",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0xCA33D13E5D03b262C06E98244cb47328d5f890f3",
      abi: RegistryABI.abi
    },
    PBT_TOKEN: {
      address: "0x9E9600168c3b6FA0d3A779956969c41aaD21e1a1",
      abi: PbtTokenABI.abi
    },
    RESERVE_POOL: {
      address: "0x13F332fd05F85909E1f1a74949c30fC74D9Ce3B1",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x25bb8E3bf6228e9cd4F8A29337438357BdDbDfeF",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x08E6eC157F126d30D3E2Ba0f9c3F95Fb53bd0613",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0x02b1A3b0efB8D04A3d91e3CD548885bC4c4bC1c7",
      abi: VaultEngineLimitedABI.abi
    },
    INTERFACES: {
      "0x5322E9cE9DFc60372222F899D2B3683D45D9C167": AureiABI,
      "0x80584b42bC51219fB5556e27fa6c16ADbaEA1E53": AuctioneerABI,
      "0xfE850285031a976de274b969d098fBb9E94fc7bb": LiquidatorABI,
      "0x51D82d9d17fAdaC40cDef03cf9CB07b1Fb65563C": PriceFeedABI,
      "0x836BD8CBf5baFc971012397879490Ef7Ede64a38": NativeAssetManagerABI,
      "0xCA33D13E5D03b262C06E98244cb47328d5f890f3": RegistryABI,
      "0x9E9600168c3b6FA0d3A779956969c41aaD21e1a1": PbtTokenABI,
      "0x13F332fd05F85909E1f1a74949c30fC74D9Ce3B1": ReservePoolABI,
      "0x25bb8E3bf6228e9cd4F8A29337438357BdDbDfeF": TellerABI,
      "0x08E6eC157F126d30D3E2Ba0f9c3F95Fb53bd0613": TreasuryABI,
      "0x02b1A3b0efB8D04A3d91e3CD548885bC4c4bC1c7": VaultEngineABI
    }
  },
  // Coston
  19: {

  }
}

// WalletConnect
export const DEFAULT_APP_METADATA = {
  name: "Probity",
  description: "A decentralized credit system",
  url: "https://probity.finance/",
  icons: ["https://probity.finance/probity-logo.png"],
};
export const DEFAULT_LOGGER = "debug"
export const DEFAULT_RELAY_PROVIDER = "wss://relay.walletconnect.com";
export const DEFAULT_METHODS = ["createTrustLine"];

// Other constants
export const RAD = BigNumber.from("1000000000000000000000000000000000000000000000");
export const RAY = BigNumber.from("1000000000000000000000000000");
export const WAD = BigNumber.from("1000000000000000000");
export const VERSION = process.env.REACT_APP_VERSION
