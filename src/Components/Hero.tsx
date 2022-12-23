import logo from '../logo.svg'
import { useNavigate } from 'react-router-dom'

export const Hero = ({
  title,
}: {
  title?: string
}) => {
  const navigate = useNavigate()
  return (
    <section className="grid justify-items-center gap-10 pt-40 text-2vmin text-gray-100">
      <div className="grid grid-cols-4 gap-2.5">
        <img src={logo} className="h-40 rotate-180" alt="logo" />
        <div className="grid grid-cols-1">
          <img
            src={logo}
            className="col-span-1 col-start-1 row-span-1 row-start-1 h-40"
            alt="logo"
          />
          <img
            src={logo}
            className="flip-y col-span-1 col-start-1 row-span-1 row-start-1 -ml-[5px] h-40"
            alt="logo"
          />
        </div>
        <img src={logo} className="h-40" alt="logo" />
        <img src={logo} className="h-40" alt="logo" />
      </div>
      <p>
        {title ||
          `Select the items below to send your first transactions to the Provenance
      Blockchain`}
      </p>
      {title ? (
        <div
          className="cursor-pointer text-primary-500"
          onClick={() => navigate('/')}
        >
          Go back to home page
        </div>
      ) : (
        <a
          className="text-primary-500"
          href="https://explorer.provenance.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Provenance Blockchain
        </a>
      )}
    </section>
  )
}
