import React from "react";
import "./index.css";

function ExternalSites() {
  return (
    <div className="social-links container-fluid text-center mt-5 mb-3">
      <a target="blank" href="https://docs.trustline.co/probity/" className="mx-2">
        <i className="fa fa-book"></i>
      </a>
      <a target="blank" href="https://trustline.zendesk.com/hc/" className="mx-2">
        <i className="fas fa-question-circle" />
      </a>
    </div>
  );
}
export default ExternalSites;
