import { FormEvent, useState } from 'react'
import invariant from 'tiny-invariant'
import { getGroupInfo } from '@provenanceio/wallet-utils'
import { TESTNET_GRPC_CLIENT } from '../../../consts'
import { Button, Form, InputGroup } from '../../../Components'
import { GroupInfo } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/types_pb'

const GroupInfoList = ({ title, content }: { title: string; content: string }) => (
  <>
    <div className="font-bold">
      {title}: <span className="font-normal">{content}</span>
    </div>
    <hr className="neutral-900" />
  </>
)

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
      <div className="text-lg font-bold">Group Info:</div>
      <>
        {groupInfo &&
          Object.keys(groupInfo).map((key, index) => (
            <GroupInfoList
              key={index}
              title={key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              content={
                key === 'createdAt'
                  ? new Date(groupInfo.createdAt.seconds * 1000).toDateString()
                  : groupInfo[key as keyof GroupInfo.AsObject] || 'N/A'
              }
            />
          ))}
      </>

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
