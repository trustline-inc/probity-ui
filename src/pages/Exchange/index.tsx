import React from 'react';
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import TradeActivity from './TradeActivity';
import ProvideActivity from './ProvideActivity';
import Info from '../../components/Info';

function Exchange() {
    const { active } = useWeb3React<Web3Provider>()
    const [activity, setActivity] = React.useState<ActivityType|null>(null);
    const [error, ] = React.useState<any|null>(null);

    return (
        <>
            <Helmet>
                <title>Probity | Exchange</title>
            </Helmet>
            <header>
                <h1>Asset Exchange</h1>
                {active && <Info />}
            </header>
            <section className="border rounded p-5 mb-5 shadow-sm bg-white">
                <div className="col-md-12 col-lg-8 offset-lg-2">
                    {/* Activity Navigation */}
                    <div>
                        <ul className="nav nav-pills nav-justified">
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to={"/exchange/trade"} onClick={() => { setActivity(ActivityType.Trade); }}>Trade</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to={"/exchange/provide"} onClick={() => { setActivity(ActivityType.Provide); }}>Provide</NavLink>
                            </li>
                        </ul>
                    </div>
                    <hr />
                    {/* Loan Activities */}
                    <Activity active={active} activity={activity} error={error}>
                        {
                            activity === ActivityType.Trade && (
                                <TradeActivity />
                            )
                        }
                        {
                            activity === ActivityType.Provide && (
                                <ProvideActivity />
                            )
                        }
                    </Activity>
                </div>
            </section>
        </>
    )
}

export default Exchange