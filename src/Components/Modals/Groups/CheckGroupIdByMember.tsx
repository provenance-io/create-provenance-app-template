import { FormEvent, useState } from 'react'
import invariant from 'tiny-invariant'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
// import { getGroupsByMember } from '@provenanceio/wallet-utils'
// import { TESTNET_GRPC_CLIENT } from '../../consts'
import { Button, Form, InputGroup } from '../../../Components'

export const CheckGroupIdByMember = () => {
  const [formErrors, setFormErrors] = useState('')
  const [memberAddress, setMemberAddress] = useState('')
  const { walletConnectState } = useWalletConnect()

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors('')

    try {
      invariant(memberAddress, 'Member Address is required')

      // const { results } = await getGroupsByMember(String(memberAddressRef && memberAddressRef.current && memberAddressRef.current.value), TESTNET_GRPC_CLIENT);
      console.log('you submitted it!')
    } catch (err) {
      setFormErrors((err as object).toString())
    }
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

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
