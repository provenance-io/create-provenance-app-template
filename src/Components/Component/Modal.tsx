import { useEffect, useState } from 'react'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import { Button } from './Button'

interface ModalProps {
  children?: React.ReactNode
  setShowModal: (arg: boolean) => void
  showModal: boolean
}

export const Modal = ({ children, setShowModal, showModal }: ModalProps) => {
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (showModal) setHidden(false)
    else {
      setTimeout(() => setHidden(true), 300)
    }
  }, [showModal])

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (showModal && e.key === 'Escape') {
        setShowModal(false)
      }
    }

    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [showModal, setShowModal])

  // Login Modal Prompt
  const LoginPrompt = (
    <>
      <div>Please connect to test walletconnect-js actions</div>
      <Button
        onClick={() => {
          setShowModal(false)
          walletConnectState.address ? wcs.disconnect() : wcs.connect()
        }}
      >
        Connect
      </Button>
    </>
  )

  return (
    <div
      className={`
        fixed top-0 left-0 z-50 grid h-full w-full place-items-center bg-gray-900 bg-opacity-50 text-gray-600
        transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}
        ${hidden ? 'hidden' : ''}
      `}
      onClick={(e) => setShowModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[600px] min-h-full min-w-full place-items-center gap-6 overflow-y-auto bg-gray-200 p-10 shadow-md transition-all duration-1000 sm:min-h-0 sm:w-[600px] sm:min-w-0 sm:rounded-lg"
      >
        <div
          className="absolute top-2.5 right-2.5 grid h-6 w-6 cursor-pointer place-content-center rounded-full"
          onClick={() => setShowModal(false)}
        >
          <svg
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            height="1.4rem"
          >
            <path d="M8.99984 1L5.09375 5L8.99984 9" />
            <path d="M1.00016 1L4.90625 5L1.00016 9" />
          </svg>
        </div>
        {!walletConnectState.address ? LoginPrompt : children}
      </div>
    </div>
  )
}
