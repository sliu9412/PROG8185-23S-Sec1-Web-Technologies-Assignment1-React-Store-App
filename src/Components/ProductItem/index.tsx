import {
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
} from "reactstrap";
import "./style.scss";
import ProductCount from "./ProductCount";

interface IProductItem {
  id: number;
  name: string;
  price: number;
  img: string;
}

function ProductItem(props: IProductItem) {
  const { id, name, price, img } = props;

  return (
    <Col sm={12} lg={4}>
      <Card className="ProductItem my-3">
        <div
          className="img-container"
          style={{ backgroundImage: `url(${img})` }}
          title={name}
        ></div>
        <CardBody>
          <CardTitle tag="h5">{name}</CardTitle>
          <CardSubtitle className="mb-2 text-muted">${price}</CardSubtitle>
          <CardText>This place should add some description</CardText>
          <ProductCount id={id} />
        </CardBody>
      </Card>
    </Col>
  );
}

export default ProductItem;
