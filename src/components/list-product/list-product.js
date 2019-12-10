import React, { Component } from "react";
import "antd/dist/antd.css";
import { Layout, Card, Button, Col } from "antd";
import Header from "../elements/header/header";
import axios from "axios";
import { API_PUBLIC_URL } from "../../util/config";
import "./list-product.css";
import { Link } from "react-router-dom";
import currencyFormatter from "currency-formatter";
import { get, omit } from "lodash";
import { connect } from "react-redux";
import { addProductToCart } from "../../actions/cart-actions";
import { bindActionCreators } from "redux";
const gridStyle = {
  marginBottom: "15px",
  width: "95%",
  textAlign: "center"
};

class ListProduct extends Component {
  state = {
    products: []
  };

  addToCart = async (data) => {
    this.props.actions.addProductToCart(
      omit(data, ["image2", "image3", "description", "__v"])
    );
  };

  componentDidMount() {
    axios.get(`${API_PUBLIC_URL}/product`).then((res) => {
      this.setState({
        products: res.data
      });
    });
  }

  render() {
    const { cart, numberInCart } = this.props;
    console.log("cart", cart);
    console.log("numberInCart", numberInCart);
    return (
      <Layout>
        <Header choose='2' />
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <div className='product'>
            <Card title='Tất cả sản phẩm'>
              {(this.state.products || []).map((element, i) => (
                <Col lg={4} md={6} sm={8} xs={12}>
                  <Card.Grid style={gridStyle} key={element._id}>
                    <div>
                      <div>
                        <Link to={`/${element._id}`}>
                          <img
                            src={element.image1}
                            alt={element.name}
                            style={{
                              height: 200,
                              paddingBottom: 10,
                              width: "100%"
                            }}
                          />
                          <p
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            {element.name}
                          </p>
                        </Link>
                        <b
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            fontSize: "18px",
                            marginBottom: "10px"
                          }}
                        >
                          {currencyFormatter.format(element.cost, {
                            code: "VND"
                          })}
                        </b>
                      </div>
                      <Button
                        style={{
                          width: "100%",
                          backgroundColor: "black",
                          color: "white",
                          fontWeight: 900
                        }}
                        onClick={() => this.addToCart(element)}
                      >
                        Thêm vào giỏ hàng
                      </Button>
                    </div>
                  </Card.Grid>
                </Col>
              ))}
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        addProductToCart
      },
      dispatch
    )
  };
};

const mapStateToProps = (state) => {
  return {
    cart: get(state, ["cartReducer", "cart"]),
    numberInCart: get(state, ["cartReducer", "numberInCart"])
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListProduct);
