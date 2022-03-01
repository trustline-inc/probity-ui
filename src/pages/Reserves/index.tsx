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
    yAxis: [
      {
        title: {
          text: "Supply"
        },
        labels: {
          format: "${value}"
        },
        opposite: true
      },
      {
        title: {
          text: "Reserve Ratio"
        },
        labels: {
          format: "{value}%"
        }
      }
    ],
    series: [
      {
        name: "Circulating Supply",
        color: "#FFD700",
        data: [5000000, 6000000, 7500000, 8000000, 13000000, 30000000],
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 3600 * 1000, // one hour
        yAxis: 0
      },
      {
        name: "Total Supply",
        color: "#DAA520",
        data: [50000000, 60000000, 75000000, 80000000, 90000000, 100000000],
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 3600 * 1000, // one hour
        yAxis: 0
      },
      {
        name: "Reserve Ratio",
        color: "#8e9294",
        data: [100, 100, 100, 100, 100, 101],
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 3600 * 1000, // one hour
        yAxis: 1
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
                10,000,000&nbsp;{getStablecoinSymbol(chainId!)}
              </h3>
              <span className="text-success"><span className="fa fa-caret-up"/>10%</span><br/>
              <span className="statcard-desc">Circulating Supply</span>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="border rounded p-3">
              <h3 className="statcard-number">
                100,000,000&nbsp;{getStablecoinSymbol(chainId!)}
              </h3>
              <span className="text-success"><span className="fa fa-caret-up"/>10%</span><br/>
              <span className="statcard-desc">Total Supply</span>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="border rounded p-3">
              <h3 className="statcard-number">
                101%&nbsp;
              </h3>
              <span className="text-success"><span className="fa fa-caret-up"/>1%</span><br/>
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