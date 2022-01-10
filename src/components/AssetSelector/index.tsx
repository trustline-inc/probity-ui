import { Modal } from "react-bootstrap"
import FLR from "../../assets/flare.jpg"
// import XRP from "../../assets/xrp.png"

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
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Choose Asset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="asset border rounded p-4 my-3 d-flex justify-content-between" onClick={onSelect}>
          <h4 className="d-flex align-items-center mb-0">{nativeTokenSymbol}</h4>
          <img src={FLR} className="rounded-circle border" alt={nativeTokenSymbol} height="50" />
        </div>
      </Modal.Body>
    </Modal>
  )
}