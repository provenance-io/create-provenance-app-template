import { useRef } from "react";
import { useWalletConnect } from "@provenanceio/walletconnect-js";
import {
  buildMessage,
  createAnyMessageBase64,
} from "@provenanceio/wallet-utils";

export const CreateGroupModal = () => {
  const adminAddressRef = useRef<HTMLInputElement>(null);
  const memberAddressRef = useRef<HTMLInputElement>(null);
  const memberWeightRef = useRef<HTMLInputElement>(null);
  const memberMetadataRef = useRef<HTMLInputElement>(null);
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect();
  const handleClick = () =>
    wcs.sendMessage({
      message: getCreateGroupMessage(),
      description: "Create Group",
    });
  // Create Group Message
  const getCreateGroupMessage = () =>
    createAnyMessageBase64(
      "MsgCreateGroup",
      buildMessage("MsgCreateGroup", {
        admin: String(
          adminAddressRef &&
            adminAddressRef.current &&
            adminAddressRef.current.value
        ),
        metadata: "",
        membersList: [
          {
            address: String(
              memberAddressRef &&
                memberAddressRef.current &&
                memberAddressRef.current.value
            ),
            weight: String(
              memberWeightRef &&
                memberWeightRef.current &&
                memberWeightRef.current.value
            ),
            metadata: String(
              memberMetadataRef &&
                memberMetadataRef.current &&
                memberMetadataRef.current.value
            ),
          },
        ],
      })
    );
  return (
    <>
      <div className="Form">
        <label className="Label" htmlFor="adminAddress">
          Admin Address:{" "}
        </label>
        <input
          ref={adminAddressRef}
          className="Input"
          type="text"
          id="adminAddress"
          name="adminAddress"
          placeholder={`${walletConnectState.address} (you)`}
          defaultValue={walletConnectState.address}
        />
      </div>
      <div className="Form">
        <label className="Label" htmlFor="memberAddress">
          Member Address:{" "}
        </label>
        <input
          ref={memberAddressRef}
          className="Input"
          type="text"
          id="memberAddress"
          name="memberAddress"
          placeholder="Enter address of the first group member"
        />
      </div>
      <div className="Form">
        <label className="Label" htmlFor="memberWeight">
          Member Voting Weight:{" "}
        </label>
        <input
          ref={memberWeightRef}
          className="Input"
          type="text"
          id="memberWeight"
          name="memberWeight"
          placeholder="Enter member voting weight"
        />
      </div>
      <div className="Form">
        <label className="Label" htmlFor="memberMeta">
          Member Metadata:{" "}
        </label>
        <input
          ref={memberMetadataRef}
          className="Input"
          type="text"
          id="memberMeta"
          name="memberMeta"
          placeholder="Enter any member metadata"
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
