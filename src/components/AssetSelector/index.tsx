import React from "react"
import { Modal } from "react-bootstrap"
import FLR from "../../assets/flare.jpg"
import TUSD from "../../assets/TUSD.png"
import XRP from "../../assets/xrp.png"
import AssetContext from "../../contexts/AssetContext"

export default function AssetSelector({
  nativeTokenSymbol,
  show,
  handleClose,
  onSelect
}: {
  nativeTokenSymbol: string,
  show: boolean,
  handleClose: () => void,
  onSelect: () => void
}) {
  const ctx = React.useContext(AssetContext)
  const currentAsset = ctx.asset || nativeTokenSymbol
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Choose Asset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="asset border rounded p-4 my-3 d-flex justify-content-between" onClick={() => { ctx.updateAsset(nativeTokenSymbol); handleClose()} }>
          <h4 className="d-flex align-items-center mb-0">{nativeTokenSymbol}</h4>
          <img src={FLR} className="rounded-circle border" alt={nativeTokenSymbol} height="50" />
        </div>
        <div className="asset border rounded p-4 my-3 d-flex justify-content-between disabled">
          <h4 className="d-flex align-items-center mb-0">FXRP</h4>
          <img src={XRP} className="rounded-circle border" alt="FXRP" height="50" />
        </div>
        <div className="asset border rounded p-4 my-3 d-flex justify-content-between" onClick={() => { ctx.updateAsset("TUSD"); handleClose()} }>
          <h4 className="d-flex align-items-center mb-0">TUSD</h4>
          <img src={TUSD} className="rounded-circle border" alt="TUSD" height="50" />
        </div>
      </Modal.Body>
    </Modal>
  )
}