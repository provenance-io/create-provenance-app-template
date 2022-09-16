import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import hash from "./hash.svg";
import "./App.css";
import {
  QRCodeModal,
  useWalletConnect,
  WINDOW_MESSAGES,
} from "@provenanceio/walletconnect-js";
import {
  SendCoinData,
  BroadcastResults,
} from "@provenanceio/walletconnect-js/lib/types";
import { BaseResults } from "@provenanceio/walletconnect-js/lib/types/BaseResults";

interface TxCardProps {
  title?: string;
  onClick?: () => void;
}

interface ModalProps {
  children: React.ReactNode;
  onClick?: () => void;
}

function App() {
  ///////////// - Define walletConnect Services and State - /////////////////////
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  ///////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////
  // State settings for the template applications
  const [showModal, setShowModal] = useState(false);
  const [children, setChildren] = useState<React.ReactNode>();
  ///////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////
  /* walletConnect Actions
     - These actions are currently supported by wcjs, and perform the various
       functions seen in the template.
  */
  // wcjs Login Function
  // This function displays the login modal provided by wcjs
  const handleLogin = () => {
    if (walletConnectState.address) {
      wcs.disconnect();
    } else {
      wcs.connect();
    }
  };
  // Send Hash Action
  // Note that both hash and nhash are supported in wcjs
  // This application example uses hash as the denom
  const sendHashAction = ({ to, amount, denom }: SendCoinData) =>
    wcs.sendCoin({ to, amount, denom });
  ///////////////////////////////////////////////////////////////////////////////

  /////////////////////- Message Inputs and Actions - ///////////////////////////
  // Send Hash inputs
  const amountRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const handleSendHashSubmit = () => {
    if (addressRef && addressRef.current && amountRef && amountRef.current) {
      sendHashAction({
        to: "", //addressRef.current.value,
        amount: Number(amountRef.current.value),
        denom: "hash",
      });
    }
  };
  ///////////////////////////////////////////////////////////////////////////////

  ///////////////////////- Specific Action Modals - /////////////////////////////
  // Note: We highly recommend using Formik for your forms
  // Send Hash modal
  const HashModal = (
    <>
      <img src={hash} className="Hash-logo" alt="hash-logo" />
      <div className="Form">
        <label className="Label" htmlFor="amount">
          Amount of Hash to Send:{" "}
        </label>
        <input
          ref={amountRef}
          className="Input"
          type="number"
          id="amount"
          name="amount"
          placeholder="Enter hash amount"
        />
      </div>
      <div className="Form">
        <label className="Label" htmlFor="address">
          Wallet Address:{" "}
        </label>
        <input
          ref={addressRef}
          className="Input"
          type="text"
          id="address"
          name="address"
          placeholder="Recipient Wallet Address"
        />
      </div>
      <div className="Helper-Text">
        Current Wallet: {walletConnectState?.assets || "N/A"} hash
      </div>
      <button
        className="Button"
        onClick={() => {
          handleSendHashSubmit();
        }}
      >
        Submit
      </button>
    </>
  );
  ///////////////////////////////////////////////////////////////////////////////

  ///////////////////////- Template Components - ////////////////////////////////
  // Modal Framework
  const Modal = ({ children, onClick }: ModalProps) => (
    <div className="Modal">
      <div className="Modal-Card">
        <div className="Modal-Exit" onClick={() => setShowModal(!showModal)}>
          <svg
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            height="1.4rem"
          >
            <path d="M8.99984 1L5.09375 5L8.99984 9" />
            <path d="M1.00016 1L4.90625 5L1.00016 9" />
          </svg>
        </div>
        {children}
        <button
          className="Button-Cancel"
          onClick={() => setShowModal(!showModal)}
        >
          Exit
        </button>
      </div>
    </div>
  );
  // Set initial state to login
  useEffect(() => {
    if (!walletConnectState.address) {
      // Login Modal Prompt
      const LoginPrompt = (
        <div>Please login to test walletconnect-js actions</div>
      );
      setChildren(LoginPrompt);
    }
  }, [walletConnectState.address]);
  // Tx Cards
  const TxCard = ({ title = "Example", onClick }: TxCardProps) => (
    <div className="Individual-Card" onClick={onClick}>
      <div className="Individual-Card-Content">{title}</div>
    </div>
  );
  // Success Message
  const SuccessMessage = ({ msgType }: { msgType: string }) => (
    <div>{msgType} was successful!</div>
  );
  // Failure Message
  const FailureMessage = ({
    msgType,
    error,
  }: {
    msgType: string;
    error: string;
  }) => (
    <>
      <div>{msgType} failed!</div>
      <div>Error: {error}</div>
    </>
  );
  ///////////////////////////////////////////////////////////////////////////////

  ////////////////////- WINDOW_MESSAGES Listeners - /////////////////////////////
  useEffect(() => {
    // Success message for transaction messages (aka Send Hash)
    const transactionSuccess = (result: BroadcastResults) => {
      console.log(`WalletConnectJS | Complete | Result: `, result);
      setChildren(SuccessMessage({ msgType: "Transaction" }));
    };
    wcs.addListener(WINDOW_MESSAGES.TRANSACTION_COMPLETE, transactionSuccess);

    // Fail message for transaction messages
    const transactionFailure = (result: BroadcastResults) => {
      // Error messages will occur on results that have issues, which
      // are returned as type BaseResults
      const { error } = result as BaseResults;
      console.log(`WalletConnectJS | Failed | result, error: `, result, error);
      setChildren(
        FailureMessage({ msgType: "Transaction", error: String(error) })
      );
    };
    wcs.addListener(WINDOW_MESSAGES.TRANSACTION_FAILED, transactionFailure);

    // Remove event listeners when no longer needed
    return () => {
      wcs.removeListener(
        WINDOW_MESSAGES.TRANSACTION_COMPLETE,
        transactionSuccess
      );
      wcs.removeListener(
        WINDOW_MESSAGES.TRANSACTION_FAILED,
        transactionFailure
      );
      wcs.removeAllListeners();
    };
  });
  ///////////////////////////////////////////////////////////////////////////////

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
          {/* Header Login Info */}
          {walletConnectState.address && (
            <div className="Header-Login-Info">
              Logged in as{" "}
              <a
                className="App-link"
                href={`${
                  process.env.NODE_ENV === "production"
                    ? "https://explorer.provenance.io"
                    : "https://explorer.test.provenance.io"
                }/accounts/${walletConnectState.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {walletConnectState.address}
              </a>
            </div>
          )}
          {/* Header Login Button */}
          <button className="Button" onClick={handleLogin}>
            {walletConnectState.address ? "Logout" : "Login"}
          </button>
        </div>
      </header>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Select the items below to send your first transactions to the
          Provenance Blockchain
        </p>
        <a
          className="App-link"
          href="https://explorer.provenance.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Provenance Blockchain
        </a>
        {/* Information Cards */}
        <div className="Tx-Div">
          {/* Hash Modal */}
          {TxCard({
            title: "Send Hash",
            onClick: () => {
              setShowModal(!showModal);
              if (walletConnectState.address) {
                setChildren(HashModal);
              }
            },
          })}
          {/* Placeholder Cards */}
          {TxCard({})}
          {TxCard({})}
          {TxCard({})}
          {TxCard({})}
          {TxCard({})}
        </div>
      </header>
      {showModal && Modal({ children })}
      <QRCodeModal
        walletConnectService={wcs}
        title="Scan the QRCode with your mobile Provenance Blockchain Wallet."
        className="QR-Code-Modal"
        devWallets={["figure_web", "provenance_extension", "provenance_mobile"]}
      />
    </div>
  );
}

export default App;
