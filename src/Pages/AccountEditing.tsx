// An account creation/editing page where the user can create a new account or modify current details.
// This page should at least collect/update the user's shipping address.
// Other optional behavior could include password change.
// Optionally, account creation should be at the discretion of the user, so they may purchase anonymously.

import { useRef, useEffect, FormEvent, useContext } from "react";
import LayoutComp from "../Components/LayoutComp";
import { Button, FormGroup, Input, Label } from "reactstrap";
import {
  AccountContext,
  IAccountInfo,
  IAccountService,
  SaveLocalStorage,
} from "../Components/AccountComp";
import { AlertContext, IAlertContext } from "../Components/AlertComp";

function AccountEditing() {
  // Form Element's reference
  const RegisterFormRef = useRef<HTMLFormElement>(null);
  // Load state of Service
  const {
    account_state,
    setAccountState,
    HasLoginedAccount,
    GetCurrentAccount,
    GetCurrentAccountIndex,
    HasDuplicatedUsername,
  } = useContext(AccountContext) as IAccountService;
  // import PushAlert
  const { PushAlert } = useContext(AlertContext) as IAlertContext;

  // Data to Store, No Need to Render
  let new_account_info: IAccountInfo = GetCurrentAccount()
    ? (GetCurrentAccount() as IAccountInfo)
    : {
        id: account_state.length,
        username: "",
        password: "",
        address: {
          province: "",
          city: "",
          zipcode: "",
        },
        isLogined: false,
      };

  // Form Change Event Handler
  const ChangeHandler = () => {
    if (RegisterFormRef.current) {
      const form_data = new FormData(RegisterFormRef.current);
      new_account_info = {
        ...new_account_info,
        username: form_data.get("username") as string,
        password: form_data.get("password") as string,
        address: {
          province: form_data.get("province") as string,
          city: form_data.get("city") as string,
          zipcode: form_data.get("zipcode") as string,
        },
        isLogined: false,
      };
    }
  };

  // When Submitting Form, Save Account Info to Local Storage
  const SubmitHandler = (element: FormEvent<HTMLFormElement>) => {
    element.preventDefault();
    let new_account_state = [...account_state];
    if (HasLoginedAccount()) {
      // Update Account
      const Logined_account_index = GetCurrentAccountIndex();
      if (Logined_account_index >= 0) {
        if (
          new_account_info.username !== GetCurrentAccount()?.username &&
          HasDuplicatedUsername(new_account_info.username)
        ) {
          PushAlert("The username has already existed, please use another one");
        } else {
          new_account_info.isLogined = true;
          new_account_state[Logined_account_index] = new_account_info;
          PushAlert("Modify Account Successfully!", "success");
          setAccountState(new_account_state);
          SaveLocalStorage(new_account_state);
        }
      }
    } else {
      // Register Account
      if (HasDuplicatedUsername(new_account_info.username)) {
        PushAlert("The username has already existed, please use another one");
      } else {
        new_account_state.forEach((account) => {
          account.isLogined = false;
        });
        new_account_info.isLogined = true;
        new_account_state.push(new_account_info);
        PushAlert("Register Successfully!", "success");
        setAccountState(new_account_state);
        SaveLocalStorage(new_account_state);
      }
    }
  };

  // Put Local storage data into input fields
  useEffect(() => {
    const logined_account = GetCurrentAccount();
    if (logined_account?.isLogined) {
      (document.querySelector("#username") as HTMLInputElement).value =
        logined_account?.username;
      (document.querySelector("#password") as HTMLInputElement).value =
        logined_account?.password;
      (document.querySelector("#province") as HTMLInputElement).value =
        logined_account?.address.province;
      (document.querySelector("#city") as HTMLInputElement).value =
        logined_account?.address.city;
      (document.querySelector("#zipcode") as HTMLInputElement).value =
        logined_account?.address.zipcode;
    }
  });

  return (
    <LayoutComp>
      <h2 className="text-center">
        {HasLoginedAccount() ? "Modify Account Information" : "Register"}
      </h2>
      <form
        className="form"
        ref={RegisterFormRef}
        onChange={ChangeHandler}
        onSubmit={(element) => {
          SubmitHandler(element);
        }}
      >
        <h3>Personal Information</h3>
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

        <h3>Address Management</h3>
        <FormGroup>
          <Label for="province">Province</Label>
          <Input
            name="province"
            id="province"
            placeholder="Please input the province of your address"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="city">City</Label>
          <Input
            name="city"
            id="city"
            placeholder="Please input the city of your address"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="zipcode">Zipcode</Label>
          <Input
            name="zipcode"
            id="zipcode"
            placeholder="Please input the zipcode of your address"
            required
          />
        </FormGroup>
        <Button color="primary">
          {HasLoginedAccount() ? "Modify" : "Register"}
        </Button>
      </form>
    </LayoutComp>
  );
}

export default AccountEditing;
