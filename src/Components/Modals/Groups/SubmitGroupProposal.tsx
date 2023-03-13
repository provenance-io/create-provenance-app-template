import { FormEvent, useEffect, useState } from 'react'
import { base64ToBytes } from '@tendermint/belt'
import { Message } from 'google-protobuf'
import * as google_protobuf_any_pb from 'google-protobuf/google/protobuf/any_pb'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import {
  buildMessage,
  createAnyMessageBase64,
  msgAnyB64toAny,
  MsgSubmitGroupProposalDisplay,
} from '@provenanceio/wallet-utils'
import { Exec } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/tx_pb'
import invariant from 'tiny-invariant'
import { Button, Form, InputGroup } from '../../../Components'
import { getGroupsByMember, getGroupPolicyByGroup } from '@provenanceio/wallet-utils'
import { TESTNET_GRPC_CLIENT } from '../../../consts'
import {
  GroupInfo,
  GroupPolicyInfo,
} from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/types_pb'
import { MsgSend } from '@provenanceio/wallet-utils/lib/proto/cosmos/bank/v1beta1/tx_pb'

export const SubmitGroupProposal = () => {
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect()
  const [formErrors, setFormErrors] = useState<string[]>([])
  const proposersList = [walletConnectState.address]
  const [proposalTitle, setProposalTitle] = useState('')
  const [proposalSummary, setProposalSummary] = useState('')
  const [proposalDetails, setProposalDetails] = useState('')
  const [proposalForumUrl, setProposalForumUrl] = useState('')
  const [execType, setExecType] = useState<Exec>(Exec['EXEC_UNSPECIFIED'])
  const [groups, setGroups] = useState<GroupInfo.AsObject[]>([
    { id: 0, admin: '', metadata: '', version: 0, totalWeight: '' },
  ])
  const [groupPolicies, setGroupPolicies] = useState<GroupPolicyInfo.AsObject[]>([
    { address: '', groupId: 0, admin: '', metadata: '', version: 0 },
  ])
  const [groupPolicyAddress, setGroupPolicyAddress] = useState('0')
  const [selectedGroup, setSelectedGroup] = useState(0)
  const [sendMsg, setSendMsg] = useState(false)

  // Function to retrieve groups
  const getMyGroup = async (address: string) => {
    const { groupsList } = await getGroupsByMember(address, TESTNET_GRPC_CLIENT)
    setGroups(groupsList)
    setSelectedGroup(groupsList[0].id)
  }
  // Function to get group policy by group
  const getMyGroupPolicyInfo = async (id: number) => {
    const { groupPoliciesList } = await getGroupPolicyByGroup(
      id,
      TESTNET_GRPC_CLIENT
    )
    setGroupPolicies(groupPoliciesList)
    setGroupPolicyAddress(groupPoliciesList[0].address)
  }

  // pull groups
  useEffect(() => {
    if (walletConnectState.address) {
      getMyGroup(walletConnectState.address)
    }
    // Only want to repull if the address changes
    // eslint-disable-next-line
  }, [walletConnectState.address])

  // pull group policies
  useEffect(() => {
    if (groups.length > 0 && selectedGroup) {
      getMyGroupPolicyInfo(selectedGroup)
    }
    // Only want to repull if the selected group changes
    // eslint-disable-next-line
  }, [selectedGroup])

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
      invariant(proposalTitle, 'Proposal Title is required')
      invariant(proposalSummary, 'Proposal Summary is required')
      invariant(proposalDetails, 'Proposal Details are required')
      invariant(proposalForumUrl, 'Forum URL is required')

      const sendMessage: MsgSend.AsObject = {
        fromAddress: groupPolicyAddress,
        toAddress: walletConnectState.address,
        amountList: [
          {
            amount: '1000000000',
            denom: 'nhash',
          },
        ],
      }

      const msgAsProto = msgAnyB64toAny(
        createAnyMessageBase64(
          'MsgSend',
          buildMessage('MsgSend', sendMessage) as unknown as Message
        )
      )

      const message: MsgSubmitGroupProposalDisplay = {
        groupPolicyAddress,
        proposersList,
        metadata: JSON.stringify({
          title: proposalTitle,
          summary: proposalSummary,
          details: proposalDetails,
          proposalForumUrl,
        }),
        exec: execType,
        messagesList: sendMsg
          ? [
              {
                typeUrl: msgAsProto.getTypeUrl(),
                value: msgAsProto.getValue(),
              },
            ]
          : [],
      }

      return createAnyMessageBase64(
        'MsgSubmitGroupProposal',
        buildMessage('MsgSubmitGroupProposal', message) as unknown as Message
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
        label="Group:"
        name="selectedGroup"
        onChange={setSelectedGroup}
        type="select"
        options={groups.map((group) => ({
          title: group.id,
          value: group.id,
          key: group.id,
        }))}
      />

      <InputGroup
        label="Group Policy:"
        name="groupPolicyAddress"
        onChange={setGroupPolicyAddress}
        type="select"
        options={groupPolicies.map((policy) => ({
          title: policy.address,
          value: policy.address,
          key: policy.address,
        }))}
      />

      <InputGroup
        label="Title:"
        name="proposalTitle"
        onChange={setProposalTitle}
        value={proposalTitle}
        placeholder="Specify a proposal title"
      />

      <InputGroup
        label="Summary:"
        name="proposalSummary"
        onChange={setProposalSummary}
        value={proposalSummary}
        placeholder="Specify a proposal summary"
      />

      <InputGroup
        label="Details:"
        name="proposalDetails"
        onChange={setProposalDetails}
        value={proposalDetails}
        placeholder="Enter details of the proposal"
      />

      <InputGroup
        label="Forum URL:"
        name="proposalForumUrl"
        onChange={setProposalForumUrl}
        value={proposalForumUrl}
        placeholder="Enter a url for ongoing discussion"
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

      <InputGroup
        label="Attach a send message for 1nhash (demo) from group to this account:"
        type="checkbox"
        name="sendMsg"
        onChange={() => setSendMsg(!sendMsg)}
        value={Exec['EXEC_TRY']}
      />

      <Button className="mt-8" type="submit">
        Submit New Proposal
      </Button>
    </Form>
  )
}
