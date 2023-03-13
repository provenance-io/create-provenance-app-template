import { FormEvent, useState } from 'react'
import { Message } from 'google-protobuf'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { buildMessage, createAnyMessageBase64 } from '@provenanceio/wallet-utils'
import invariant from 'tiny-invariant'
import { Button, Form, InputGroup } from '../../../Components'
import { MsgInstantiateContract } from '@provenanceio/wallet-utils/lib/proto/cosmwasm/wasm/v1/tx_pb'
import { Coin } from '@provenanceio/wallet-utils/lib/proto/cosmos/base/v1beta1/coin_pb'

export const InstantiateContract = () => {
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect()
  const [formErrors, setFormErrors] = useState<string[]>([])
  // Sender: who is sending this contract. Will likely be the signing address
  const sender = walletConnectState.address
  // Admin: Required to allow for contract migration. Can be set to contract/individual accounts.
  const admin = walletConnectState.address
  // CodeId: The codeID of the contract to instantiate
  const [codeId, setCodeId] = useState(0)
  // Label: Any string to describe the instance of the SC
  const [label, setLabel] = useState('')
  // Msg: The msg to be sent to the SC for execution. SC dependent
  const [msg, setMsg] = useState('')
  // FundsList: Optional list, typically left blank
  const fundsList = [] as Coin.AsObject[]

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors([])

    try {
      const message = getGroupProposalMessage()
      console.log(message)
      invariant(message, 'Message was not created')

      wcs.sendMessage({
        message,
        description: 'Submit Group Proposal',
      })
    } catch (err) {
      setFormErrors((e) => [...e, (err as object).toString()])
      console.error(err)
    }
  }

  // Create Group Proposal Message
  const getGroupProposalMessage = () => {
    try {
      invariant(codeId, 'Code ID is required')
      invariant(label, 'Label is required')
      invariant(msg, 'Message is required')

      const message: MsgInstantiateContract.AsObject = {
        sender,
        admin,
        codeId,
        label,
        msg: new TextEncoder().encode(JSON.stringify(JSON.parse(msg))),
        fundsList,
      }

      return createAnyMessageBase64(
        'MsgInstantiateContract',
        buildMessage('MsgInstantiateContract', message) as unknown as Message
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
        label="Code ID:"
        name="codeId"
        onChange={setCodeId}
        value={codeId}
        placeholder="Specify the code ID of the SC to instantiate"
      />

      <InputGroup
        label="Label:"
        name="label"
        onChange={setLabel}
        value={label}
        placeholder="Specify a label for the instantiation"
      />

      <InputGroup
        label="Message:"
        name="msg"
        onChange={setMsg}
        type="textarea"
        value={msg}
        placeholder="Enter a SC msg"
      />

      <Button className="mt-8" type="submit">
        Submit New Proposal
      </Button>
    </Form>
  )
}
