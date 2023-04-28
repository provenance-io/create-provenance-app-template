import logo from '../logo.svg'
import { ConnectWallet } from './ConnectWallet'

export const Header = () => (
  <header className="fixed top-0 z-10 flex w-full items-center justify-between bg-gray-900 py-5 text-gray-100">
    {/* Header Logo and Title Component */}
    <div className="flex items-center gap-2.5 px-5 font-bold">
      <img src={logo} className="h-8" alt="logo" />
      Provenance Blockchain Example Application
    </div>
    {/* Header Login Component */}
    <ConnectWallet />
  </header>
)
