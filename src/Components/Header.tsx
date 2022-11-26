import { useWalletConnect } from '@provenanceio/walletconnect-js'
import logo from '../logo.svg'
import { Button } from './Component'

interface HeaderProps {
  handleLogin: () => void
}

export const Header = ({ handleLogin }: HeaderProps) => {
  const { walletConnectState } = useWalletConnect()
  return (
    <header className="fixed top-0 z-10 flex w-full items-center justify-between bg-gray-900 py-5 text-gray-100">
      {/* Header Logo and Title Component */}
      <div className="flex items-center gap-2.5 px-5 font-bold">
        <img src={logo} className="h-8" alt="logo" />
        Provenance Blockchain Example Application
      </div>
      {/* Header Login Component */}
      <div className="flex items-center gap-2.5 px-5">
        {/* Header Login Info */}
        {walletConnectState.address && (
          <div className="text-xs">
            Logged in as{' '}
            <a
              className="text-primary-500"
              href={`${
                process.env.NODE_ENV === 'production'
                  ? 'https://explorer.provenance.io'
                  : 'https://explorer.test.provenance.io'
              }/accounts/${walletConnectState.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {walletConnectState.address}
            </a>
          </div>
        )}
        {/* Header Login Button */}
        <Button onClick={handleLogin}>
          {walletConnectState.address ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
    </header>
  )
}
