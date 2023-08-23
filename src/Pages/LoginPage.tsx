import { FormEvent, useContext, useRef } from "react";
import LayoutComp from "../Components/LayoutComp";
import { FormGroup, Label, Input, Button } from "reactstrap";
import {
  AccountContext,
  IAccountService,
  SaveLocalStorage,
} from "../Components/AccountComp";
import { AlertContext, IAlertContext } from "../Components/AlertComp";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const LoginFormRef = useRef<HTMLFormElement>(null);
  // Load state of Service
  const { account_state, setAccountState } = useContext(
    AccountContext
  ) as IAccountService;
  const navigate = useNavigate();

  // Alert Message Function in Context
  const { PushAlert } = useContext(AlertContext) as IAlertContext;

  // Compare the Input Value with Local Storage Accounts
  const LoginSubmitHandler = (element: FormEvent<HTMLFormElement>) => {
    element.preventDefault();
    if (LoginFormRef.current) {
      const form_data = new FormData(LoginFormRef.current);
      const new_account_state = [...account_state];
      const logined_account_index = new_account_state.findIndex(
        (account) =>
          account.username === form_data.get("username") &&
          account.password === form_data.get("password")
      );
      if (logined_account_index >= 0) {
        new_account_state.forEach((account) => {
          account.isLogined = false;
        });
        new_account_state[logined_account_index].isLogined = true;
        setAccountState(new_account_state);
        SaveLocalStorage(new_account_state);
        PushAlert("Login Successfully!", "success");
        navigate("/");
      } else {
        PushAlert(
          "Your username and password cannot match with the record.",
          "danger"
        );
      }
    }
  };

  return (
    <LayoutComp>
      <h2 className="text-center">Login</h2>
      <form
        ref={LoginFormRef}
        onSubmit={(element) => {
          LoginSubmitHandler(element);
        }}
      >
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            name="username"
            id="username"
            placeholder="Please input username"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            name="password"
            id="password"
            placeholder="Please input your password"
            type="password"
            required
          />
        </FormGroup>

        <Button color="primary">Login</Button>
      </form>
    </LayoutComp>
  );
}

export default LoginPage;
