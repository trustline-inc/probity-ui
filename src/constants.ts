import { BigNumber } from "ethers";
import UsdABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Usd.sol/USD.json";
import AuctioneerABI from "@trustline-inc/probity/artifacts/contracts/probity/Auctioneer.sol/Auctioneer.json";
import BridgeABI from "@trustline-inc/solaris/artifacts/contracts/Bridge.sol/Bridge.json";
import LiquidatorABI from "@trustline-inc/probity/artifacts/contracts/probity/Liquidator.sol/Liquidator.json";
import PriceFeedABI from "@trustline-inc/probity/artifacts/contracts/probity/PriceFeed.sol/PriceFeed.json";
import NativeAssetManagerABI from "@trustline-inc/probity/artifacts/contracts/probity/assets/NativeAssetManager.sol/NativeAssetManager.json";
import Erc20AssetManagerABI from "@trustline-inc/probity/artifacts/contracts/probity/assets/ERC20AssetManager.sol/ERC20AssetManager.json";
import RegistryABI from "@trustline-inc/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import ReservePoolABI from "@trustline-inc/probity/artifacts/contracts/probity/ReservePool.sol/ReservePool.json";
import StateConnectorABI from "@trustline-inc/solaris/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import PbtABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Pbt.sol/PBT.json";
import TellerABI from "@trustline-inc/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import VaultEngineIssuerABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineIssuer.sol/VaultEngineIssuer.json";
import VaultEngineLimitedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineLimited.sol/VaultEngineLimited.json";
import VaultEngineUnrestrictedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineUnrestricted.sol/VaultEngineUnrestricted.json";

/**
 * Contract addresses
 */
export const CONTRACTS: { [key: number]: any } = {
  // Local
  4294967295: {
    USD: {
      address: "0xd841Cf06e6348e4Ea06238DDA2fC28DC589e553b",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0xa2B58240ad7991450199b3BD084E11f4FbC450CB",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    BRIDGE: {
      address: "0xd95331455De63df32B3881420aAAdea506128b62",
      abi: BridgeABI.abi
    },
    LIQUIDATOR: {
      address: "0x80aeB05E0519F3D8336Bcdc18A6e2Ce159C2d320",
      abi: LiquidatorABI.abi
    },
    USD_MANAGER: {
      address: "0xd2E752B617b937036248fc7bb99AF7F0e0CE8d92",
      abi: Erc20AssetManagerABI.abi
    },
    PRICE_FEED: {
      address: "0x5eDaF2fe69775e47EF0125083B8d1Df6e3a4ED82",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x5F3c842590DA75556dE4BE8Af2f8A8Dd8E62D07a",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x6a1faD28bf1d57fd11e6FBC7b9a93588dCE6b10A",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0xB3AE837694d20436D0DA357E0bd616651b626b2d",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0x28aB43E53055eE0114477D1BC0bbe92f55FD5d84",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x05cEe024cdf2375b974E8F9371E16D895d1D8695",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x0f413c136393fB8A8ba89d10521a291bAB48a220",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0xF1816a6502Dd10e780f642334d8c64532e169445",
      abi: VaultEngineIssuerABI.abi
    },
    INTERFACES: {
      "0xd841Cf06e6348e4Ea06238DDA2fC28DC589e553b": UsdABI,
      "0xa2B58240ad7991450199b3BD084E11f4FbC450CB": AuctioneerABI,
      "0x80aeB05E0519F3D8336Bcdc18A6e2Ce159C2d320": LiquidatorABI,
      "0x5eDaF2fe69775e47EF0125083B8d1Df6e3a4ED82": PriceFeedABI,
      "0x5F3c842590DA75556dE4BE8Af2f8A8Dd8E62D07a": NativeAssetManagerABI,
      "0xd2E752B617b937036248fc7bb99AF7F0e0CE8d92": Erc20AssetManagerABI,
      "0x6a1faD28bf1d57fd11e6FBC7b9a93588dCE6b10A": RegistryABI,
      "0xB3AE837694d20436D0DA357E0bd616651b626b2d": PbtABI,
      "0x28aB43E53055eE0114477D1BC0bbe92f55FD5d84": ReservePoolABI,
      "0x05cEe024cdf2375b974E8F9371E16D895d1D8695": TellerABI,
      "0x0f413c136393fB8A8ba89d10521a291bAB48a220": TreasuryABI,
      "0xF1816a6502Dd10e780f642334d8c64532e169445": VaultEngineIssuerABI
    }
  },
  // Coston
  16: {
    USD: {
      address: "0x3cd70e240095368a10973dfc70b324439aD9038A",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0x3DeDD9ce4C2398d92a477Ef65D41165B6cb02fcD",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    BRIDGE: {
      address: "0xd95331455De63df32B3881420aAAdea506128b62",
      abi: BridgeABI.abi
    },
    LIQUIDATOR: {
      address: "0xCfb4669806EC451e7AB7Cb5173947770f986EE37",
      abi: LiquidatorABI.abi
    },
    USD_MANAGER: {
      address: "0xD719B8f9a11e4b9E51F8bEeE92D5bfbc366b5Fcb",
      abi: Erc20AssetManagerABI.abi
    },
    PRICE_FEED: {
      address: "0xd98dDBAa05F6690E09B45F24c66102CE73fE5DF0",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x6c90857e495099CbA67059f59A61ccaC943b6AA3",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x90c7C75F559aF137069A73db55296886e8120244",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0x6779d8B78879161419A009F9e1448201FfA72eAc",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0x588eFA59567b7eb25edF7A043dC907bDCCE025De",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x176375a099793fFF44e50ed15DAc623A1301aD48",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x690F9d18dD9708eF83968684703861745Ea1095B",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0xAB592f6945B63AF46B26617D12a164311bD4ED9C",
      abi: VaultEngineIssuerABI.abi
    },
    INTERFACES: {
      "0x3cd70e240095368a10973dfc70b324439aD9038A": UsdABI,
      "0x3DeDD9ce4C2398d92a477Ef65D41165B6cb02fcD": AuctioneerABI,
      "0xCfb4669806EC451e7AB7Cb5173947770f986EE37": LiquidatorABI,
      "0xd98dDBAa05F6690E09B45F24c66102CE73fE5DF0": PriceFeedABI,
      "0x6c90857e495099CbA67059f59A61ccaC943b6AA3": NativeAssetManagerABI,
      "0xD719B8f9a11e4b9E51F8bEeE92D5bfbc366b5Fcb": Erc20AssetManagerABI,
      "0x90c7C75F559aF137069A73db55296886e8120244": RegistryABI,
      "0x6779d8B78879161419A009F9e1448201FfA72eAc": PbtABI,
      "0x588eFA59567b7eb25edF7A043dC907bDCCE025De": ReservePoolABI,
      "0x176375a099793fFF44e50ed15DAc623A1301aD48": TellerABI,
      "0x690F9d18dD9708eF83968684703861745Ea1095B": TreasuryABI,
      "0xAB592f6945B63AF46B26617D12a164311bD4ED9C": VaultEngineIssuerABI
    }
  },
  // Songbird
  19: {},
  // Flare
  14: {}
}

// WalletConnect
export const PROJECT_ID = process.env.REACT_APP_WC_PROJECT_ID
export const DEFAULT_APP_METADATA = {
  name: "Probity",
  description: "Probity is a fully-collateralized lending protocol",
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
