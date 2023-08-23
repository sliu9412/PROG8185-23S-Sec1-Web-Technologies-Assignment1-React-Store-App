import { createContext, useState } from "react";
import { LoadLocalAccountInfo } from "./AccountComp";
import { GetProductByID, IProduct } from "../Utils/products.data";

// User's Prodcuct Interface
export interface IUserProduct {
  id: number;
  count: number;
}

// Shop interface
export interface ICart {
  uid: number;
  products: IUserProduct[];
}

// Local storage's key
export const local_cart_info_key = "local_cart_info";

// Load Local Storage's Data
const LoadLocalCartInfo = () => {
  // set default anonymous account
  let cart_list: ICart[] = [
    {
      uid: -1,
      products: [],
    },
  ];
  const local_cart_info = localStorage.getItem(local_cart_info_key);
  if (local_cart_info) {
    const account_info_json = JSON.parse(local_cart_info);
    if (account_info_json) {
      cart_list = account_info_json;
    }
  }
  return cart_list;
};

// Save Local Storage's Data
export const SaveLocalCart = (new_cart_state: ICart[]) => {
  localStorage.setItem(local_cart_info_key, JSON.stringify(new_cart_state));
};

// Get current login account from local storage
const GetCurrentAccount = () => {
  const account_list = LoadLocalAccountInfo();
  return account_list.find((account) => account.isLogined);
};

export function CartService() {
  const [cart_state, setCartState] = useState(LoadLocalCartInfo());

  // Get the cart with of the login account
  const GetCurrentUserCart = (new_cart_state: ICart[]) => {
    const logined_account = GetCurrentAccount();
    if (logined_account) {
      return new_cart_state.find((cart) => cart.uid === logined_account.id);
    } else {
      // anonymous cart
      return new_cart_state.find((cart) => cart.uid === -1);
    }
  };

  const SetCurrentUserCartItem = (new_cart_item_state: IUserProduct) => {
    let new_cart_state = [...cart_state];
    let currentCart = GetCurrentUserCart(new_cart_state);
    if (currentCart) {
      const cartItem = currentCart?.products.find(
        (p) => p.id === new_cart_item_state.id
      )!;
      if (cartItem) {
        cartItem.count = new_cart_item_state.count;
        setCartState(new_cart_state);
        SaveLocalCart(new_cart_state);
      }
    }
  };

  const DeleteCurrentUserCartItem = (itemID: number) => {
    let new_cart_state = [...cart_state];
    let currentCart = GetCurrentUserCart(new_cart_state);
    if (currentCart) {
      const arrayIndex = currentCart?.products.findIndex(
        (p) => p.id === itemID
      )!;
      if (arrayIndex > -1) {
        currentCart?.products.splice(arrayIndex, 1);
        setCartState(new_cart_state);
        SaveLocalCart(new_cart_state);
      }
    }
  };

  const GetCurrentUserCartItem = (
    itemID: number,
    instance_cart?: ICart
  ): IProduct => {
    let currentCart = instance_cart;
    if (!instance_cart) {
      currentCart = GetCurrentUserCart([...cart_state]);
    }
    if (currentCart) {
      const cartItem = currentCart?.products.find((p) => p.id === itemID)!;
      if (cartItem) {
        let searchProd = GetProductByID(cartItem.id);
        if (searchProd) {
          return {
            count: cartItem.count,
            id: cartItem.id,
            img: searchProd.img,
            name: searchProd.name,
            price: searchProd.price,
          };
        }
      }
    }
    return {
      count: 0,
      id: -1,
      img: "",
      name: "",
      price: 0,
    };
  };

  return {
    cart_state,
    setCartState,
    GetCurrentUserCart,
    SetCurrentUserCartItem,
    DeleteCurrentUserCartItem,
    GetCurrentUserCartItem,
  };
}

export interface ICartService {
  cart_state: ICart[];
  setCartState: React.Dispatch<React.SetStateAction<ICart[]>>;
  GetCurrentUserCart: (new_cart_state: ICart[]) => ICart | undefined;
  SetCurrentUserCartItem: (new_cart_item_state: IUserProduct) => void;
  DeleteCurrentUserCartItem: (itemID: number) => void;
  GetCurrentUserCartItem: (itemID: number, instance_cart?: ICart) => IProduct;
}

export const CartContext = createContext<ICartService | null>(null);
