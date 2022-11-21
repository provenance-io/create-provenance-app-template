import { useEffect, useRef, useState } from "react";
import { useWalletConnect } from "@provenanceio/walletconnect-js";
import hash from "../hash.svg";
import {
  buildMessage,
  createAnyMessageBase64,
  getBalancesList,
} from "@provenanceio/wallet-utils";
import { TESTNET_GRPC_CLIENT } from "../consts";

export const HashModal = () => {
  // Send Hash inputs
  const amountRef = useRef<HTMLInputElement>(null);
  const toAddressRef = useRef<HTMLInputElement>(null);
  // Hash local state variables
  const [myHash, setMyHash] = useState<{ amount: string; denom: string }>({
    amount: "",
    denom: "",
  });
  // Set send hash message
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();

  const getHashBalance = async () => {
    const { balancesList } = await getBalancesList(
      walletConnectState.address,
      TESTNET_GRPC_CLIENT
    );
    const hashAmount = balancesList.find(
      (element) => element.denom === "nhash"
    );
    if (hashAmount) setMyHash(hashAmount);
  };

  useEffect(() => {
    if (walletConnectState.address) {
      getHashBalance();
    }
    // Only want to repull if the address changes
    // eslint-disable-next-line
  }, [walletConnectState.address]);

  const handleClick = () =>
    wcs.sendMessage({
      message: getSendHashMessage(),
      description: "Send Hash",
    });

  const getSendHashMessage = () =>
    createAnyMessageBase64(
      "MsgSend",
      buildMessage("MsgSend", {
        toAddress: String(
          toAddressRef && toAddressRef.current && toAddressRef.current.value
        ),
        fromAddress: walletConnectState.address,
        amountList: [
          {
            amount: String(
              Number(
                amountRef && amountRef.current && amountRef.current.value
              ) * 1e9
            ),
            denom: "nhash",
          },
        ],
      })
    );

  return (
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
          ref={toAddressRef}
          className="Input"
          type="text"
          id="address"
          name="address"
          placeholder="Recipient Wallet Address"
        />
      </div>
      <div className="Helper-Text">
        Current Wallet:{" "}
        {myHash.amount
          ? `${(Number(myHash.amount) / 1e9).toFixed(2)} hash`
          : "N/A"}
      </div>
      <button
        style={{ marginTop: "30px" }}
        className="Button"
        onClick={handleClick}
      >
        Submit
      </button>
    </>
  );
};
