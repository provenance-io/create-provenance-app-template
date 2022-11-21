interface ModalProps {
  children: React.ReactNode;
  setShowModal: (arg: boolean) => void;
  showModal: boolean;
}

export const Modal = ({ children, setShowModal, showModal }: ModalProps) => {
  return (
    <div className="Modal">
      <div className="Modal-Card">
        <div className="Modal-Exit" onClick={() => setShowModal(!showModal)}>
          <svg
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            height="1.4rem"
          >
            <path d="M8.99984 1L5.09375 5L8.99984 9" />
            <path d="M1.00016 1L4.90625 5L1.00016 9" />
          </svg>
        </div>
        {children}
        <button
          className="Button-Cancel"
          onClick={() => setShowModal(!showModal)}
        >
          Exit
        </button>
      </div>
    </div>
  );
};
