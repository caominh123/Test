import React from "react";
import "antd/dist/antd.css";
import "./product-item.css";
import { Card, Col } from "antd";
import currencyFormatter from "currency-formatter";
const { Meta } = Card;

const ProductItem = (products) => {
  return (
    <Card
      hoverable
      style={{ width: "100%" }}
      cover={
        <img
          alt='example'
          src={products.products.image1}
          style={{ padding: "10px", height: "250px" }}
        />
      }
      key={products.products._id}
    >
      <Meta
        title={products.products.name}
        description={currencyFormatter.format(products.products.cost, {
          code: "VND"
        })}
        style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}
      />
    </Card>
  );
};

export default ProductItem;
