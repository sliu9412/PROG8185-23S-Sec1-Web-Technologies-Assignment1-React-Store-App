import { Routes, Route, Navigate } from "react-router-dom";
import "./App.scss";
import HeaderComp from "./Components/HeaderComp";
import AccountEditing from "./Pages/AccountEditing";
import CommentsPage from "./Pages/CommentsPage";
import ProductDisplay from "./Pages/ProductDisplay";
import ShoppingCart from "./Pages/ShoppingCart";
import LoginPage from "./Pages/LoginPage";
import { AccountContext, AccountService } from "./Components/AccountComp";
import AlertComp, { AlertContext } from "./Components/AlertComp";
import LayoutComp from "./Components/LayoutComp";
import { CartContext, CartService } from "./Components/CartComp";

function App() {
  // Account Services
  const {
    account_state,
    setAccountState,
    HasLoginedAccount,
    GetCurrentAccount,
    GetCurrentAccountIndex,
    HasDuplicatedUsername,
  } = AccountService();
  // Alert Global Component
  const { PushAlert, AlertCode } = AlertComp();
  // Cart Serivce
  const { cart_state,
    setCartState,
    DeleteCurrentUserCartItem,
    GetCurrentUserCartItem,
    SetCurrentUserCartItem,
    GetCurrentUserCart
  } = CartService();

  return (
    <>
      <AlertContext.Provider value={{ AlertCode, PushAlert }}>
        <AccountContext.Provider
          value={{
            account_state,
            setAccountState,
            HasLoginedAccount,
            GetCurrentAccount,
            GetCurrentAccountIndex,
            HasDuplicatedUsername,
          }}
        >
          <CartContext.Provider
            value={{ 
              cart_state, 
              setCartState,
              GetCurrentUserCart,
              SetCurrentUserCartItem,
              DeleteCurrentUserCartItem,
              GetCurrentUserCartItem }}
          >
            {AlertCode()}
            <HeaderComp />
            <main>
              <Routes>
                <Route path="/" element={<ProductDisplay />} />
                <Route path="/ShoppingCart" element={<ShoppingCart />} />
                <Route path="/AccountEditing" element={<AccountEditing />} />
                <Route path="/CommentsPage" element={<CommentsPage />} />
                <Route
                  path="/Login"
                  element={
                    HasLoginedAccount() ? (
                      <Navigate to="/AccountEditing" />
                    ) : (
                      <LoginPage />
                    )
                  }
                />
                <Route
                  path="*"
                  element={
                    <LayoutComp>
                      <p>Sorry, this link is invalid</p>
                    </LayoutComp>
                  }
                />
              </Routes>
            </main>
          </CartContext.Provider>
        </AccountContext.Provider>
      </AlertContext.Provider>
    </>
  );
}

export default App;
