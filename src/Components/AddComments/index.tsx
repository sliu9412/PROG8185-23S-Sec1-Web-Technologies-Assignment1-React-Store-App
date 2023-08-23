import { useContext } from "react";
import { CartContext, ICartService } from "../CartComp";
import NewCommentForm from "./NewCommentForm";
import { Col, Row } from "reactstrap";
import CommentCards from "../CommentCards";
import { LoadLocalComment } from "./LocalStorageHander";

function AddComment() {
  const { cart_state, GetCurrentUserCart } = useContext(
    CartContext
  ) as ICartService;
  const user_cart = GetCurrentUserCart([...cart_state]);

  const GetPreviousComments = () => {
    const local_comment = LoadLocalComment();
    return local_comment.filter((comment) => comment.uid === user_cart?.uid);
  };

  if (user_cart?.products.some((product) => product.count > 0)) {
    return (
      <Row>
        <Col sm={12} lg={4}>
          <NewCommentForm user_cart={user_cart} />
        </Col>
        <Col sm={12} lg={8}>
          <h2 className="text-center mt-5">Provious Comments</h2>
          <CommentCards comments={GetPreviousComments()} />
        </Col>
      </Row>
    );
  }
  // If logged user does not have any purchased product
  return (
    <div className="text-center my-5">
      <h2 className="text-secondary">
        Sorry, you don't have product to comment now
      </h2>
      <p className="text-secondary">Only purchased product can be commented</p>
    </div>
  );
}

export default AddComment;
