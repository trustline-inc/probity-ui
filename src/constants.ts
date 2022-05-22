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
      address: "0x62E3498587d552F79181a5370aa38c172F0c8edd",
      abi: AureiABI.abi
    },
    AUCTIONEER: {
      address: "0x380B8C9609bcB77b4e8CA9A8DF2328A140c6A2aF",
      abi: AuctioneerABI.abi
    },
    BRIDGE: {
      address: "",
      abi: null
    },
    LIQUIDATOR: {
      address: "0x9EBB7c9E1AA2d88D7EF22723c95e2aE13209aBce",
      abi: LiquidatorABI.abi
    },
    PRICE_FEED: {
      address: "0x2c729F85FF6535B53A4E56889f35c429Be0A2090",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0xC54fBa58562d834B85baC0DbA26D9aB0269364f3",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x980c130a4737b4a154e7D0D757843B3043807E5E",
      abi: RegistryABI.abi
    },
    PBT_TOKEN: {
      address: "0x0fA0D7366694f631041f3E70fb2f24B6d6297265",
      abi: PbtTokenABI.abi
    },
    RESERVE_POOL: {
      address: "0x20D49a598863F5e09E136733CC3dCdFF8F39bAbA",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x8dF6A3BAcA7f0B304c667cA70FAdE3C6Be52c8b6",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x4e79CB1DA61a66dF8c1D5c315edC2784Cc0630D1",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0xDc5d09b794035e87E7B7FED2707DE694B16B3991",
      abi: VaultEngineLimitedABI.abi
    },
    INTERFACES: {
      "0x62E3498587d552F79181a5370aa38c172F0c8edd": AureiABI,
      "0x380B8C9609bcB77b4e8CA9A8DF2328A140c6A2aF": AuctioneerABI,
      "0x9EBB7c9E1AA2d88D7EF22723c95e2aE13209aBce": LiquidatorABI,
      "0x2c729F85FF6535B53A4E56889f35c429Be0A2090": PriceFeedABI,
      "0xC54fBa58562d834B85baC0DbA26D9aB0269364f3": NativeAssetManagerABI,
      "0x980c130a4737b4a154e7D0D757843B3043807E5E": RegistryABI,
      "0x0fA0D7366694f631041f3E70fb2f24B6d6297265": PbtTokenABI,
      "0x20D49a598863F5e09E136733CC3dCdFF8F39bAbA": ReservePoolABI,
      "0x8dF6A3BAcA7f0B304c667cA70FAdE3C6Be52c8b6": TellerABI,
      "0x4e79CB1DA61a66dF8c1D5c315edC2784Cc0630D1": TreasuryABI,
      "0xDc5d09b794035e87E7B7FED2707DE694B16B3991": VaultEngineLimitedABI
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
