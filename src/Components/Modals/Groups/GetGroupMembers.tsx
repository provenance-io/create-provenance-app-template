import { FormEvent, Fragment, useState } from 'react'
import invariant from 'tiny-invariant'
import { getGroupMembers } from '@provenanceio/wallet-utils'
import { TESTNET_GRPC_CLIENT } from '../../../consts'
import { Button, Form, InputGroup } from '../../../Components'
import { GroupMember } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/types_pb'

const GroupInfoList = ({ title, content }: { title: string; content: string }) => (
  <>
    <div className="font-bold">
      {title}: <span className="font-normal">{content}</span>
    </div>
    <hr className="neutral-900" />
  </>
)

export const GetGroupMembers = () => {
  const [formErrors, setFormErrors] = useState('')
  const [groupId, setGroupId] = useState('')
  const [groupMembers, setGroupMembers] = useState<GroupMember.AsObject[]>([])

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
    console.log(membersList)
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
      <div className="text-lg font-bold">
        Group Members ({groupMembers.length} total):
      </div>
      {groupMembers ? (
        groupMembers.length > 0 &&
        groupMembers.map((member, index) => (
          <Fragment key={index}>
            {member.member &&
              Object.keys(member.member).map((key, index) => (
                <GroupInfoList
                  key={index}
                  title={key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  content={
                    member.member
                      ? key === 'addedAt'
                        ? new Date(
                            member.member.addedAt.seconds * 1000
                          ).toDateString()
                        : member.member[key as keyof GroupMember.AsObject['member']]
                      : 'N/A'
                  }
                />
              ))}
            {groupMembers.length > 1 && (
              <hr className="h-px border-0 dark:bg-gray-700" />
            )}
          </Fragment>
        ))
      ) : (
        <>{groupId} has no members</>
      )}

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
