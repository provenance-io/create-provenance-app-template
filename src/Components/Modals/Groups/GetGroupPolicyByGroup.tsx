import { FormEvent, useState, Fragment } from 'react'
import invariant from 'tiny-invariant'
import { getGroupPolicyByGroup } from '@provenanceio/wallet-utils'
import { TESTNET_GRPC_CLIENT } from '../../../consts'
import { Button, Form, InputGroup } from '../../../Components'
import { GroupPolicyInfo } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/types_pb'
import ReactJson from 'react-json-view'

export const GetGroupPolicyByGroup = () => {
  const [formErrors, setFormErrors] = useState('')
  const [groupId, setGroupId] = useState('')
  const [groupPolicies, setGroupPolicies] = useState<GroupPolicyInfo.AsObject[]>()

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors('')

    try {
      invariant(groupId, 'Group ID is required')
      getMyGroupPolicyInfo(Number(groupId))
    } catch (err) {
      setFormErrors((err as object).toString())
    }
  }

  const getMyGroupPolicyInfo = async (id: number) => {
    const { groupPoliciesList } = await getGroupPolicyByGroup(
      id,
      TESTNET_GRPC_CLIENT
    )
    setGroupPolicies(groupPoliciesList)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {formErrors && (
        <span className="col-span-full text-red-500">{formErrors}</span>
      )}

      <InputGroup
        label="Group to Query:"
        name="groupId"
        onChange={setGroupId}
        placeholder="0"
        value={groupId}
      />
      {groupPolicies && groupId && (
        <>
          <div className="text-lg font-bold">
            Group Policies ({groupPolicies.length} total):
          </div>
          {groupPolicies.length > 0 ? (
            <ReactJson src={groupPolicies} style={{ wordBreak: 'break-all' }} />
          ) : (
            <>Group {groupId} has no policies</>
          )}
        </>
      )}

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
