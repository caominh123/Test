import React, { Component } from "react";
import "antd/dist/antd.css";
import { Layout, Menu, Icon } from "antd";
import "./admin.css";
import Account from "./component/account/account";
import Order from "./component/order/order";
import News from "./component/news/news";
import Product from "./component/product/product";
import cookie from "../../util/cookie";
const { Header, Content, Footer, Sider } = Layout;
const initState = {
  account: true,
  order: false,
  product: false,
  news: false,
  choose: "1"
};
class Admin extends Component {
  state = { ...initState };
  handleOnClick = (data) => {
    console.log(data.key);
    switch (data.key) {
      case "1":
        this.setState({
          ...initState,
          account: true,
          choose: data.key
        });
        break;
      case "2":
        this.setState({
          ...initState,
          order: true,
          account: false,
          choose: data.key
        });
        break;
      case "3":
        this.setState({
          ...initState,
          product: true,
          account: false,
          choose: data.key
        });
        break;

      default:
        this.setState({
          ...initState,
          account: true,
          choose: data.key
        });
        break;
    }
  };
  componentWillMount() {
    const token = cookie.get(null, "token");
    console.log(token);
    if (!token) {
      this.props.history.push("/");
    }
  }
  render() {
    const { account, product, order } = this.state;
    return (
      <Layout>
        <Sider
          breakpoint='lg'
          collapsedWidth='0'
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className='logo'>
            <a href='/' style={{ color: "white" }}>
              CellphoneS
            </a>
          </div>
          <Menu
            theme='dark'
            mode='inline'
            defaultSelectedKeys={[this.state.choose]}
            onClick={(item) => this.handleOnClick(item)}
          >
            <Menu.Item key='1' style={{ backgroundColor: "transparent" }}>
              <Icon type='user' />
              <span className='nav-text'>Quản lý tài khoản</span>
            </Menu.Item>
            <Menu.Item key='2' style={{ backgroundColor: "transparent" }}>
              <Icon type='shopping' />
              <span className='nav-text'>Quản lý đơn hàng</span>
            </Menu.Item>
            <Menu.Item key='3' style={{ backgroundColor: "transparent" }}>
              <Icon type='shop' />
              <span className='nav-text'>Quản lý sản phẩm</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{ background: "#fff", paddingLeft: 40, fontWeight: "bold" }}
          >
            {account && "ADMIN PAGE"}
            {order && "ORDER PAGE"}
            {product && "PRODUCT PAGE"}
          </Header>
          <Content style={{ margin: "24px 16px 0" }}>
            <div style={{ padding: 24, background: "#fff", minHeight: 576 }}>
              {account && <Account />}
              {order && <Order />}
              {product && <Product />}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>CellphoneS ©2019</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Admin;
