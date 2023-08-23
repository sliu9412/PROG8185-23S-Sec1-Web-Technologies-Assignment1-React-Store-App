import React, { useState, createContext } from "react";
import { Alert } from "reactstrap";

type IAlertType = "primary" | "success" | "danger" | "warning" | undefined;
let timer: string | number | NodeJS.Timeout | undefined;

function AlertComp() {
  const [message_state, setMessageState] = useState("");
  const [type_state, setTypeState] = useState<IAlertType>(undefined);
  const [open_state, setOpenState] = useState(false);

  const PushAlert = (
    message: string,
    type: IAlertType = "primary",
    callback?: () => void,
    duration: number = 5000,
  ) => {
    clearTimeout(timer);
    setMessageState(message);
    setTypeState(type);
    setOpenState(true);
    timer = setTimeout(() => {
      setOpenState(false);
    }, duration);
  };

  const AlertCode = () => {
    return (
      <Alert
        className="fixed-top"
        isOpen={open_state}
        toggle={() => {
          setOpenState(!open_state);
        }}
        color={type_state}
      >
        {message_state}
      </Alert>
    );
  };

  return {
    PushAlert,
    AlertCode,
  };
}

export default AlertComp;

export interface IAlertContext {
  PushAlert: (message: string, type?: IAlertType, callback?: () => void) => void;
  AlertCode: () => JSX.Element;
}

export const AlertContext = createContext<IAlertContext | null>(null);
