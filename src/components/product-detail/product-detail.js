import React, { Component } from "react";
import "antd/dist/antd.css";
import { Layout, Card, Button, Row, Col, Carousel, Tag } from "antd";
import Header from "../elements/header/header";
import "./product-detail.css";
import axios from "axios";
import { API_PUBLIC_URL } from "../../util/config";
import { isNull } from "lodash";
import currencyFormatter from "currency-formatter";
import { get, omit } from "lodash";
import { connect } from "react-redux";
import { addProductToCart } from "../../actions/cart-actions";
import { bindActionCreators } from "redux";

class ProductDetail extends Component {
  state = {
    product: null
  };

  addToCart = async (data) => {
    this.props.actions.addProductToCart(
      omit(data, ["image2", "image3", "description", "__v"])
    );
  };

  componentDidMount() {
    axios
      .get(`${API_PUBLIC_URL}/product/${this.props.match.params.productId}`)
      .then((res) => {
        this.setState({
          product: res.data
        });
      });
  }
  render() {
    const { product } = this.state;
    console.log(product);
    return (
      <Layout>
        <Header choose='2' />
        {!isNull(product) ? (
          <div className='product-detail'>
            <h1 style={{ marginBottom: 30, marginLeft: 50 }}>{product.name}</h1>
            <Row>
              <Col span={12}>
                <Carousel autoplay style={{ height: "100%", width: "72%" }}>
                  <div>
                    <img
                      src={product.image1}
                      alt='image1'
                      width='100%'
                      height='80%'
                    />
                  </div>
                  <div>
                    <img
                      src={product.image2}
                      alt='image2'
                      width='100%'
                      height='80%'
                    />
                  </div>
                  <div>
                    <img
                      src={product.image3}
                      alt='image3'
                      width='100%'
                      height='80%'
                    />
                  </div>
                </Carousel>
              </Col>
              <Col span={12}>
                <h1
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    marginBottom: "20px"
                  }}
                >
                  {currencyFormatter.format(product.cost, { code: "VND" })}{" "}
                  <Tag color='gold' style={{ marginLeft: 8 }}>
                    Trả góp 0%
                  </Tag>
                </h1>
                <Card style={{ width: 400 }}>
                  <div class='kmChung'>
                    <h4>Trả góp 0%:</h4>
                    <div class='pack-detail'>
                      <ul class='el-promotion-pack'>
                        <li>
                          <a
                            href='https://cellphones.com.vn/tra-gop'
                            rel='nofollow'
                          >
                            Trả góp lãi suất 0% với Home Credit. Trả trước 50%,
                            kỳ hạn 8 tháng (Áp dụng trên GIÁ NIÊM YẾT, không áp
                            dụng cùng các khuyến mại khác)
                          </a>
                        </li>
                      </ul>
                    </div>
                    <h4>Chương trình khuyến mại:</h4>
                    <div class='pack-detail'>
                      <ul class='el-promotion-pack'>
                        <li>
                          <a
                            href='https://cellphones.com.vn/phu-kien/apple.html'
                            rel='nofollow'
                          >
                            Giảm 200.000đ khi mua kèm Tai nghe Airpods
                          </a>
                        </li>
                        <li>
                          <a
                            href='https://cellphones.com.vn/thu-cu-doi-moi-iphone'
                            rel='nofollow'
                          >
                            Thu cũ đổi mới iPhone 11 | Pro | Pro Max - Giá thu
                            tốt nhất thị trường
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
                <Button
                  style={{
                    width: "300px",
                    marginTop: "30px",
                    height: "auto",
                    backgroundColor: "black",
                    color: "white"
                  }}
                  onClick={() => this.addToCart(product)}
                >
                  <strong style={{ fontSize: "24px" }}>MUA NGAY</strong> <br />
                  Giao tận nơi hoặc nhận tại siêu thị
                </Button>
              </Col>
            </Row>
          </div>
        ) : (
          undefined
        )}
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
)(ProductDetail);
