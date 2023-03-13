import './polyfills'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { WalletConnectContextProvider } from '@provenanceio/walletconnect-js'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { Page } from './Components'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Page />} />
      <Route
        path="groups"
        element={
          <Page type="groups" title="Select group actions and queries below" />
        }
      />
      <Route
        path="contracts"
        element={
          <Page type="contracts" title="Select contract actions and queries below" />
        }
      />
      {/* ... etc. */}
    </>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <WalletConnectContextProvider
      // @ts-ignore TO-DO: Figure out this issue?
      network={process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet'}
    >
      <RouterProvider router={router} />
    </WalletConnectContextProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
