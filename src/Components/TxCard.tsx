interface TxCardProps {
  title?: string;
  onClick?: () => void;
}

export const TxCard = ({ title = "Example", onClick }: TxCardProps) => (
  <div className="Individual-Card" onClick={onClick}>
    <div className="Individual-Card-Content">{title}</div>
  </div>
);
