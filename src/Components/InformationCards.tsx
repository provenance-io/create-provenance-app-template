import type { ReactNode } from 'react'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { TxCard } from './Component'
import { CreateGroupModal, HashModal, RandomMsgModal } from './Modals'

interface ICProps {
  setModalChildren: (val: ReactNode) => void
  setShowModal: (val: boolean) => void
  showModal: boolean
}

export const InformationCards = ({
  setModalChildren,
  setShowModal,
  showModal,
}: ICProps) => {
  const { walletConnectState } = useWalletConnect()
  return (
    <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 py-10 px-5 sm:grid-cols-autofit-300">
      {/* Hash Modal */}
      <TxCard
        title="Send Hash"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<HashModal />)
          }
        }}
      />
      {/* Placeholder Cards */}
      <TxCard
        title="Send base64 Msg"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<RandomMsgModal />)
          }
        }}
      />
      <TxCard
        title="Create Group"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<CreateGroupModal />)
          }
        }}
      />
      <TxCard />
      <TxCard />
      <TxCard />
    </div>
  )
}
