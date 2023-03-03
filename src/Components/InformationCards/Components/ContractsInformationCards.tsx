import type { ReactNode } from 'react'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { TxCard } from '../../Component/TxCard'
import { InstantiateContract } from '../../Modals'

interface ICProps {
  setModalChildren: (val: ReactNode) => void
  setShowModal: (val: boolean) => void
  showModal: boolean
}

export const ContractsInformationCards = ({
  setModalChildren,
  setShowModal,
  showModal,
}: ICProps) => {
  const { walletConnectState } = useWalletConnect()
  return (
    <>
      <TxCard
        title="Instantiate Contract"
        onClick={() => {
          setShowModal(!showModal)
          if (walletConnectState.address) {
            setModalChildren(<InstantiateContract />)
          }
        }}
      />
      <TxCard />
    </>
  )
}
