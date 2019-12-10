import React, { Component } from "react";
import "antd/dist/antd.css";
import { Layout, List, Input, Row, Col, Form, message } from "antd";
import Header from "../elements/header/header";
import "./cart.css";
import { Link } from "react-router-dom";
import currencyFormatter from "currency-formatter";
import { Button, Icon } from "antd";
import ButtonGroup from "antd/lib/button/button-group";
import { connect } from "react-redux";
import { get, isEmpty, isNull } from "lodash";
import { bindActionCreators } from "redux";
import {
  addProductToCart,
  deleteProductInCart,
  increaseQuality,
  decreaseQuality,
  destroyCart
} from "../../actions/cart-actions";
import axios from "axios";
import { API_PUBLIC_URL, API_PRIVATE_URL } from "../../util/config";
import cookie from "../../util/cookie";

class Cart extends Component {
  state = {
    number: 0,
    token: cookie.get(null, "token"),
    user: null
  };
  increase = async (id) => {
    await this.props.actions.increaseQuality(id);
    this.setState({
      number: this.props.numberInCart
    });
  };

  decrease = async (id) => {
    await this.props.actions.decreaseQuality(id);
    this.setState({
      number: this.props.numberInCart
    });
  };

  handleSubmit = (e, total) => {
    console.log("total", total);
    e.preventDefault();
    const phoneRegx = /^[0-9]{10,11}$/gm;
    const emailRegx = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gm;
    const { cart } = this.props;
    if (isEmpty(cart)) {
      message.error("Vui lòng chọn sản phẩm!");
      return;
    }
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (isNull(values.email.match(emailRegx))) {
          message.error("Email không hợp lệ");
          return;
        }
        if (isNull(values.phoneNumber.match(phoneRegx))) {
          message.error("SĐT không hợp lệ");
          return;
        }
        const res = await axios.post(`${API_PUBLIC_URL}/send-mail`, {
          info: values,
          product: this.props.cart,
          total: total
        });
        console.log("res.data", res.data);
        console.log("res.data", typeof res.data.success);
        if (res.data.success === true) {
          message.success(res.data.message);
          const resOrder = await axios.post(
            `${API_PRIVATE_URL}/order?token=${this.state.token}`,
            {
              name: values.name,
              address: values.address,
              phoneNumber: values.phoneNumber,
              listProduct: this.props.cart,
              total: total
            }
          );
          console.log("resOrder", resOrder.data);
          this.props.actions.destroyCart();
          this.props.history.push("/");
        } else {
          message.error(res.data.message);
        }
      }
    });
  };

  async componentDidMount() {
    const { token } = this.state;
    if (token) {
      axios.get(`${API_PRIVATE_URL}/users/me?token=${token}`).then((res) => {
        console.log("user", res.data);
        this.setState({
          user: res.data
        });
      });
    }
  }

  handleDelete = async (data) => {
    console.log(data);
    await this.props.actions.deleteProductInCart(data._id, data.quality);
    this.setState({
      number: this.props.numberInCart
    });
  };

  renderCart = (data) => {
    return (
      <>
        {data ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <img src={data.image1} alt='phone' style={{ width: "70px" }} />
            <div style={{ width: "200px", margin: "0 20px" }}>
              <Link to={`/${data._id}`}>
                <b style={{ color: "blue" }}>{data.name}</b>
              </Link>
            </div>

            <p style={{ color: "red", fontWeight: "bold", minWidth: "100px" }}>
              {currencyFormatter.format(data.cost, { code: "VND" })}
            </p>
            <ButtonGroup>
              <Button onClick={() => this.decrease(data._id)}>
                <Icon type='minus' />
              </Button>
              <Input
                value={data.quality}
                style={{ width: "50px", textAlign: "center" }}
              />
              <Button onClick={() => this.increase(data._id)}>
                <Icon type='plus' />
              </Button>
            </ButtonGroup>
            <Icon
              type='delete'
              theme='outlined'
              style={{ fontSize: "24px", margin: "2px 10px" }}
              onClick={() => this.handleDelete(data)}
            />
          </div>
        ) : (
          undefined
        )}
      </>
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { cart } = this.props;
    const { user } = this.state;
    let total = 0;
    (cart || []).map((i) => (total += i.cost * i.quality));
    return (
      <Layout>
        <Header />
        <div className='cart'>
          <Row className='cartContainer'>
            <Col span={18} style={{ width: "650px" }}>
              <List
                style={{
                  backgroundColor: "white",
                  padding: "0 20px"
                }}
                size='large'
                header={<h1>GIỎ HÀNG</h1>}
                footer={
                  <h1
                    style={{ color: "red", fontWeight: 900, marginTop: "30px" }}
                  >
                    Tổng: {currencyFormatter.format(total, { code: "VND" })}
                  </h1>
                }
                dataSource={cart || []}
                renderItem={(item, index) => (
                  <List.Item key={index}>{this.renderCart(item)}</List.Item>
                )}
              />
            </Col>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <Col
                span={18}
                offset={4}
                style={{ width: "450px", margin: "20px 0" }}
              >
                <h1 style={{ textAlign: "center", marginRight: "60px" }}>
                  THÔNG TIN MUA HÀNG
                </h1>
                <Form
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                  onSubmit={(e) => this.handleSubmit(e, total)}
                >
                  <Form.Item label='Tên'>
                    {getFieldDecorator("name", {
                      rules: [
                        { required: true, message: "Vui lòng nhập tên!" }
                      ],
                      initialValue: `${get(user, "name") || ""}`
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label='Email'>
                    {getFieldDecorator("email", {
                      rules: [
                        { required: true, message: "Vui lòng nhập email!" }
                      ],
                      initialValue: `${get(user, "email") || ""}`
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label='SĐT'>
                    {getFieldDecorator("phoneNumber", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại!"
                        }
                      ],
                      initialValue: `${get(user, "phoneNumber") || ""}`
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label='Địa chỉ'>
                    {getFieldDecorator("address", {
                      rules: [
                        { required: true, message: "Vui lòng nhập địa chỉ!" }
                      ],
                      initialValue: `${get(user, "address") || ""}`
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                    <Button
                      type='primary'
                      htmlType='submit'
                      style={{ width: "100%" }}
                    >
                      Xác thực đơn hàng
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </div>
          </Row>
        </div>
      </Layout>
    );
  }
}
const WrappedApp = Form.create({ name: "coordinated" })(Cart);

const mapStateToProps = (state) => {
  return {
    cart: get(state, ["cartReducer", "cart"]),
    numberInCart: get(state, ["cartReducer", "numberInCart"])
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
      {
        addProductToCart,
        deleteProductInCart,
        increaseQuality,
        decreaseQuality,
        destroyCart
      },
      dispatch
    )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedApp);
