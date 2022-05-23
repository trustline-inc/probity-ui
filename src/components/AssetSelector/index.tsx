import React from "react"
import { Modal } from "react-bootstrap"
import FLR from "../../assets/flare.jpg"
import SGB from "../../assets/sgb.png"
import USD from "../../assets/USD.png"
import XRP from "../../assets/xrp.png"
import AssetContext from "../../contexts/AssetContext"

const IMAGES: { [key: string]: any } = {
  "FLR": FLR,
  "SGB": SGB,
  "CFLR": FLR,
}

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
        <div className="asset border rounded p-4 my-3 d-flex justify-content-between" onClick={() => { ctx.updateAsset("USD"); handleClose()} }>
          <h4 className="d-flex align-items-center mb-0">USD</h4>
          <img src={USD} className="rounded-circle border" alt="USD" height="50" />
        </div>
        <div className="asset border rounded p-4 my-3 d-flex justify-content-between" onClick={() => { ctx.updateAsset(nativeTokenSymbol); handleClose()} }>
          <h4 className="d-flex align-items-center mb-0">{nativeTokenSymbol}</h4>
          <img src={IMAGES[nativeTokenSymbol]} className="rounded-circle border" alt={nativeTokenSymbol} height="50" />
        </div>
      </Modal.Body>
    </Modal>
  )
}