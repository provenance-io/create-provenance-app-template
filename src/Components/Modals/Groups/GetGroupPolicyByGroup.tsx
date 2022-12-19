import React, { FormEvent, useState, Fragment } from 'react'
import invariant from 'tiny-invariant'
import { getGroupPolicyByGroup } from '@provenanceio/wallet-utils'
import { TESTNET_GRPC_CLIENT } from '../../../consts'
import { Button, Form, InputGroup } from '../../../Components'
import { GroupPolicyInfo } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/types_pb'

const GroupPoliciesList = ({
  title,
  content,
}: {
  title: string
  content: string
}) => (
  <>
    <div className="font-bold">
      {title}: <span className="font-normal">{content}</span>
    </div>
    <hr className="neutral-900" />
  </>
)

export const GetGroupPolicyByGroup = () => {
  const [formErrors, setFormErrors] = useState('')
  const [groupId, setGroupId] = useState('')
  const [groupPolicies, setGroupPolicies] = useState<GroupPolicyInfo.AsObject[]>([])

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
        label="Policy address to Query:"
        name="groupId"
        onChange={setGroupId}
        placeholder="0"
        value={groupId}
      />
      <div className="text-lg font-bold">Policy Info:</div>
      <div className="text-lg font-bold">
        Group Policies ({groupPolicies.length} total):
      </div>
      {groupPolicies ? (
        groupPolicies.length > 0 && <>{JSON.stringify(groupPolicies)}</>
      ) : (
        <>{groupId} has no members</>
      )}

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
