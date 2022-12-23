import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { TxCard } from '../../Component/TxCard'
import { HashModal, RandomMsgModal } from '../../Modals'

interface ICProps {
  setModalChildren: (val: ReactNode) => void
  setShowModal: (val: boolean) => void
  showModal: boolean
}

export const HomeInformationCards = ({
  setModalChildren,
  setShowModal,
  showModal,
}: ICProps) => {
  const { walletConnectState } = useWalletConnect()
  const navigate = useNavigate()
  return (
    <>
      <TxCard
        title="Send Hash"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<HashModal />)
          }
        }}
      />
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
        title="Groups"
        onClick={() => navigate('/groups')}
      />
    </>
  )
}
