import {
  QRCodeModal as WcjsModal,
  useWalletConnect,
} from '@provenanceio/walletconnect-js'

export const QRCodeModal = () => {
  const { walletConnectService: wcs } = useWalletConnect()
  return (
    <div
      className={`
          [&>div>div>p]:font-sans
          [&>div>div>p]:text-sm
          [&>div>div]:grid [&>div>div]:place-items-center [&>div>div]:gap-2
          [&>div>div>.wcjs-qr-row-nonlink]:grid [&>div>div>.wcjs-qr-row-nonlink]:w-full
          [&>div>div>.wcjs-qr-row-nonlink]:grid-cols-[30px_1fr] [&>div>div>.wcjs-qr-row-nonlink]:gap-4 [&>div>div>.wcjs-qr-appicons]:grid [&>div>div>.wcjs-qr-appicons]:grid-cols-2
          [&>div>div>div>.wcjs-qr-title]:text-sm  [&>div>div>.wcjs-qr-close]:bg-transparent
        `}
    >
      <WcjsModal
        walletConnectService={wcs}
        title="Scan the QRCode with your mobile Provenance Blockchain Wallet."
        devWallets={['figure_web', 'provenance_extension', 'provenance_mobile']}
      />
    </div>
  )
}
