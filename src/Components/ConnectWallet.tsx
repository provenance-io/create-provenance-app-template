import { useState } from 'react'
import { useWalletConnect } from '@provenanceio/walletconnect-js'
import clsx from 'clsx'
import { Button } from './Component'
import { enableChain, getAccount, suggestChain } from '../utils/keplrWallet'
import { Key } from '@keplr-wallet/types'

const listItemClassName =
  'rounded first:rounded-b-none last:rounded-t-none hover:bg-primary-300 hover:text-white'
const buttonClassName = `block w-full whitespace-nowrap px-4 py-2 text-left text-black`

export const ConnectWallet = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [keplrAccount, setKeplrAccount] = useState<Key | undefined>()
  const { walletConnectService: wcs, walletConnectState } = useWalletConnect()

  const handleProvenance = () => {
    walletConnectState.address ? wcs.disconnect() : wcs.connect()
    setIsOpen(false)
  }

  const handleKeplr = async () => {
    await suggestChain()
    await enableChain()
    const account = await getAccount()
    setKeplrAccount(account)
    setIsOpen(false)
  }

  const handleClick = () => {
    if (walletConnectState.address) return wcs.disconnect()
    else if (keplrAccount?.bech32Address) return setKeplrAccount(undefined)
    setIsOpen((o) => !o)
  }

  return (
    <div className="flex items-center gap-2.5 px-5">
      {/* Header Login Info */}
      {(walletConnectState?.address || keplrAccount?.bech32Address) && (
        <div className="text-xs">
          Logged in as{' '}
          <a
            className="text-primary-500"
            href={`${
              process.env.NODE_ENV === 'production'
                ? 'https://explorer.provenance.io'
                : 'https://explorer.test.provenance.io'
            }/accounts/${
              walletConnectState?.address || keplrAccount?.bech32Address
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {walletConnectState?.address || keplrAccount?.bech32Address}
          </a>
        </div>
      )}
      {/* Header Login Button */}
      <div className="relative">
        <Button onClick={handleClick}>
          {walletConnectState.address || keplrAccount?.bech32Address
            ? 'Disconnect'
            : 'Connect'}
        </Button>
        <ul
          className={clsx(
            `
          absolute top-12 right-0 rounded bg-slate-200
        `,
            { block: isOpen, hidden: !isOpen }
          )}
        >
          <li className={listItemClassName}>
            <button className={buttonClassName} onClick={handleProvenance}>
              Provenance Blockchain Wallet
            </button>
          </li>
          <li className={listItemClassName}>
            <button className={buttonClassName} onClick={handleKeplr}>
              Keplr
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
