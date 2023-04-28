export const CHAINID_MAINNET = 'pio-mainnet-1' as const
export const CHAINNAME_MAINNET = 'Provenance' as const
export const PREFIX_MAINNET = 'pb' as const
export const MAINNET_WALLET_COIN_TYPE = 505 as const
export const RPC_MAINNET = 'https://rpc.provenance.io' as const
export const REST_MAINNET = 'https://api.provenance.io' as const

export const CHAINID_TESTNET = 'pio-testnet-1' as const
export const CHAINNAME_TESTNET = 'Provenance Testnet' as const
export const PREFIX_TESTNET = 'tp' as const
export const TESTNET_WALLET_COIN_TYPE = 1 as const
export const RPC_TESTNET = 'https://rpc.test.provenance.io' as const
export const REST_TESTNET = 'https://api.test.provenance.io' as const

const currency = {
  coinDenom: 'HASH',
  coinMinimalDenom: 'nhash',
  coinDecimals: 9,
  coinGeckoId: 'provenance-blockchain',
}

const genericDetails = {
  currencies: [currency],
  feeCurrencies: [
    {
      ...currency,
      gasPriceStep: {
        average: 25,
        high: 50,
        low: 12.5,
      },
    },
  ],
  stakeCurrency: currency,
}

const mainnetDetails = {
  chainId: CHAINID_MAINNET,
  chainName: CHAINNAME_MAINNET,
  rpc: RPC_MAINNET,
  rest: REST_MAINNET,
  bip44: {
    coinType: MAINNET_WALLET_COIN_TYPE,
  },
  bech32Config: {
    bech32PrefixAccAddr: `${PREFIX_MAINNET}`,
    bech32PrefixAccPub: `${PREFIX_MAINNET}pub`,
    bech32PrefixValAddr: `${PREFIX_MAINNET}valoper`,
    bech32PrefixValPub: `${PREFIX_MAINNET}valoperpub`,
    bech32PrefixConsAddr: `${PREFIX_MAINNET}valcons`,
    bech32PrefixConsPub: `${PREFIX_MAINNET}valconspub`,
  },
}

const testnetDetails = {
  chainId: CHAINID_TESTNET,
  chainName: CHAINNAME_TESTNET,
  rpc: RPC_TESTNET,
  rest: REST_TESTNET,
  bip44: {
    coinType: TESTNET_WALLET_COIN_TYPE,
  },
  bech32Config: {
    bech32PrefixAccAddr: `${PREFIX_TESTNET}`,
    bech32PrefixAccPub: `${PREFIX_TESTNET}pub`,
    bech32PrefixValAddr: `${PREFIX_TESTNET}valoper`,
    bech32PrefixValPub: `${PREFIX_TESTNET}valoperpub`,
    bech32PrefixConsAddr: `${PREFIX_TESTNET}valcons`,
    bech32PrefixConsPub: `${PREFIX_TESTNET}valconspub`,
  },
}

const chainDetails = {
  ...(process.env.NODE_ENV === 'production' ? mainnetDetails : testnetDetails),
  ...genericDetails,
}

console.log({ chainDetails })

const checkForKeplr = () =>
  new Promise((resolve, reject) => {
    if (!window.keplr) reject('Keplr extension is not installed')
    else resolve('👍🏼')
  })

const handleNoKeplr = (err: Error) => {
  if (err.message.includes('Keplr extension')) {
    window.open(
      'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap'
    )
  }
}

export const signAndBroadcast = async () => {}

export const getAccount = async () => {
  try {
    checkForKeplr()
    return await window.keplr?.getKey(chainDetails.chainId)
  } catch (err) {
    handleNoKeplr(err as Error)
  }
}

export const enableChain = async () => {
  try {
    checkForKeplr()
    await window.keplr?.enable(chainDetails.chainId)
    console.log('enabled')
  } catch (err) {
    handleNoKeplr(err as Error)
  }
}

export const suggestChain = async () => {
  try {
    checkForKeplr()
    await window.keplr?.experimentalSuggestChain(chainDetails)
  } catch (err) {
    handleNoKeplr(err as Error)
  }
}
