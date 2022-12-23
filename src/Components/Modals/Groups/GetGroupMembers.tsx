import { FormEvent, Fragment, useState } from 'react'
import invariant from 'tiny-invariant'
import { getGroupMembers } from '@provenanceio/wallet-utils'
import { TESTNET_GRPC_CLIENT } from '../../../consts'
import { Button, Form, InputGroup } from '../../../Components'
import { GroupMember } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/types_pb'
import ReactJson from 'react-json-view'

export const GetGroupMembers = () => {
  const [formErrors, setFormErrors] = useState('')
  const [groupId, setGroupId] = useState('')
  const [groupMembers, setGroupMembers] = useState<GroupMember.AsObject[]>()

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors('')
    try {
      invariant(groupId, 'Group ID is required')
      getMyGroupMembers(Number(groupId))
    } catch (err) {
      setFormErrors((err as object).toString())
    }
  }

  const getMyGroupMembers = async (id: number) => {
    const { membersList } = await getGroupMembers(TESTNET_GRPC_CLIENT, id)
    setGroupMembers(membersList)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {formErrors && (
        <span className="col-span-full text-red-500">{formErrors}</span>
      )}

      <InputGroup
        label="Group ID to Query:"
        name="groupId"
        onChange={setGroupId}
        placeholder="0"
        value={groupId}
      />
      {groupMembers && groupId && (
        <>
          <div className="text-lg font-bold">
            Group Members ({groupMembers.length} total):
          </div>
          {groupMembers.length > 0 ? (
            <ReactJson src={groupMembers} style={{ wordBreak: 'break-all' }} />
          ) : (
            <>Group {groupId} has no members</>
          )}
        </>
      )}

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
