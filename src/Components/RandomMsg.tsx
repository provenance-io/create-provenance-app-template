import { useRef } from "react";
import { useWalletConnect } from "@provenanceio/walletconnect-js";

export const RandomMsgModal = () => {
  const randomMsgRef = useRef<HTMLInputElement>(null);
  const { walletConnectService: wcs } = useWalletConnect();
  const handleClick = () =>
    wcs.sendMessage({
      message: String(
        randomMsgRef && randomMsgRef.current && randomMsgRef.current.value
      ),
      description: "Send random message",
    });
  return (
    <>
      <div className="Form">
        <label className="Label" htmlFor="randomMsg">
          Message to send:{" "}
        </label>
        <input
          ref={randomMsgRef}
          className="Input"
          type="text"
          id="randomMsg"
          name="randomMsg"
          placeholder="Enter base64 message string"
        />
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
