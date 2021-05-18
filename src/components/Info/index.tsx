import React from "react";
import { useLocation } from "react-router-dom";

function Info() {
  const location = useLocation();
  return (
    <>
      <header>
        <div className="my-3">
          {(location.pathname === "/" || location.pathname === "/!") && (
            <>
              <p>
                Please choose an activity from the navigation bar to get
                started.
              </p>
              <p>
                Note that this application is running on the Coston testnet and
                is a <strong>pre-release</strong> version. Do{" "}
                <strong>not</strong> try to interact with this application by
                using real funds.
              </p>
            </>
          )}
          {location.pathname.includes("/capital") && (
            <>
              <p>
                Capitalization is the process of enabling Probity to mint Aurei backed
                by staked assets. You can earn yield on the Aurei created from staked
                collateral. Collateral is redeemable at any time.
              </p>
            </>
          )}
          {location.pathname.includes("/loans") && (
            <>
              <p>
                Take out a stablecoin loan by locking collateral in your vault.
                You will not be able to redeem your entire collateral while
                there is a loan balance. Loans are repaid in Aurei.
              </p>
            </>
          )}
          {location.pathname.includes("/transactions") && (
            <>
              <p>
                View the transaction activity from your session.
              </p>
            </>
          )}
        </div>
      </header>
    </>
  );
}

export default Info;
