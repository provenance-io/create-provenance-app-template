import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  QRCodeModal,
  useWalletConnect,
  WINDOW_MESSAGES,
} from "@provenanceio/walletconnect-js";
import { BroadcastResults } from "@provenanceio/walletconnect-js/lib/types";
import { BaseResults } from "@provenanceio/walletconnect-js/lib/types/BaseResults";
import {
  CreateGroupModal,
  HashModal,
  Modal,
  RandomMsgModal,
  TxCard,
} from "./Components";
import { getAccountInfo } from "@provenanceio/wallet-utils";
import { TESTNET_GRPC_CLIENT } from "./consts";

export const App = () => {
  ///////////// - Define walletConnect Services and State - /////////////////////
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const [myBaseAccount, setMyBaseAccount] = useState<any>(null);
  ///////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////
  // State settings for the template applications
  const [children, setChildren] = useState<React.ReactNode>();
  ///////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////
  /* walletConnect Login */
  // This function displays the login modal provided by wcjs
  const handleLogin = () => {
    if (walletConnectState.address) {
      wcs.disconnect();
    } else {
      wcs.connect();
    }
  };
  ///////////////////////////////////////////////////////////////////////////////

  // Account info
  const getMyAccount = async () => {
    const { accountNumber } = await getAccountInfo(
      walletConnectState.address,
      TESTNET_GRPC_CLIENT
    );
    setMyBaseAccount(accountNumber);
  };

  useEffect(() => {
    if (walletConnectState.address) {
      getMyAccount();
    }
    // Only want to repull if the address changes
    // eslint-disable-next-line
  }, [walletConnectState.address]);

  console.log(myBaseAccount);

  ///////////////////////- Template Components - ////////////////////////////////
  // Modal state
  const [showModal, setShowModal] = useState(false);

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
    wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, transactionSuccess);

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
    wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, transactionFailure);

    // Remove event listeners when no longer needed
    return () => {
      wcs.removeListener(
        WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE,
        transactionSuccess
      );
      wcs.removeListener(
        WINDOW_MESSAGES.SEND_MESSAGE_FAILED,
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
                setChildren(<HashModal />);
              }
            },
          })}
          {/* Placeholder Cards */}
          {TxCard({
            title: "Send base64 Msg",
            onClick: () => {
              setShowModal(!showModal);
              if (walletConnectState.address) {
                setChildren(<RandomMsgModal />);
              }
            },
          })}
          {TxCard({
            title: "Create Group",
            onClick: () => {
              setShowModal(!showModal);
              if (walletConnectState.address) {
                setChildren(<CreateGroupModal />);
              }
            },
          })}
          {TxCard({})}
          {TxCard({})}
          {TxCard({})}
        </div>
      </header>
      {showModal && (
        <Modal
          children={children}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <QRCodeModal
        walletConnectService={wcs}
        title="Scan the QRCode with your mobile Provenance Blockchain Wallet."
        className="QR-Code-Modal"
        devWallets={["figure_web", "provenance_extension", "provenance_mobile"]}
      />
    </div>
  );
};
