import { AllHTMLAttributes } from "react";

export interface ErrorBoxProps extends AllHTMLAttributes<HTMLDivElement> {
  errorMessage: string;
  otherClassName: string;
  setErrorMessage: (message: string | null) => void;
}

export const ErrorBox = ({
  errorMessage,
  otherClassName,
  setErrorMessage,
}: ErrorBoxProps) => {
  return (
    <div
      className={`position-fixed top-0 start-50 translate-middle-x mt-3 zindex-tooltip ${otherClassName}`}
      style={{ zIndex: 9999 }}
    >
      <div
        className="alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        {errorMessage}
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => setErrorMessage(null)}
        ></button>
      </div>
    </div>
  );
};
