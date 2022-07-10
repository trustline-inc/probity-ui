import { BigNumber } from "ethers";
import UsdABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Usd.sol/USD.json";
import AuctioneerABI from "@trustline-inc/probity/artifacts/contracts/probity/Auctioneer.sol/Auctioneer.json";
import BridgeABI from "@trustline-inc/bridge/artifacts/contracts/Bridge.sol/Bridge.json";
import LiquidatorABI from "@trustline-inc/probity/artifacts/contracts/probity/Liquidator.sol/Liquidator.json";
import PriceFeedABI from "@trustline-inc/probity/artifacts/contracts/probity/PriceFeed.sol/PriceFeed.json";
import NativeAssetManagerABI from "@trustline-inc/probity/artifacts/contracts/probity/assets/NativeAssetManager.sol/NativeAssetManager.json";
import Erc20AssetManagerABI from "@trustline-inc/probity/artifacts/contracts/probity/assets/ERC20AssetManager.sol/ERC20AssetManager.json";
import RegistryABI from "@trustline-inc/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import ReservePoolABI from "@trustline-inc/probity/artifacts/contracts/probity/ReservePool.sol/ReservePool.json";
import StateConnectorABI from "@trustline-inc/bridge/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import PbtABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Pbt.sol/PBT.json";
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
    USD: {
      address: "0x1bc05Ab43Bed8b99176c0B411AA069a8Fe5983f8",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0x31182675ad9c294303ee18c5df5F4353365ADAc2",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    BRIDGE: {
      address: "",
      abi: BridgeABI.abi
    },
    LIQUIDATOR: {
      address: "0xf079c9a2E38B8112A5B952F700F7E7D2360E7b07",
      abi: LiquidatorABI.abi
    },
    ERC20_ASSET_MANAGER: {
      address: "0xad95D30FDFCFa8188F529FAEc228B46F999F5Bf0",
      abi: Erc20AssetManagerABI.abi
    },
    PRICE_FEED: {
      address: "0x07E640CcbbfD6318ba904e0236a313b76263A3AB",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x1c1cc0e77c97478aE834ec79B891bBC73177623f",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x99C73760EDa9166a7048e7A5e595ed6823a473Cf",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0x248e33aA637bA780644590decD4414F8E6C06874",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0x8dcD277d4609ddb7775a85FEEc0a4898B2f92432",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x2839AcefBCd7aC2DbBe9D5dadF96003B1fec3eC3",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x01D8b22b44f978Ba1d992B2EC48167fe2a9cb2F4",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0x14b014B3E110511eFb36f9659F3625168d11469A",
      abi: VaultEngineLimitedABI.abi
    },
    INTERFACES: {
      "0x1bc05Ab43Bed8b99176c0B411AA069a8Fe5983f8": UsdABI,
      "0x31182675ad9c294303ee18c5df5F4353365ADAc2": AuctioneerABI,
      "0xf079c9a2E38B8112A5B952F700F7E7D2360E7b07": LiquidatorABI,
      "0x07E640CcbbfD6318ba904e0236a313b76263A3AB": PriceFeedABI,
      "0x1c1cc0e77c97478aE834ec79B891bBC73177623f": NativeAssetManagerABI,
      "0x99C73760EDa9166a7048e7A5e595ed6823a473Cf": RegistryABI,
      "0x248e33aA637bA780644590decD4414F8E6C06874": PbtABI,
      "0x8dcD277d4609ddb7775a85FEEc0a4898B2f92432": ReservePoolABI,
      "0x2839AcefBCd7aC2DbBe9D5dadF96003B1fec3eC3": TellerABI,
      "0x01D8b22b44f978Ba1d992B2EC48167fe2a9cb2F4": TreasuryABI,
      "0x14b014B3E110511eFb36f9659F3625168d11469A": VaultEngineLimitedABI
    }
  },
  // Songbird
  16: {
    USD: {
      address: "0x5322E9cE9DFc60372222F899D2B3683D45D9C167",
      abi: UsdABI.abi
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
    PBT: {
      address: "0x9E9600168c3b6FA0d3A779956969c41aaD21e1a1",
      abi: PbtABI.abi
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
      "0x5322E9cE9DFc60372222F899D2B3683D45D9C167": UsdABI,
      "0x80584b42bC51219fB5556e27fa6c16ADbaEA1E53": AuctioneerABI,
      "0xfE850285031a976de274b969d098fBb9E94fc7bb": LiquidatorABI,
      "0x51D82d9d17fAdaC40cDef03cf9CB07b1Fb65563C": PriceFeedABI,
      "0x836BD8CBf5baFc971012397879490Ef7Ede64a38": NativeAssetManagerABI,
      "": Erc20AssetManagerABI,
      "0xCA33D13E5D03b262C06E98244cb47328d5f890f3": RegistryABI,
      "0x9E9600168c3b6FA0d3A779956969c41aaD21e1a1": PbtABI,
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
export const PROJECT_ID = process.env.REACT_APP_WC_PROJECT_ID
export const DEFAULT_APP_METADATA = {
  name: "Probity Vault",
  description: "An asset-backed stablecoin protocol",
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
