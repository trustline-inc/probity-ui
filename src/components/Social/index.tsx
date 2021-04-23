import React from "react";
import "./index.css";

function SocialLinks() {
  return (
    <div className="social-links mt-auto container-fluid">
      <a href="https://twitter.com/TrustlineInc" className="mx-2">
        <i className="fab fa-twitter"></i>
      </a>
      <a href="https://discord.gg/pqjAASCja8" className="mx-2">
        <i className="fab fa-discord"></i>
      </a>
      <a href="https://t.me/TrustlineInc" className="mx-2">
        <i className="fab fa-telegram"></i>
      </a>
      <a href="https://medium.com/@trustlinefinance" className="mx-2">
        <i className="fab fa-medium"></i>
      </a>
      <a href="https://github.com/trustline-inc" className="mx-2">
        <i className="fab fa-github"></i>
      </a>
      <a href="https://docs.trustline.co/trustline/" className="mx-2">
        <i className="fa fa-book"></i>
      </a>
    </div>
  );
}
export default SocialLinks;
