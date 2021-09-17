import React from "react";
import "./index.css";

function SocialLinks() {
  return (
    <div className="social-links mt-auto container-fluid text-center">
      <a target="blank" href="https://twitter.com/ProbityDAO" className="mx-2">
        <i className="fab fa-twitter"></i>
      </a>
      <a target="blank" href="https://discord.gg/pfz6h2TwMk" className="mx-2">
        <i className="fab fa-discord"></i>
      </a>
      <a target="blank" href="https://t.me/joinchat/ldcoqlTUyLIyNDIx" className="mx-2">
        <i className="fab fa-telegram"></i>
      </a>
      <a target="blank" href="https://trustline-inc.medium.com/probity-is-available-on-the-testnet-bf87d287173d" className="mx-2">
        <i className="fab fa-medium"></i>
      </a>
      <a target="blank" href="https://github.com/probitydao" className="mx-2">
        <i className="fab fa-github"></i>
      </a>
      <a target="blank" href="https://docs.trustline.co/trustline/" className="mx-2">
        <i className="fa fa-book"></i>
      </a>
    </div>
  );
}
export default SocialLinks;
