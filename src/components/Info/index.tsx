import React from 'react';
import { useLocation } from "react-router-dom";

function Info() {
  const location = useLocation();
  return (
    <>
      <header className="pt-2">
        <h1>Guide</h1>
        <p className="lead">Information on how to use Probity.</p>
      </header>
      <div className="border rounded p-4">
        {
          (location.pathname === "/" || location.pathname === "/!") && (
            <>
              <h3>Welcome</h3>
              <p>Please choose an activity from the navigation bar to get started.</p>
              <p>Note that this application is running on the Coston testnet and is a <strong>pre-release</strong> version. Do <strong>not</strong> try to interact with this application by using real funds.</p>
            </>
          )
        }
        {
          location.pathname.includes("/vault") && (
            <>
              <h3>Managing a vault</h3>
              <p>A <strong>Probity vault</strong> is a blockchain program that allows users to either capitalize the treasury or to take out a loan.</p>
            </>
          )
        }
        {
          location.pathname.includes("/capital") && (
            <>
              <h3>Capitalization</h3>
              <p><strong>Capitalization</strong> is the process of enabling Probity to make Aurei loans using your vault's collateral. You can earn yield on issued Aurei by locking collateral in your vault. Locked collateral is added to a pool of loanable funds. Your collateral is withdrawable at any and all times.</p>
            </>
          )
        }
        {
          location.pathname.includes("/loans") && (
            <>
              <h3>Borrowing</h3>
              <p>Take out a stablecoin loan by locking collateral in your vault. You will not be able to redeem your entire collateral while there is a loan balance. Loans are repaid in Aurei or TCN, which can be bought on exchanges.</p>
            </>
          )
        }
      </div>
    </>
  )
}

export default Info;