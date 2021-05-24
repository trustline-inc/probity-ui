import React, { useContext } from "react";
// import { useWeb3React } from '@web3-react/core'
// import { Web3Provider } from '@ethersproject/providers';
// import Info from '../../components/Info';
// import { Contract, utils } from "ethers";
// import { AUREI_ADDRESS, BRIDGE_ADDRESS } from '../../constants';
// import AureiABI from "@trustline-inc/aurei/artifacts/contracts/Aurei.sol/Aurei.json";
// import BridgeABI from "@trustline-inc/aurei/artifacts/contracts/Bridge.sol/Bridge.json";
// import EventContext from "../../contexts/TransactionContext"
// import { Activity as ActivityType } from "../../types";
// import Activity from "../../containers/Activity";

// export default function Exchange() {
//   const { account, active, library } = useWeb3React<Web3Provider>()
//   const [coin, setCoin] = React.useState("FLR");
//   const [aureiAmount, setAureiAmount] = React.useState(0);
//   const [send, setSend] = React.useState("FLR");
//   const [receive, setReceive] = React.useState("AUR");
//   const [error, setError] = React.useState<any|null>(null);
//   const ctx = useContext(EventContext)

//   const onAureiAmountChange = (event: any) => {
//     const amount = event.target.value;
//     setAureiAmount(amount);
//   }

//   const onCoinChange = (event: any) => {
//     const coin = event.target.value;
//     setCoin(coin);
//   }

//   const switchSendAndReceive = async () => {
//     const tmpReceive = send;
//     const tmpSend = receive;
//     setSend(tmpSend);
//     setReceive(tmpReceive);
//   }

//   const onClick = async () => {}

//   return (
//     <>
//       <header className="pt-2">
//         <h1>Aurei Exchange</h1>
//         <p className="lead">Swap Aurei and F-Assets.</p>
//         {active && <Info />}
//       </header>
//       <section className="border rounded p-5 mb-5 shadow-sm bg-white">
//         <Activity active={active} activity={ActivityType.Exchange} error={error}>
//           <div className="row">
//             <div className="col-md-6 offset-md-3">
//               <label className="form-label">Send</label>
//               <div className="input-group">
//                 <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" value={aureiAmount ? aureiAmount : ""} onChange={onAureiAmountChange} />
//                 <span className="input-group-text font-monospace">{send}</span>
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-md-6 offset-md-3 text-center mt-4">
//               <button className="btn btn-ghost" onClick={switchSendAndReceive}><span className="fa fa-sync"></span></button>
//             </div>
//           </div>
//           <div className="row mt-3">
//             <div className="col-md-6 offset-md-3">
//               <label className="form-label">Receive</label>
//               <div className="input-group">
//                 <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" value={coin} onChange={onCoinChange} />
//                 <span className="input-group-text font-monospace">{receive}</span>
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-md-6 offset-md-3 mt-4 d-grid">
//               <button
//                 className="btn btn-primary btn-lg mt-4"
//                 onClick={onClick}
//                 disabled={aureiAmount === 0}
//               >Confirm</button>
//             </div>
//           </div>
//         </Activity>
//       </section>
//     </>
//   )
// }