import React from "react"
import { Card, Nav } from "react-bootstrap"
import Highcharts, { PlotSplineOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getStablecoinSymbol } from "../../utils";
import { useWeb3React } from "@web3-react/core";

const positions = [

]

function ChartContainer() {
  const { chainId } = useWeb3React()
  const [window, setWindow] = React.useState<string|null>("7D")
  const options = {
    chart: {
      type: "spline"
    },
    title: {
      text: undefined
    },
    tooltip: {
      shared: true
    },
    xAxis: {
      title: {
        text: "Date"
      },
      type: "datetime",
      labels: {
        formatter: function(): string {
          // @ts-ignore
          return Highcharts.dateFormat("%H:%M %d %b %Y", this.value);
        }
      }
    },
    yAxis: {
      title: {
        text: "Value"
      }
    },
    series: [
      {
        name: "Circulating Supply",
        color: "#FFD700",
        data: [1, 2, 1, 4, 3, 6],
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 3600 * 1000 // one hour
      },
      {
        name: "Total Supply",
        color: "#DAA520",
        data: [5, 3, 5, 5, 6, 7],
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 3600 * 1000 // one hour
      },
      {
        name: "Reserve Ratio",
        color: "#8e9294",
        data: [6, 6, 6, 7, 6, 7],
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 3600 * 1000 // one hour
      }
    ],
    credits: {
      enabled: false
    }
  };

  React.useEffect(() => {
    console.log("Fetching new data for " + window)
  }, [window])

  return (
    <Card>
      <Card.Body>
        <div className="row py-2 text-center">
          <div className="col-sm-4">
            <div className="border rounded p-3">
              <h3 className="statcard-number">
                10,00,00&nbsp;{getStablecoinSymbol(chainId!)}
              </h3>
              <span className="text-danger"><span className="fa fa-caret-down"/>10%</span><br/>
              <span className="statcard-desc">Circulating Supply</span>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="border rounded p-3">
              <h3 className="statcard-number">
                100,00,000&nbsp;{getStablecoinSymbol(chainId!)}
              </h3>
              <span className="text-danger"><span className="fa fa-caret-down"/>10%</span><br/>
              <span className="statcard-desc">Total Supply</span>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="border rounded p-3">
              <h3 className="statcard-number">
                100%&nbsp;
              </h3>
              <span className="text-success"><span className="fa fa-caret-up"/>10%</span><br/>
              <span className="statcard-desc">Reserve Ratio</span>
            </div>
          </div>
        </div>
        <div className="row py-2">
          <div className="col-md-12">
            <Nav
              variant="pills"
              defaultActiveKey="7D"
              className="justify-content-center mt-2"
              onSelect={(selectedKey) => setWindow(selectedKey)}
            >
              <Nav.Item>
                <Nav.Link eventKey="7D">7D</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="1M">1M</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="3M">3M</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="6M">6M</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="1Y">1Y</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>
        <div className="row py-2">
          <div className="col-md-12">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

function PositionTable() {
  return <></>
}

export default function Reserves() {
  return (
    <>
      <h1>Reserves</h1>
      <ChartContainer />
      <PositionTable />
    </>
  )
}