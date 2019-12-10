import React, { Component } from "react";
import "./login.css";
import { Row, Card, Form, Input, Icon, Button, Tag, Checkbox, Col } from "antd";
import "antd/dist/antd.css";
import { API_PUBLIC_URL } from "../../util/config";
import axios from "axios";
import cookie from "../../util/cookie";
import { Link } from "react-router-dom";

class LoginPage extends Component {
  state = {
    success: null,
    message: null,
    token: null
  };
  handleSubmitForm = (e) => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err)
        axios
          .post(`${API_PUBLIC_URL}/login`, { ...values })
          .then((res) => {
            console.log(res.data);
            this.setState({
              success: res.data.success,
              message: res.data.message,
              token: res.data.token || null
            });
          })
          .then(() => {
            if (this.state.success === true) {
              cookie.set(null, "token", this.state.token);
              this.props.history.push("/");
            }
          });
    });
  };

  displayError = () => {
    if (this.state.success === false) {
      return <Tag color='red'>Email hoặc mật khẩu không chính xác!</Tag>;
    }
  };

  onClickFaceBook() {
    window.location.href = `${API_PUBLIC_URL}/facebook`;
  }

  onClickGoogle() {
    window.location.href = `${API_PUBLIC_URL}/google`;
  }

  componentWillMount() {
    const token = cookie.get(null, "token");
    console.log(typeof token);
    console.log("token", token);
    /* if (token && token !== "undefined") {
      this.props.history.push("/");
    } */
  }

  componentDidMount() {
    console.log(this.state.success);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='auth-container '>
        <div className='auth-container '>
          <Row type='flex' justify='center'>
            <Card title='ĐĂNG NHẬP' className='card-signin text-center'>
              <Form onSubmit={this.handleSubmitForm} className='auth-form'>
                {this.displayError()}
                <Form.Item>
                  {getFieldDecorator("email", {
                    rules: [{ required: true, message: `Vui lòng nhập email!` }]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type='user'
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder='Email'
                      className='input-form'
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [
                      { required: true, message: `Vui lòng nhập mật khẩu!` }
                    ]
                  })(
                    <Input.Password
                      prefix={
                        <Icon
                          type='lock'
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type='password'
                      placeholder='Mật Khẩu'
                      className='input-form'
                    />
                  )}
                </Form.Item>
                <Row type='flex' justify='space-between'></Row>
                <Form.Item>
                  <Button
                    htmlType='submit'
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "15px",
                      fontFamily: "iCiel"
                    }}
                    className='auth-form-button'
                  >
                    Đăng nhập
                  </Button>
                  <Row md={12} lg={12}>
                    <Button
                      size='large'
                      className='btn btn-google'
                      style={{
                        width: "100%",
                        backgroundColor: "#ea4335"
                      }}
                      onClick={this.onClickGoogle}
                    >
                      Google
                    </Button>
                  </Row>
                  <Row md={12} lg={12}>
                    <Button
                      size='large'
                      className='btn btn-facebook'
                      style={{
                        width: "100%",
                        backgroundColor: "#3b5998"
                      }}
                      onClick={this.onClickFaceBook}
                    >
                      Facebook
                    </Button>
                  </Row>
                </Form.Item>
              </Form>
            </Card>
          </Row>
        </div>
      </div>
    );
  }
}

const WrappedLoginPage = Form.create({ name: "LoginPage" })(LoginPage);

export default WrappedLoginPage;
