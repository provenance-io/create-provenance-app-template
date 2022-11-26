interface TxCardProps {
  title?: string
  onClick?: () => void
}

export const TxCard = ({ title = 'Example', onClick }: TxCardProps) => (
  <div
    className={`
      grid cursor-pointer place-content-center
      rounded border-y-8 border-solid border-transparent
      bg-slate-700 p-5 text-2vmin text-gray-100 shadow-md
      transition-all duration-300
      hover:border-t-primary-500 hover:shadow-xl active:border-t-primary-300
    `}
    onClick={onClick}
  >
    <div className="grid place-content-center">{title}</div>
  </div>
)
