import { FormEvent, useState } from 'react'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { buildMessage, createAnyMessageBase64 } from '@provenanceio/wallet-utils'
import {
  Exec,
  MsgVote,
} from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/tx_pb'
import { VoteOption } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/types_pb'
import invariant from 'tiny-invariant'
import { Button, Form, InputGroup } from '../../../Components'
import { Message } from 'google-protobuf'

export const VoteGroupProposal = () => {
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect()
  const [formErrors, setFormErrors] = useState<string[]>([])
  const voter = walletConnectState.address
  const [proposalId, setProposalId] = useState('')
  const [justification, setJustification] = useState('')

  // Create a local object of the Vote enum values so
  // they can be easily displayed
  const voteOptions = Object.keys(VoteOption).map((exec) => exec)
  const [voteOption, setVoteOption] =
    useState<keyof typeof VoteOption>('VOTE_OPTION_YES')
  const [execType, setExecType] = useState<Exec>(Exec['EXEC_UNSPECIFIED'])

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setFormErrors([])

    try {
      const message = getGroupVoteMessage()
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
  const getGroupVoteMessage = () => {
    try {
      invariant(proposalId, 'Proposal ID is required')
      invariant(voteOption, 'Vote Option is required')

      const message: MsgVote.AsObject = {
        proposalId: Number(proposalId),
        voter,
        option: VoteOption[voteOption],
        exec: execType,
        metadata: JSON.stringify(justification),
      }

      console.log('build', buildMessage('MsgGroupVote', message))

      return createAnyMessageBase64(
        'MsgGroupVote',
        buildMessage('MsgGroupVote', message) as Message
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
        label="Proposal ID to Vote On:"
        name="proposalId"
        onChange={setProposalId}
        value={proposalId}
        placeholder="Provide a valid group proposal ID"
      />

      <InputGroup
        label="Vote:"
        name="voteOption"
        onChange={setVoteOption}
        type="select"
        options={voteOptions.map((option) => ({
          title: option,
          value: option,
          key: option,
        }))}
      />

      <InputGroup
        label="Justification:"
        name="justification"
        onChange={setJustification}
        value={justification}
        placeholder="Provide a justification (optional)"
      />

      <InputGroup
        label="Execute Immediately:"
        type="checkbox"
        name="execType"
        onChange={() =>
          setExecType(
            execType === Exec['EXEC_TRY']
              ? Exec['EXEC_UNSPECIFIED']
              : Exec['EXEC_TRY']
          )
        }
        value={Exec['EXEC_TRY']}
      />

      <Button className="mt-8" type="submit">
        Submit Vote
      </Button>
    </Form>
  )
}
