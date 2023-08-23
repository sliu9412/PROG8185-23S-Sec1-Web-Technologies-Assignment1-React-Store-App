import "./ProductDisplayStyle.css";
import ProductItem from "../Components/ProductItem";
import LayoutComp from "../Components/LayoutComp";
import { Products } from "../Utils/products.data";
import { Row } from "reactstrap";

function ProductDisplay() {
  const mock_data = [...Products];

  return (
    <LayoutComp>
      <h1>Cam Shop</h1>
      <Row>
        {mock_data.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            img={product.img}
          />
        ))}
      </Row>
    </LayoutComp>
  );
}

export default ProductDisplay;
