import { useContext, useState } from "react";
import {
  Button,
  Collapse,
  Nav,
  NavItem,
  Navbar,
  NavbarBrand,
  NavbarText,
  NavbarToggler,
} from "reactstrap";
import {
  AccountContext,
  IAccountService,
  SaveLocalStorage,
} from "./AccountComp";
import { useNavigate, Link } from "react-router-dom";

function HeaderComp() {
  const [open_state, ToggleOpenState] = useState(false);
  const {
    account_state,
    setAccountState,
    HasLoginedAccount,
    GetCurrentAccount,
  } = useContext(AccountContext) as IAccountService;
  const navigate = useNavigate();

  // Clear Logged State But Keep Password for Login
  const LogoutHandler = () => {
    if (HasLoginedAccount()) {
      let new_account_state = [...account_state];
      new_account_state.forEach((account) => {
        account.isLogined = false;
      });
      setAccountState(new_account_state);
      SaveLocalStorage(new_account_state);
      window.location.reload();
    }
  };

  // Jump to Login Page
  const LoginHandler = () => {
    navigate("/login");
  };

  return (
    <Navbar className="navbar-expand-lg">
      <NavbarBrand>GroupAssignment1</NavbarBrand>
      <NavbarToggler
        onClick={() => {
          ToggleOpenState(!open_state);
        }}
      />
      <Collapse isOpen={open_state} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link to="/" className="nav-link">
              Products
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/ShoppingCart" className="nav-link">
              Shopping Cart
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/AccountEditing" className="nav-link">
              Account Editing
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/CommentsPage" className="nav-link">
              Comments Page
            </Link>
          </NavItem>
        </Nav>
        {GetCurrentAccount()?.isLogined ? (
          <>
            <NavbarText className="me-2">
              Welcome, {GetCurrentAccount()?.username}
            </NavbarText>
            <Button color="danger" onClick={LogoutHandler}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="success" onClick={LoginHandler}>
            Login
          </Button>
        )}
      </Collapse>
    </Navbar>
  );
}

export default HeaderComp;
