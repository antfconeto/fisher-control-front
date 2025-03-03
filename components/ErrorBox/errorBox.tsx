import { AllHTMLAttributes } from "react";


export interface ErrorBoxProps extends AllHTMLAttributes<HTMLDivElement>{
    errorMessage: string;
    errorStatus?:number;
    otherClassName:string;
    setErrorMessage: (message: any) => void;
}

export const ErrorBox = ({ errorMessage, errorStatus, otherClassName, setErrorMessage, ...props }: ErrorBoxProps) => {
    return (
        <div className={`position-fixed top-0 start-50 translate-middle-x mt-3 zindex-tooltip ${otherClassName}`}>
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
}