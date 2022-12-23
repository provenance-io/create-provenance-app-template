import { FormEvent, useState } from 'react'
import invariant from 'tiny-invariant'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { getGroupsByMember } from '@provenanceio/wallet-utils'
import { Button, Form, InputGroup } from '../..'
import { TESTNET_GRPC_CLIENT } from '../../../consts'
import { GroupInfo } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/types_pb'
import ReactJson from 'react-json-view'

export const GetGroupIdByMember = () => {
  const [formErrors, setFormErrors] = useState('')
  const [memberAddress, setMemberAddress] = useState('')
  const { walletConnectState } = useWalletConnect()
  const [groups, setGroups] = useState<GroupInfo.AsObject[]>()

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors('')

    try {
      invariant(memberAddress, 'Member Address is required')
      getMyGroup(memberAddress)
    } catch (err) {
      setFormErrors((err as object).toString())
    }
  }

  const getMyGroup = async (address: string) => {
    const { groupsList } = await getGroupsByMember(address, TESTNET_GRPC_CLIENT)
    setGroups(groupsList)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {formErrors && (
        <span className="col-span-full text-red-500">{formErrors}</span>
      )}

      <InputGroup
        label="Member Address to Query:"
        name="memberAddress"
        onChange={setMemberAddress}
        placeholder={walletConnectState.address}
        value={memberAddress}
      />

      {groups && memberAddress && (
        <>
          <div className="text-lg font-bold">Groups ({groups.length} total):</div>
          {groups.length > 0 ? (
            <ReactJson src={groups} style={{ wordBreak: 'break-all' }} />
          ) : (
            <>Member {memberAddress} is not attached to any groups</>
          )}
        </>
      )}

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
