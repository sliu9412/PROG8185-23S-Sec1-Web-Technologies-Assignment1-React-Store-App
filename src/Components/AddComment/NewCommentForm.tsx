import {
  FormEvent,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { IComment } from "../../Utils/comments.data";
import { ICart } from "../CartComp";
import { Products } from "../../Utils/products.data";
import { AlertContext, IAlertContext } from "../AlertComp";
import { LoadLocalComment, SaveLocalComment } from "./LocalStorageHander";

interface NewCommentFormProps {
  user_cart: ICart;
}

function NewCommentForm(props: NewCommentFormProps) {
  const { PushAlert } = useContext(AlertContext) as IAlertContext;
  // form elements
  const formRef = useRef<HTMLFormElement>(null);
  // select elements
  const purchased_item_select = useRef<HTMLInputElement>(null);
  // props deconstruct
  const { user_cart } = props;

  // state of displaying image
  const [product_img, SetProductImage] = useState("");

  // Form Submit to Save Comment
  const FormSubmitHandler = (element: FormEvent<HTMLFormElement>) => {
    element.preventDefault();
    const form_data = new FormData(formRef.current as HTMLFormElement);
    const local_comment = LoadLocalComment();
    const new_comment: IComment = {
      uid: user_cart?.uid as number,
      pid: parseInt(form_data.get("product-id") as string),
      content: form_data.get("content") as string,
    };
    local_comment.splice(0, 0, new_comment);
    SaveLocalComment(local_comment);
    PushAlert("Add comment successfully", "success");
    (document.querySelector("#comment-content") as HTMLInputElement).value = "";
  };

  // change product image if the option is changed
  const ChangeProductImg = () => {
    const current_product_id_string = purchased_item_select.current
      ?.value as string;
    const current_product_id = parseInt(current_product_id_string);
    SetProductImage(
      Products.find((product) => product.id === current_product_id)
        ?.img as string
    );
  };

  // Get Product form mock data
  const GetProductById = (id: number) => {
    return Products.find((product) => product.id === id);
  };

  useEffect(() => {
    ChangeProductImg();
  });

  return (
    <>
      <h2 className="text-center mt-5">Add New Comment</h2>
      <form
        ref={formRef}
        onSubmit={(element) => {
          FormSubmitHandler(element);
        }}
      >
        <div>
          <FormGroup>
            <Label for="select-product">Select a pruchased product</Label>
            <Input
              innerRef={purchased_item_select}
              name="product-id"
              id="select-product"
              type="select"
              onChange={ChangeProductImg}
            >
              {user_cart.products.map((product) => {
                if (product.count > 0) {
                  return (
                    <option key={product.id} value={product.id}>
                      {GetProductById(product.id)?.name}
                    </option>
                  );
                } else {
                  return <Fragment key={product.id}></Fragment>;
                }
              })}
            </Input>
          </FormGroup>
          <p>Product Image</p>
          <img className="img-fluid" src={product_img} alt="purchase product" />
        </div>
        <div>
          <FormGroup>
            <Label for="comment-content">Comment Content</Label>
            <Input
              id="comment-content"
              name="content"
              type="textarea"
              rows="4"
              required
            />
            <div className="mt-3 text-center">
              <Button color="danger">Submit Comment</Button>
            </div>
          </FormGroup>
        </div>
      </form>
    </>
  );
}

export default NewCommentForm;
