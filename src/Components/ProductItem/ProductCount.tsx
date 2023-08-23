import { Button } from "reactstrap";
import {
  CartContext,
  ICart,
  ICartService,
  IUserProduct,
  SaveLocalCart,
} from "../CartComp";
import { useContext, useState } from "react";
import { AccountContext, IAccountService } from "../AccountComp";

interface IProductCountProps {
  id: number;
}

function ProductCount(props: IProductCountProps) {
  const { id } = props;
  const { cart_state, setCartState, GetCurrentUserCart } = useContext(
    CartContext
  ) as ICartService;
  const { GetCurrentAccount } = useContext(AccountContext) as IAccountService;

  // return new instance of the elements of cart
  const GetCartProduct = () => {
    const new_cart_state = [...cart_state];
    let current_cart = GetCurrentUserCart(new_cart_state);
    if (!current_cart) {
      const current_account = GetCurrentAccount();
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
    const cart = current_cart as ICart;
    const product_index = cart.products.findIndex(
      (product) => product.id === id
    );
    let product: IUserProduct | undefined = undefined;
    if (product_index >= 0) {
      product = cart.products[product_index];
    }
    return {
      new_cart_state,
      cart,
      product,
    };
  };

  // Set initial count of product
  const GetInitialCount = () => {
    let { product } = GetCartProduct();
    return product ? product.count : 0;
  };

  // count of current product
  const [count, setCount] = useState(GetInitialCount());

  // Increase the count of current product
  const IncreaseCount = () => {
    let { new_cart_state, cart, product } = GetCartProduct();
    if (product) {
      setCount(product.count + 1);
      product.count++;
    } else {
      setCount(1);
      cart.products.push({
        id,
        count: 1,
      });
    }
    setCartState(new_cart_state);
    SaveLocalCart(new_cart_state);
  };

  // Decrease the count of current product
  const DecreaseCount = () => {
    let { new_cart_state, product } = GetCartProduct();
    if (product) {
      if (product.count - 1 >= 0) {
        setCount(product.count - 1);
        product.count--;
      }
    }
    setCartState(new_cart_state);
    SaveLocalCart(new_cart_state);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Button color="primary" onClick={DecreaseCount}>
        −
      </Button>
      <span className="m-3">{count}</span>
      <Button color="primary" onClick={IncreaseCount}>
        +
      </Button>
    </div>
  );
}

export default ProductCount;
