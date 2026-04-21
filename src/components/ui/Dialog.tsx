import "./Dialog.css";

interface DialogProps {
  isOpen: boolean;
  type: "alert" | "confirm";
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const Dialog = ({ isOpen, type, message, onClose, onConfirm }: DialogProps) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <div className="dialog-overlay" onClick={type === "alert" ? onClose : undefined}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className={`dialog-icon-wrap ${type === "confirm" ? "dialog-icon-warn" : "dialog-icon-info"}`}>
          {type === "confirm" ? (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          ) : (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          {type === "confirm" && (
            <button className="dialog-btn dialog-btn-cancel" onClick={onClose}>
              Cancel
            </button>
          )}
          <button
            className={`dialog-btn ${type === "confirm" ? "dialog-btn-danger" : "dialog-btn-ok"}`}
            onClick={handleConfirm}
          >
            {type === "confirm" ? "Delete" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
