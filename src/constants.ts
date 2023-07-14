import { BigNumber } from "ethers";
import UsdABI from "@trustline/probity/artifacts/contracts/probity/tokens/Usd.sol/USD.json";
import AuctioneerABI from "@trustline/probity/artifacts/contracts/probity/Auctioneer.sol/Auctioneer.json";
// import BridgeABI from "@trustline-inc/solaris/artifacts/contracts/Bridge.sol/Bridge.json";
import LiquidatorABI from "@trustline/probity/artifacts/contracts/probity/Liquidator.sol/Liquidator.json";
import PriceFeedABI from "@trustline/probity/artifacts/contracts/probity/PriceFeed.sol/PriceFeed.json";
import NativeAssetManagerABI from "@trustline/probity/artifacts/contracts/probity/assets/NativeAssetManager.sol/NativeAssetManager.json";
import Erc20AssetManagerABI from "@trustline/probity/artifacts/contracts/probity/assets/ERC20AssetManager.sol/ERC20AssetManager.json";
import RegistryABI from "@trustline/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import ReservePoolABI from "@trustline/probity/artifacts/contracts/probity/ReservePool.sol/ReservePool.json";
// import StateConnectorABI from "@trustline-inc/solaris/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import PbtABI from "@trustline/probity/artifacts/contracts/probity/tokens/Pbt.sol/PBT.json";
import TellerABI from "@trustline/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import TreasuryABI from "@trustline/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
// import VaultEngineABI from "@trustline/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import VaultEngineIssuerABI from "@trustline/probity/artifacts/contracts/probity/VaultEngineIssuer.sol/VaultEngineIssuer.json";
// import VaultEngineLimitedABI from "@trustline/probity/artifacts/contracts/probity/VaultEngineLimited.sol/VaultEngineLimited.json";
// import VaultEngineRestrictedABI from "@trustline/probity/artifacts/contracts/probity/VaultEngineRestricted.sol/VaultEngineRestricted.json";

/**
 * Contract addresses
 */
