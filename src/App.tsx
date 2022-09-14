import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
// import { QRCodeModal, useWalletConnect } from "@provenanceio/walletconnect-js";

function App() {
  // const { walletConnectService: wcs, walletConnectState } = useWalletConnect();

  // Local state to determine login status. Use redux/react state if desired.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // This function handles login/logout through wcs
  const handleLogin = () => {
    if (isLoggedIn) {
      console.log("Logging out");
      // wcs.disconnect();
      setIsLoggedIn(false);
    } else {
      console.log("Logging in");
      // wcs.connect();
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="App">
      {/* Header Navigation Component */}
      <header className="Header-Nav-Component">
        {/* Header Logo and Title Component */}
        <div className="Logo-and-Title-Component">
          <img src={logo} className="Nav-logo" alt="logo" />
          Provenance Blockchain Example Application
        </div>
        {/* Header Login Component */}
        <div className="Header-Login-Component">
          <button className="Login-Button" onClick={handleLogin}>
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </header>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://explorer.provenance.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Provenance Blockchain
        </a>
      </header>
      {/* <QRCodeModal
        walletConnectService={wcs}
        walletConnectState={walletConnectState}
        devWallets={["figure_web", "provenance_extension", "provenance_mobile"]}
      /> */}
    </div>
  );
}

export default App;
