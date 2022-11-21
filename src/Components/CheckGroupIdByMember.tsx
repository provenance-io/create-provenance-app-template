import { useRef } from "react";
import { useWalletConnect } from "@provenanceio/walletconnect-js";
import { getGroupsByMember } from "@provenanceio/wallet-utils";
import { TESTNET_GRPC_CLIENT } from "../consts";

export const UpdateGroupMembersModal = () => {
  const memberAddressRef = useRef<HTMLInputElement>(null);
  const { walletConnectState } = useWalletConnect();
  const handleClick = async () => {
    // const { results } = await getGroupsByMember(String(memberAddressRef && memberAddressRef.current && memberAddressRef.current.value), TESTNET_GRPC_CLIENT);
    console.log("you clicked it!");
  };

  return (
    <>
      <div className="Form">
        <label className="Label" htmlFor="memberAddress">
          Member Address to Query:{" "}
        </label>
        <input
          ref={memberAddressRef}
          className="Input"
          type="text"
          id="memberAddress"
          name="memberAddress"
          placeholder={walletConnectState.address}
          defaultValue={walletConnectState.address}
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
