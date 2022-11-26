import { FormEvent, useState } from 'react'
import invariant from 'tiny-invariant'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { buildMessage, createAnyMessageBase64 } from '@provenanceio/wallet-utils'
import { Button, Form, InputGroup } from '../Component'

export const UpdateGroupMembersModal = () => {
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect()
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [adminAddress, setAdminAddress] = useState(walletConnectState.address)
  const [memberAddress, setMemberAddress] = useState('')
  const [memberWeight, setMemberWeight] = useState('')
  const [memberMetadata, setMemberMetadata] = useState('')

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors([])
    try {
      const message = getCreateGroupMessage()

      invariant(message, 'A message is required')

      wcs.sendMessage({
        message,
        description: 'Create Group',
      })
    } catch (err) {
      console.error(err)
      setFormErrors((e) => [...e, (err as object).toString()])
    }
  }
  // Create Group Message
  const getCreateGroupMessage = () => {
    try {
      invariant(adminAddress, 'Admin address is required')
      invariant(memberAddress, 'Member address is required')
      invariant(memberWeight, 'Member weight is required')
      invariant(memberMetadata, 'Member metadata is required')

      createAnyMessageBase64(
        'MsgCreateGroup',
        buildMessage('MsgCreateGroup', {
          admin: adminAddress,
          metadata: '',
          membersList: [
            {
              address: memberAddress,
              weight: memberWeight,
              metadata: memberMetadata,
            },
          ],
        })
      )
    } catch (err) {
      setFormErrors((e) => [...e, (err as object).toString()])
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {formErrors.length > 0 &&
        formErrors.map((err) => (
          <span className="col-span-full text-red-500">{err}</span>
        ))}

      <InputGroup
        label="Admin Address:"
        name="adminAddress"
        onChange={setAdminAddress}
        placeholder={`${walletConnectState.address} (you)`}
        value={adminAddress}
      />

      <InputGroup
        label="Member Address:"
        name="memberAddress"
        onChange={setMemberAddress}
        placeholder="Enter address of the first group member"
        value={memberAddress}
      />

      <InputGroup
        label="Member Voting Weight:"
        name="memberWeight"
        onChange={setMemberWeight}
        placeholder="Enter member voting weight"
        value={memberWeight}
      />

      <InputGroup
        label="Member Metadata:"
        name="memberMeta"
        onChange={setMemberMetadata}
        placeholder="Enter any member metadata"
        value={memberMetadata}
      />

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
