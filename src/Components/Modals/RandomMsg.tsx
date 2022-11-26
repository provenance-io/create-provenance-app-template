import { FormEvent, useState } from 'react'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import invariant from 'tiny-invariant'
import { Button, Form, InputGroup } from '../Component'

export const RandomMsgModal = () => {
  const { walletConnectService: wcs } = useWalletConnect()
  const [formErrors, setFormErrors] = useState('')
  const [randomMsg, setRandomMsg] = useState('')

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors('')
    try {
      invariant(randomMsg, 'A message is required')

      wcs.sendMessage({
        message: randomMsg,
        description: 'Send random message',
      })
    } catch (err) {
      setFormErrors((err as object).toString())
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {formErrors && (
          <span className="col-span-full text-red-500">{formErrors}</span>
        )}

        <InputGroup
          label="Message to send:"
          name="randomMsg"
          onChange={setRandomMsg}
          placeholder="Enter base64 message string"
          value={randomMsg}
        />

        <Button className="mt-8">Submit</Button>
      </Form>
    </>
  )
}
