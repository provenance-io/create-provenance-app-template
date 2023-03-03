import type { ReactNode } from 'react'
import { GroupInformationCards, HomeInformationCards } from './Components'
import { ContractsInformationCards } from './Components/ContractsInformationCards'

interface ICProps {
  setModalChildren: (val: ReactNode) => void
  setShowModal: (val: boolean) => void
  showModal: boolean
  type: string
}

export const InformationCards = ({
  setModalChildren,
  setShowModal,
  showModal,
  type,
}: ICProps) => {
  const getCards = (type: string) => {
    switch (type) {
      case 'groups':
        return (
          <GroupInformationCards
            setModalChildren={setModalChildren}
            setShowModal={setShowModal}
            showModal={showModal}
          />
        )
      case 'contracts':
        return (
          <ContractsInformationCards
            setModalChildren={setModalChildren}
            setShowModal={setShowModal}
            showModal={showModal}
          />
        )
      default:
        return (
          <HomeInformationCards
            setModalChildren={setModalChildren}
            setShowModal={setShowModal}
            showModal={showModal}
          />
        )
    }
  }
  return (
    <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 py-10 px-5 sm:grid-cols-autofit-300">
      {getCards(type)}
    </div>
  )
}
