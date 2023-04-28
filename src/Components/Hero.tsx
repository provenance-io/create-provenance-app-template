import logo from '../logo.svg'

export const Hero = () => (
  <section className="grid justify-items-center gap-10 px-5 pt-40 text-2vmin text-gray-100">
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
      Select the items below to send your first transactions to the Provenance
      Blockchain
    </p>
    <a
      className="text-primary-500"
      href="https://explorer.provenance.io"
      target="_blank"
      rel="noopener noreferrer"
    >
      Explore Provenance Blockchain
    </a>
  </section>
)
