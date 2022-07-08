import React from 'react'
import classnames from "classnames"
import { Card, Col, Modal, Row } from 'react-bootstrap'
import { injected, ledger } from "../../connectors";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import ledgerIcon from "../../assets/ledger.png"
import metamaskIcon from "../../assets/metamask.png"
import "./index.css"

type Props = {
  show: boolean,
  handleClose: () => void
}

function Connector({ title, body, icon, disabled, onClick }: any) {
  const [hover, setHover] = React.useState(false)

  const onMouseOver = () => {
    setHover(true)
  }

  const onMouseOut = () => {
    setHover(false)
  }

  const _onClick = () => {
    if (!disabled) onClick()
  }

  return (
    <Card
      className={classnames([(hover && !disabled) ? "hover border-primary" : "", disabled && "disabled"])}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={_onClick}
    >
      <Card.Img variant="top" src={icon} className="p-5 card-image" />
      <Card.Body className="text-center">
        <Card.Title>{title}</Card.Title>
        <Card.Body><small className="text-muted">{body}</small></Card.Body>
      </Card.Body>
    </Card>
  )
}

function ConnectWalletModal({ show, handleClose }: Props) {
  const { activate } = useWeb3React<Web3Provider>();

  const onClick = (connector: any) => {
    activate(connector);
    handleClose()
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Choose a Connector</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row xs={1} md={2} className="g-4">
          <Col>
            <Connector title={"Metamask"} body={"Browser extension/app"} onClick={() => onClick(injected)} icon={metamaskIcon} />
          </Col>
          <Col>
            <Connector title={"Ledger"} body={"Coming soon"} onClick={() => onClick(ledger.connect(19))} icon={ledgerIcon} disabled />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default ConnectWalletModal