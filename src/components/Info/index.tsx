import React from "react";
import { useLocation } from "react-router-dom";

function Info() {
  const location = useLocation();
  return (
    <>
      <header>
        <div>
          {(location.pathname === "/" || location.pathname === "/!") && (
            <>
              <p>
                Note that this application is running on the Coston testnet and
                is a <strong>pre-release</strong> version. Do{" "}
                <strong>not</strong> try to interact with this application by
                using real funds.
              </p>
            </>
          )}
        </div>
      </header>
    </>
  );
}

export default Info;
