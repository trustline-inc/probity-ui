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
import VaultEngineRestrictedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineRestricted.sol/VaultEngineRestricted.json";

/**
 * Contract addresses
 */
export const CONTRACTS: { [key: number]: any } = {
  // Hardhat localhost network
  31337: {
    USD: {
      address: "0x4728B22F9F220060d36333139aE2D36415DB0351",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0xD8aba37226FFc9666E7ef5fAeF51A30dCBCde3ef",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    BRIDGE: {
      address: "",
      abi: BridgeABI.abi
    },
    LIQUIDATOR: {
      address: "0xF513b895ed6846F190C7a67cF50dE0a47377f7Ba",
      abi: LiquidatorABI.abi
    },
    USD_MANAGER: {
      address: "0x5DA88e9148c9E5E584facE8a7773C7Ba185a812d",
      abi: Erc20AssetManagerABI.abi
    },
    PRICE_FEED: {
      address: "0x9decD2bD0B210869219670B817Cb046025c4CA02",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0xF48dB09403FF2762E7811E9Af25D6182deDDF1d8",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x30BA16bacA622afA5f7B056D97292a29329D5329",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0xD16f3E5175a25A60Ee31Ea2B88Fb5883Fc8EA7c8",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0x9b5b5Ff81832aB3d97f53605D0cF0522393E6b2D",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0xf4dC7dB778C459220181Eb33d1A381E3cee0C65e",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x9AfA6021cc3b8b72530A54ad00C31D719b32d802",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0x11e011Ee7611a51107223B337337BF9f0eAB5ef0",
      abi: VaultEngineIssuerABI.abi
    },
    INTERFACES: {
      "0x4728B22F9F220060d36333139aE2D36415DB0351": UsdABI,
      "0xD8aba37226FFc9666E7ef5fAeF51A30dCBCde3ef": AuctioneerABI,
      "0xF513b895ed6846F190C7a67cF50dE0a47377f7Ba": LiquidatorABI,
      "0x9decD2bD0B210869219670B817Cb046025c4CA02": PriceFeedABI,
      "0xF48dB09403FF2762E7811E9Af25D6182deDDF1d8": NativeAssetManagerABI,
      "0x5DA88e9148c9E5E584facE8a7773C7Ba185a812d": Erc20AssetManagerABI,
      "0x30BA16bacA622afA5f7B056D97292a29329D5329": RegistryABI,
      "0xD16f3E5175a25A60Ee31Ea2B88Fb5883Fc8EA7c8": PbtABI,
      "0x9b5b5Ff81832aB3d97f53605D0cF0522393E6b2D": ReservePoolABI,
      "0xf4dC7dB778C459220181Eb33d1A381E3cee0C65e": TellerABI,
      "0x9AfA6021cc3b8b72530A54ad00C31D719b32d802": TreasuryABI,
      "0x11e011Ee7611a51107223B337337BF9f0eAB5ef0": VaultEngineIssuerABI
    }
  },
  // Flare localhost network
  4294967295: {
    USD: {
      address: "0xbfa5ff89e20D4b9f75d1C5126e80CfFC2ceC2831",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0x8060Ec526B71bb5AB10eF28Af1824797F7f615A8",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    BRIDGE: {
      address: "",
      abi: BridgeABI.abi
    },
    LIQUIDATOR: {
      address: "0x2AD8e37297Fd5781BCe1144392E79a6D3706E516",
      abi: LiquidatorABI.abi
    },
    USD_MANAGER: {
      address: "0x7133c78E6A4070Bca396751F44E675eaFD379a83",
      abi: Erc20AssetManagerABI.abi
    },
    PRICE_FEED: {
      address: "0xB161d50e02C36e6F91B71fB28dDaC442f3368440",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x7b199D048310F4144f7466Ea81006A7804c3A8BD",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x01e0cb9E05c98A1baff3AFeF80237C7074353F03",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0x482e8BEf8235ff6333B671A78e94d6576C4B2CFf",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0x65C992E29f2CA49bA3cfFf76D2e56DF545C3dE38",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x578C3CCd7b0b2a9c4070B5eAc4de3F101812E0bf",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0xa444B86fed3986B0b5B5cFEB202f4d52804b1887",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0x5cbDbC5Cc725103D890B7cC1a22eB6DCe3D9a57C",
      abi: VaultEngineIssuerABI.abi
    },
    INTERFACES: {
      "0xbfa5ff89e20D4b9f75d1C5126e80CfFC2ceC2831": UsdABI,
      "0x8060Ec526B71bb5AB10eF28Af1824797F7f615A8": AuctioneerABI,
      "0x2AD8e37297Fd5781BCe1144392E79a6D3706E516": LiquidatorABI,
      "0xB161d50e02C36e6F91B71fB28dDaC442f3368440": PriceFeedABI,
      "0x7b199D048310F4144f7466Ea81006A7804c3A8BD": NativeAssetManagerABI,
      "0x7133c78E6A4070Bca396751F44E675eaFD379a83": Erc20AssetManagerABI,
      "0x01e0cb9E05c98A1baff3AFeF80237C7074353F03": RegistryABI,
      "0x482e8BEf8235ff6333B671A78e94d6576C4B2CFf": PbtABI,
      "0x65C992E29f2CA49bA3cfFf76D2e56DF545C3dE38": ReservePoolABI,
      "0x578C3CCd7b0b2a9c4070B5eAc4de3F101812E0bf": TellerABI,
      "0xa444B86fed3986B0b5B5cFEB202f4d52804b1887": TreasuryABI,
      "0x5cbDbC5Cc725103D890B7cC1a22eB6DCe3D9a57C": VaultEngineIssuerABI
    }
  },
  // Coston network
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
  // Songbird network
  19: {},
  // Flare network
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

// RPC URLs and polling interval
interface IDictionary<TValue> {
  [id: string]: TValue;
}
export const POLLING_INTERVAL = 5000;
export const RPC_URLS: IDictionary<string> = {
  31337: "http://127.0.0.1:8545/",
  16: process.env.NODE_ENV === "production" ? "https://coston.trustline.co" : "http://127.0.0.1:9650/ext/bc/C/rpc",
  19: "https://songbird.towolabs.com/rpc",
  4294967295: "http://localhost:9650/ext/bc/C/rpc"
};

// Other constants
export const RAD = BigNumber.from("1000000000000000000000000000000000000000000000");
export const RAY = BigNumber.from("1000000000000000000000000000");
export const WAD = BigNumber.from("1000000000000000000");
export const VERSION = process.env.REACT_APP_VERSION
