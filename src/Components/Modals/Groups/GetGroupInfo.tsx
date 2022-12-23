import { FormEvent, useState } from 'react'
import invariant from 'tiny-invariant'
import { getGroupInfo } from '@provenanceio/wallet-utils'
import { TESTNET_GRPC_CLIENT } from '../../../consts'
import { Button, Form, InputGroup } from '../../../Components'
import { GroupInfo } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/types_pb'
import ReactJson from 'react-json-view'

export const GetGroupInfo = () => {
  const [formErrors, setFormErrors] = useState('')
  const [groupId, setGroupId] = useState('')
  const [groupInfo, setGroupInfo] = useState<GroupInfo.AsObject>()

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors('')

    try {
      invariant(groupId, 'Group ID is required')
      getMyGroupInfo(Number(groupId))
    } catch (err) {
      setFormErrors((err as object).toString())
    }
  }

  const getMyGroupInfo = async (id: number) => {
    const { info } = await getGroupInfo(TESTNET_GRPC_CLIENT, id)
    setGroupInfo(info)
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
      {groupInfo && groupId && (
        <>
          <div className="text-lg font-bold">
            Group Info:
          </div>
          {Object.keys(groupInfo).length > 0 ? (
            <ReactJson src={groupInfo} style={{ wordBreak: 'break-all' }} />
          ) : (
            <>Group {groupId} has no info</>
          )}
        </>
      )}

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
