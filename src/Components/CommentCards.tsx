import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import { IComment } from "../Utils/comments.data";
import { useContext } from "react";
import { AccountContext, IAccountService } from "./AccountComp";
import { Products } from "../Utils/products.data";

export interface CommentCardsProps {
  comments: IComment[];
  isMocked?: boolean;
}

function CommentCards(props: CommentCardsProps) {
  const { comments, isMocked } = props;
  const { GetCurrentAccount } = useContext(AccountContext) as IAccountService;
  const loggined_account = GetCurrentAccount();

  return (
    <>
      {comments.length > 0 ? (
        // If comment is not empty
        comments.map((comment, index) => {
          const { pid, name, content } = comment;
          const username = loggined_account ? loggined_account.username : name;
          const product_name = Products.find(
            (product) => product.id === pid
          )?.name;
          const img = Products.find((product) => product.id === pid)?.img;

          return (
            <Card key={index} className="my-3">
              <Row>
                <Col sm={12} lg={3}>
                  <img
                    className="img-fluid"
                    alt={`${username}'s comment`}
                    src={img}
                  />
                </Col>
                <Col sm={12} lg={9} className="d-flex align-items-center">
                  <CardBody>
                    <CardText>{content}</CardText>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                      {product_name}
                    </CardSubtitle>
                    <CardTitle tag="h5">{isMocked ? name : username}</CardTitle>
                  </CardBody>
                </Col>
              </Row>
            </Card>
          );
        })
      ) : (
        // If comment is empty
        <p className="text-secondary text-center">
          You don't have previous comments yet
        </p>
      )}
    </>
  );
}

export default CommentCards;
