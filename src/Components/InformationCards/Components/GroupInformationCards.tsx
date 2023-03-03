import type { ReactNode } from 'react'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { TxCard } from '../../Component/TxCard'
import {
  GetGroupIdByMember,
  CreateGroupModal,
  GetGroupInfo,
  GetGroupMembers,
  GetGroupPolicy,
  GetGroupPolicyByGroup,
  VoteGroupProposal,
  SubmitGroupProposal,
} from '../../Modals'

interface ICProps {
  setModalChildren: (val: ReactNode) => void
  setShowModal: (val: boolean) => void
  showModal: boolean
}

export const GroupInformationCards = ({
  setModalChildren,
  setShowModal,
  showModal,
}: ICProps) => {
  const { walletConnectState } = useWalletConnect()
  return (
    <>
      <TxCard
        title="Create Group"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<CreateGroupModal />)
          }
        }}
      />
      <TxCard
        title="Group ID by Member"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<GetGroupIdByMember />)
          }
        }}
      />
      <TxCard
        title="Get Group Info"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<GetGroupInfo />)
          }
        }}
      />
      <TxCard
        title="Get Group Members"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<GetGroupMembers />)
          }
        }}
      />
      <TxCard
        title="Group Policy by Address"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<GetGroupPolicy />)
          }
        }}
      />
      <TxCard
        title="Group Policy by Group"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<GetGroupPolicyByGroup />)
          }
        }}
      />
      <TxCard
        title="Submit Group Proposal"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<SubmitGroupProposal />)
          }
        }}
      />
      <TxCard
        title="Vote on Group Proposal"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<VoteGroupProposal />)
          }
        }}
      />
      <TxCard />
    </>
  )
}
