// This page lets users get an overall view of their 
// shopping cart and change item quantities before finalizing their purchase.

import { useContext, useState } from 'react';
import { IProduct } from '../Utils/products.data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { CartContext, ICartService } from '../Components/CartComp';
import { AccountContext, IAccountService } from "../Components/AccountComp";
import { AlertContext, IAlertContext } from "../Components/AlertComp";

const formatNumber = (num: number) => {
  return (Math.round(num * 100) / 100).toFixed(2)
}

function ShoppingCartItem(props: { itemID: number, cartStatus: number }) {
  const {
    SetCurrentUserCartItem,
    DeleteCurrentUserCartItem,
    GetCurrentUserCartItem,
  } = useContext(CartContext) as ICartService;

  const item = GetCurrentUserCartItem(props.itemID);

  const handleClickAddItem = () => {
    item.count++;
    SetCurrentUserCartItem(item);
  };

  const handleClickRemoveItem = () => {
    DeleteCurrentUserCartItem(item.id);
  };

  const handleClickDeleteItem = () => {
    if (item.count > 1) {
      item.count--;
      SetCurrentUserCartItem(item)
    }
  };

  if (props.cartStatus == 1) {
    return (
          <div className="row">
            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
              <div className="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                <img src={item.img}
                  className="w-100" alt={item.name} />
                <a href="#!">
                  <div className="mask" style={{ backgroundColor: 'rgba(251, 251, 251, 0.2)' }}></div>
                </a>
              </div>
            </div>

            <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
              <p><strong>{item.name}</strong></p>
              <button type="button" className="btn btn-primary btn-sm me-1 mb-2" data-mdb-toggle="tooltip"
                title="Remove item" onClick={handleClickRemoveItem}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button type="button" className="btn btn-danger btn-sm mb-2" data-mdb-toggle="tooltip"
                title="Move to the wish list">
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>

            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <div className="d-flex mb-4" style={{ maxWidth: '300px' }}>
                <button className="btn btn-primary px-3 me-2"
                  onClick={handleClickDeleteItem}>
                <FontAwesomeIcon icon={faMinus} />
                </button>

                <div className="form-outline">
                  <input id="form1" min="0" name="quantity" value={item.count} type="number" className="form-control" />
                  <label className="form-label">Quantity</label>
                </div>

                <button className="btn btn-primary px-3 ms-2"
                  onClick={handleClickAddItem}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <p className="text-start text-md-center">
                <strong>${formatNumber(item.price * item.count)}</strong>
              </p>
            </div>
            <hr className="my-4" />
          </div>);
  }

  return (
        <div className="row">
          <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
            <div className="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
              <img src={item.img}
                className="w-100" alt={item.name} />
              <a href="#!">
                <div className="mask" style={{ backgroundColor: 'rgba(251, 251, 251, 0.2)' }}></div>
              </a>
            </div>
          </div>

          <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
            <p><strong>{item.name}</strong></p>
          </div>

          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <div className="d-flex mb-4" style={{ maxWidth: '300px' }}>

              <div className="form-outline">
                <label className="form-control">{item.count}</label>
                <label className="form-label">Quantity</label>
              </div>
            </div>
            <p className="text-start text-md-center">
              <strong>${formatNumber(item.price * item.count)}</strong>
            </p>
          </div>
          <hr className="my-4" />
        </div>);
}

function ShoppingCart() {
  const [cartStatus, setCartStatus] = useState(1);
  // Cart Items Context
  const {
    cart_state,
    setCartState,
    GetCurrentUserCart,
    GetCurrentUserCartItem,
  } = useContext(CartContext) as ICartService;

  // Current User Context
  const { GetCurrentAccount } = useContext(AccountContext) as IAccountService;

  // Alert Message Function in Context
  const { PushAlert } = useContext(AlertContext) as IAlertContext;

  const handleCancelClick = () => {
    setCartStatus(1);
  }

  const handleBuyClick = () => {
    const current_cart = GetCurrentUserCart([...cart_state]);
    if (!current_cart?.products || current_cart.products.length === 0) {
      PushAlert(
        "You don't have any products on your shopping cart.",
        "danger"
      );
      return;
    }
    
    if (cartStatus === 1) {
      setCartStatus(2);
      PushAlert(
        "Do you confirm your purchased items?",
        "warning"
      );
      return;
    }

    if (cartStatus === 2) {
      setCartStatus(3);
      PushAlert(
        "Your purchase is done! Check your email!",
        "success",
        () => {
          setCartState([]);
        }
      );
    }
  }

  const new_cart_state = [...cart_state];
  let address = '';
  let current_cart = GetCurrentUserCart(new_cart_state);

  const current_account = GetCurrentAccount();
  // if user does not have cart, generate new one
  if (current_account) {
    if (current_account.address) {
      address = `${current_account.address.city}, ${current_account.address.province}, ${current_account.address.zipcode}`;
    }
  }

  if (!current_cart) {
    // if user does not have cart, generate new one
    if (current_account) {
      current_cart = {
        uid: current_account.id,
        products: [],
      };
      new_cart_state.push(current_cart);
    } else {
      // anonymous cart
      current_cart = new_cart_state.find((cart) => cart.uid === -1);
    }
  }

  let productsCart: IProduct[] = [];
  let totalAmount = 0;
  let totalAmountTaxes = 0;
  let totalCartElements = 0;
  if (current_cart?.products) {
    totalCartElements = current_cart?.products.length;
    current_cart?.products.forEach(itemCart => {
      let searchProd = GetCurrentUserCartItem(itemCart.id);
      if (searchProd) {
        productsCart.push(searchProd);
        totalAmount += (searchProd.price * itemCart.count);
      }
    });
    totalAmountTaxes = totalAmount * 1.13;
  }
  
  return (
    <section className="h-100 gradient-custom">
    <div className="container py-5">
      <div className="row d-flex justify-content-center my-4">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header py-3">
              <h5 className="mb-0">Cart - {totalCartElements} items {cartStatus === 3 ? 'PURCHASED' : ''}</h5>
            </div>
            <div className="card-body">
              
            { productsCart.map(p => (
              <ShoppingCartItem
                itemID={p.id}
                key={p.id}
                cartStatus={cartStatus}
              />
            )) }

            </div>
          </div>
          
          <div className="card mb-4 mb-lg-0">
            <div className="card-body">
              <p><strong>We accept</strong></p>
              <img className="me-2" width="45px"
                src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                alt="Visa" />
              <img className="me-2" width="45px"
                src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
                alt="American Express" />
              <img className="me-2" width="45px"
                src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                alt="Mastercard" />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header py-3">
              <h5 className="mb-0">Summary</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li
                  className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  Products
                  <span>${formatNumber(totalAmount)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  Shipping Address
                  <span>{address}</span>
                </li>
                <li
                  className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                  <div>
                    <strong>Total amount</strong>
                    <strong>
                      <p className="mb-0">(including TAXES)</p>
                    </strong>
                  </div>
                  <span><strong>${formatNumber(totalAmountTaxes)}</strong></span>
                </li>
              </ul>
              
              {
                cartStatus !== 3 ? 
                <button type="button" 
                  onClick={handleBuyClick}
                  className="btn btn-primary btn-lg btn-block">
                  {cartStatus === 1 ? 'Confirm' : 'Buy'}
                </button>
                :
                  <></>
              }

              {
                cartStatus === 2 ?
                <button type="button" 
                  onClick={handleCancelClick}
                  className="btn btn-danger btn-lg btn-block">
                  Cancel
                </button>
                :
                <></>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}

export default ShoppingCart