import { FormEvent, useEffect, useState } from 'react'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import hash from '../../hash.svg'
import {
  buildMessage,
  createAnyMessageBase64,
  getBalancesList,
} from '@provenanceio/wallet-utils'
import invariant from 'tiny-invariant'
import { TESTNET_GRPC_CLIENT } from '../../consts'
import { Button, Form, InputGroup } from '../Component'
import { Message } from 'google-protobuf'

export const HashModal = () => {
  const [formErrors, setFormErrors] = useState<string[]>([])
  // Send Hash inputs
  const [amount, setAmount] = useState('')
  const [toAddress, setToAddress] = useState('')
  // Hash local state variables
  const [myHash, setMyHash] = useState<{ amount: string; denom: string }>({
    amount: '',
    denom: '',
  })
  // Set send hash message
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect()

  const getHashBalance = async () => {
    const { balancesList } = await getBalancesList(
      walletConnectState.address,
      TESTNET_GRPC_CLIENT
    )
    const hashAmount = balancesList.find((element) => element.denom === 'nhash')
    if (hashAmount) setMyHash(hashAmount)
  }

  useEffect(() => {
    if (walletConnectState.address) {
      getHashBalance()
    }
    // Only want to repull if the address changes
    // eslint-disable-next-line
  }, [walletConnectState.address])

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors([])

    try {
      const message = getSendHashMessage()

      invariant(message, 'Message was not created')

      wcs.sendMessage({
        message,
        description: 'Send Hash',
      })
    } catch (err) {
      setFormErrors((e) => [...e, (err as object).toString()])
      console.error(err)
    }
  }

  const getSendHashMessage = () => {
    try {
      invariant(toAddress, 'A recipient address is required')
      invariant(amount, 'A Hash amount is required')

      invariant(
        Number(amount) <= Number(myHash.amount) / 1e9,
        'The amount must be less than or equal to what you have available'
      )

      return createAnyMessageBase64(
        'MsgSend',
        buildMessage('MsgSend', {
          toAddress,
          fromAddress: walletConnectState.address,
          amountList: [
            {
              amount,
              denom: 'nhash',
            },
          ],
        }) as Message
      )
    } catch (err) {
      console.error(err)
      setFormErrors((e) => [...e, (err as object).toString()])
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <img
        src={hash}
        className="-p-2.5 col-span-full w-16 place-self-center"
        alt="hash-logo"
      />

      {formErrors.length > 0 &&
        formErrors.map((err) => (
          <span className="col-span-full text-red-500">{err}</span>
        ))}

      <InputGroup
        label="Amount of Hash to Send:"
        type="number"
        name="amount"
        onChange={setAmount}
        placeholder="Enter hash amount"
        value={amount}
      />

      <InputGroup
        label="Wallet Address:"
        name="address"
        onChange={setToAddress}
        placeholder="Recipient Wallet Address"
        value={toAddress}
      />

      <div className="my-5 text-center text-xs">
        Current Wallet:{' '}
        {myHash.amount ? `${(Number(myHash.amount) / 1e9).toFixed(2)} hash` : 'N/A'}
      </div>

      <Button className="mt-8">Submit</Button>
    </Form>
  )
}
