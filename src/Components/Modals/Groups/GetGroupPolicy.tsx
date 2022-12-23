import { FormEvent, useState } from 'react'
import invariant from 'tiny-invariant'
import { getGroupPolicyInfo } from '@provenanceio/wallet-utils'
import { TESTNET_GRPC_CLIENT } from '../../../consts'
import { Button, Form, InputGroup } from '../../../Components'
import { GroupPolicyInfo } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/types_pb'
import ReactJson from 'react-json-view'

export const GetGroupPolicy = () => {
  const [formErrors, setFormErrors] = useState('')
  const [address, setAddress] = useState('')
  const [groupPolicy, setGroupPolicy] = useState<GroupPolicyInfo.AsObject>()

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors('')

    try {
      invariant(address, 'Address is required')
      getMyGroupPolicyInfo(address)
    } catch (err) {
      setFormErrors((err as object).toString())
    }
  }

  const getMyGroupPolicyInfo = async (address: string) => {
    const { info } = await getGroupPolicyInfo(address, TESTNET_GRPC_CLIENT)
    setGroupPolicy(info)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {formErrors && (
        <span className="col-span-full text-red-500">{formErrors}</span>
      )}

      <InputGroup
        label="Policy address to Query:"
        name="address"
        onChange={setAddress}
        placeholder="0"
        value={address}
      />
      {groupPolicy && address && (
        <>
          <div className="text-lg font-bold">Policy Info:</div>
          {Object.keys(groupPolicy).length > 0 ? (
            <ReactJson src={groupPolicy} style={{ wordBreak: 'break-all' }} />
          ) : (
            <>Policy address {address} has no info</>
          )}
        </>
      )}

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
