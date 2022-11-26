import React, { useEffect, useState } from 'react'
import { useWalletConnect, WINDOW_MESSAGES } from '@provenanceio/walletconnect-js'
import { BroadcastResults } from '@provenanceio/walletconnect-js/lib/types'
import { BaseResults } from '@provenanceio/walletconnect-js/lib/types/BaseResults'
import { getAccountInfo } from '@provenanceio/wallet-utils'
import { TESTNET_GRPC_CLIENT } from './consts'
import {
  Button,
  InformationCards,
  Header,
  Hero,
  Modal,
  QRCodeModal,
} from './components'

export const App = () => {
  ///////////// - Define walletConnect Services and State - /////////////////////
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect()
  const [myBaseAccount, setMyBaseAccount] = useState<any>(null)
  ///////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////
  // State settings for the template applications
  const [modalChildren, setModalChildren] = useState<React.ReactNode>()
  ///////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////
  /* walletConnect Login */
  // This function displays the login modal provided by wcjs
  const handleLogin = () =>
    walletConnectState.address ? wcs.disconnect() : wcs.connect()

  ///////////////////////////////////////////////////////////////////////////////

  // Account info
  const getMyAccount = async () => {
    const { accountNumber } = await getAccountInfo(
      walletConnectState.address,
      TESTNET_GRPC_CLIENT
    )
    setMyBaseAccount(accountNumber)
  }

  useEffect(() => {
    if (walletConnectState.address) {
      getMyAccount()
    }
    // Only want to repull if the address changes
    // eslint-disable-next-line
  }, [walletConnectState.address])

  console.log({ myBaseAccount })

  ///////////////////////- Template Components - ////////////////////////////////
  // Modal state
  const [showModal, setShowModal] = useState(false)

  // Set initial state to login
  useEffect(() => {
    if (!walletConnectState.address) {
      // Login Modal Prompt
      const LoginPrompt = (
        <>
          <div>Please connect to test walletconnect-js actions</div>
          <Button
            onClick={() => {
              setShowModal(false)
              handleLogin()
            }}
          >
            Connect
          </Button>
        </>
      )
      setModalChildren(LoginPrompt)
    }
  }, [walletConnectState.address]) // eslint-disable-line react-hooks/exhaustive-deps
  // Success Message
  const SuccessMessage = ({ msgType }: { msgType: string }) => (
    <div>{msgType} was successful!</div>
  )
  // Failure Message
  const FailureMessage = ({
    msgType,
    error,
  }: {
    msgType: string
    error: string
  }) => (
    <>
      <div>{msgType} failed!</div>
      <div>Error: {error}</div>
    </>
  )
  ///////////////////////////////////////////////////////////////////////////////

  ////////////////////- WINDOW_MESSAGES Listeners - /////////////////////////////
  useEffect(() => {
    // Success message for transaction messages (aka Send Hash)
    const transactionSuccess = (result: BroadcastResults) => {
      console.log(`WalletConnectJS | Complete | Result: `, result)
      setModalChildren(SuccessMessage({ msgType: 'Transaction' }))
    }
    wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, transactionSuccess)

    // Fail message for transaction messages
    const transactionFailure = (result: BroadcastResults) => {
      // Error messages will occur on results that have issues, which
      // are returned as type BaseResults
      const { error } = result as BaseResults
      console.log(`WalletConnectJS | Failed | result, error: `, result, error)
      setModalChildren(
        FailureMessage({ msgType: 'Transaction', error: String(error) })
      )
    }
    wcs.addListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, transactionFailure)

    // Remove event listeners when no longer needed
    return () => {
      wcs.removeListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, transactionSuccess)
      wcs.removeListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, transactionFailure)
      wcs.removeAllListeners()
    }
  })
  ///////////////////////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-gray-800 font-sans">
      <Header handleLogin={handleLogin} />

      <Hero />

      <InformationCards
        setModalChildren={setModalChildren}
        setShowModal={setShowModal}
        showModal={showModal}
      />

      <Modal
        children={modalChildren}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <QRCodeModal />
    </div>
  )
}