export const CONTRACTS: { [key: number]: any } = {
  // Hardhat localhost network
  31337: {
    USD: {
      address: "0x0613CbEE4A032787C10C6c1291Cb63CE38ab6302",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0xF97ed339602e436e3Bf730699b1069Dc6890fA20",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    // BRIDGE: {
    //   address: "",
    //   abi: BridgeABI.abi
    // },
    LIQUIDATOR: {
      address: "0x1A5D7a3d0c4c6B732F02901658A042BC30F5B508",
      abi: LiquidatorABI.abi
    },
    USD_MANAGER: {
      address: "0x73065D57a43fcc564c8dAEBF5a3e32Df84ED8d33",
      abi: Erc20AssetManagerABI.abi
    },
    PRICE_FEED: {
      address: "0xF513b895ed6846F190C7a67cF50dE0a47377f7Ba",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0xB7c83BfdF41a4B01Be1E1cb0b4b9EcBfA1f6e79A",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x385b9709490a251C8657A8e7484A71735F49Ce30",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0x8dD4842bD10A7adb018Eb6D6f41d41f909951e75",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0xa1a4b102F2A28bD9651ad4d1BC3a6d1C249987b2",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x37F92DAe5888a147f9ecD072c06F17B4AA618d04",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0xBbd69afC0ceF918cAe9096f7f362Eb33d0Fe7195",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0x23f02A4F5119201D31a90ED071eE5680e9780A55",
      abi: VaultEngineIssuerABI.abi
    },
    INTERFACES: {
      "0x0613CbEE4A032787C10C6c1291Cb63CE38ab6302": UsdABI,
      "0xF97ed339602e436e3Bf730699b1069Dc6890fA20": AuctioneerABI,
      "0x1A5D7a3d0c4c6B732F02901658A042BC30F5B508": LiquidatorABI,
      "0xF513b895ed6846F190C7a67cF50dE0a47377f7Ba": PriceFeedABI,
      "0xB7c83BfdF41a4B01Be1E1cb0b4b9EcBfA1f6e79A": NativeAssetManagerABI,
      "0x73065D57a43fcc564c8dAEBF5a3e32Df84ED8d33": Erc20AssetManagerABI,
      "0x385b9709490a251C8657A8e7484A71735F49Ce30": RegistryABI,
      "0x8dD4842bD10A7adb018Eb6D6f41d41f909951e75": PbtABI,
      "0xa1a4b102F2A28bD9651ad4d1BC3a6d1C249987b2": ReservePoolABI,
      "0x37F92DAe5888a147f9ecD072c06F17B4AA618d04": TellerABI,
      "0xBbd69afC0ceF918cAe9096f7f362Eb33d0Fe7195": TreasuryABI,
      "0x23f02A4F5119201D31a90ED071eE5680e9780A55": VaultEngineIssuerABI
    }
  },
  // XRP Ledger Sidechain Devnet
  1440001: {
    USD: {
      address: "0xbfa5ff89e20D4b9f75d1C5126e80CfFC2ceC2831",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0x8060Ec526B71bb5AB10eF28Af1824797F7f615A8",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    // BRIDGE: {
    //   address: "",
    //   abi: BridgeABI.abi
    // },
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
    // BRIDGE: {
    //   address: "",
    //   abi: BridgeABI.abi
    // },
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
    // BRIDGE: {
    //   address: "0xd95331455De63df32B3881420aAAdea506128b62",
    //   abi: BridgeABI.abi
    // },
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
  19: {
    USD: {
      address: "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0xa09dAB87b5dD723458d76ceC090E9224c80Be3a7",
      abi: AuctioneerABI.abi
    },
    // // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    // BRIDGE: {
    //   address: "",
    //   abi: BridgeABI.abi
    // },
    LIQUIDATOR: {
      address: "0xAb935B158336723448C676071B28717c2B135ffd",
      abi: LiquidatorABI.abi
    },
    USD_MANAGER: {
      address: "0xE1F322df0660470d1f8af66412FE631700a5eC95",
      abi: Erc20AssetManagerABI.abi
    },
    PRICE_FEED: {
      address: "0x0EdF1C1BaE930B74f80371128239Ab5f584aADF1",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x1aDF9d1AF441d4489ea2C6b9a7e944B1A59b0e98",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x72b96dF84644e9F5bC91228C52cA24D74aC04558",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0x7f2cF5bC5065BCaDF7713d11de41D9e0523D574e",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0xe2F72317D5F14Cc6d4b23019088768D456697fd6",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x1c86117F477D4C84e5954A85f3F1c787b67f1a31",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x60b1d01AC1036906Eca859e6b55ca1bf9cAB92EF",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0x776C09f1640175f509c743C451Bb513ee13fF67A",
      abi: VaultEngineIssuerABI.abi
    },
    INTERFACES: {
      "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d": UsdABI,
      "	0xa09dAB87b5dD723458d76ceC090E9224c80Be3a7": AuctioneerABI,
      "0xAb935B158336723448C676071B28717c2B135ffd": LiquidatorABI,
      "0x0EdF1C1BaE930B74f80371128239Ab5f584aADF1": PriceFeedABI,
      "0x1aDF9d1AF441d4489ea2C6b9a7e944B1A59b0e98": NativeAssetManagerABI,
      "0xE1F322df0660470d1f8af66412FE631700a5eC95": Erc20AssetManagerABI,
      "0xbF8A3CA285C7ccbACbC0c8666348f432060794Aa": RegistryABI,
      "0x2d552d09c96A4c3d57924A636038CcceC2DF2c5e": PbtABI,
      "0x72b96dF84644e9F5bC91228C52cA24D74aC04558": ReservePoolABI,
      "0x1c86117F477D4C84e5954A85f3F1c787b67f1a31": TellerABI,
      "0x60b1d01AC1036906Eca859e6b55ca1bf9cAB92EF": TreasuryABI,
      "0x776C09f1640175f509c743C451Bb513ee13fF67A": VaultEngineIssuerABI
    }
  },
  // Flare network
  14: {
    USD: {
      address: "0x2De05d67bf2D03045684a48Ba269A09c51F53A6f",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0xa09dAB87b5dD723458d76ceC090E9224c80Be3a7",
      abi: AuctioneerABI.abi
    },
    // // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    // BRIDGE: {
    //   address: "",
    //   abi: BridgeABI.abi
    // },
    LIQUIDATOR: {
      address: "0xAb935B158336723448C676071B28717c2B135ffd",
      abi: LiquidatorABI.abi
    },
    USD_MANAGER: {
      address: "0x8f40D140307D20954a77a390BBfF31269561cC45",
      abi: Erc20AssetManagerABI.abi
    },
    PRICE_FEED: {
      address: "0x6F1D557192f959339AfDF798F5Dba16c73C2A863",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x3de0107eF69a5164B0e79daE9793B7C08f877aDb",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0xbF8A3CA285C7ccbACbC0c8666348f432060794Aa",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0x2d552d09c96A4c3d57924A636038CcceC2DF2c5e",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0x6E4e94D9f9D36F1C4C9695fDA80cc9B5Ba16A3c5",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0xDBB461218eD84D712c2d57519c6672eF5F1529E9",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0xF8b3093D277E5C8315CEFdB774d48d8665c28Bb8",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0x29e42438a60EC8F5aacC51f826a0BB07F32507bb",
      abi: VaultEngineIssuerABI.abi
    },
    INTERFACES: {
      "0x2De05d67bf2D03045684a48Ba269A09c51F53A6f": UsdABI,
      "0xa09dAB87b5dD723458d76ceC090E9224c80Be3a7": AuctioneerABI,
      "0xAb935B158336723448C676071B28717c2B135ffd": LiquidatorABI,
      "0x6F1D557192f959339AfDF798F5Dba16c73C2A863": PriceFeedABI,
      "0x3de0107eF69a5164B0e79daE9793B7C08f877aDb": NativeAssetManagerABI,
      "0x8f40D140307D20954a77a390BBfF31269561cC45": Erc20AssetManagerABI,
      "0xbF8A3CA285C7ccbACbC0c8666348f432060794Aa": RegistryABI,
      "0x2d552d09c96A4c3d57924A636038CcceC2DF2c5e": PbtABI,
      "0x6E4e94D9f9D36F1C4C9695fDA80cc9B5Ba16A3c5": ReservePoolABI,
      "0xDBB461218eD84D712c2d57519c6672eF5F1529E9": TellerABI,
      "0xF8b3093D277E5C8315CEFdB774d48d8665c28Bb8": TreasuryABI,
      "0x29e42438a60EC8F5aacC51f826a0BB07F32507bb": VaultEngineIssuerABI
    }
  }
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

// NumbroJS
export const formatOptions = {
  thousandSeparated: true,
  optionalMantissa: true,
  trimMantissa: false,
  mantissa: 2
}