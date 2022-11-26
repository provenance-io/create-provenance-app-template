import { FormEvent, useState } from 'react'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { buildMessage, createAnyMessageBase64 } from '@provenanceio/wallet-utils'
import invariant from 'tiny-invariant'
import { Button, Form, InputGroup } from '../Component'

export const CreateGroupModal = () => {
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
      invariant(message, 'Message was not created')

      wcs.sendMessage({
        message,
        description: 'Create Group',
      })
    } catch (err) {
      setFormErrors((e) => [...e, (err as object).toString()])
      console.error(err)
    }
  }

  // Create Group Message
  const getCreateGroupMessage = () => {
    try {
      invariant(adminAddress, 'Admin address is required')
      invariant(memberAddress, 'Member address is required')
      invariant(memberWeight, 'Member weight is required')
      invariant(memberMetadata, 'Member metadata is required')

      return createAnyMessageBase64(
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
        value={adminAddress}
        placeholder={`${walletConnectState.address} (you)`}
      />

      <InputGroup
        label="Member Address:"
        name="memberAddress"
        onChange={setMemberAddress}
        value={memberAddress}
        placeholder="Enter address of the first group member"
      />

      <InputGroup
        label="Member Weight:"
        name="memberWeight"
        onChange={setMemberWeight}
        value={memberWeight}
        placeholder="Enter member voting weight"
      />

      <InputGroup
        label="Member Metadata:"
        name="memberMetadata"
        onChange={setMemberMetadata}
        value={memberMetadata}
        placeholder="Enter any member metadata"
      />

      <Button className="mt-8" type="submit">
        Submit
      </Button>
    </Form>
  )
}
