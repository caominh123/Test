import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import "antd/dist/antd.css";
import { Layout, Menu, Col, Dropdown, Icon, Badge } from "antd";
import { get } from "lodash";
import cookie from "../../../util/cookie";
import axios from "axios";
import { API_PRIVATE_URL, API_PUBLIC_URL } from "../../../util/config";
import { connect } from "react-redux";
import { addProductToCart } from "../../../actions/cart-actions";
import { bindActionCreators } from "redux";
const { Header } = Layout;

class Nav extends React.Component {
  state = {
    user: null,
    token: cookie.get(null, "token"),
    isAdmin: false
  };

  handleLogout = () => {
    cookie.destroy(this.context, "token");
    cookie.destroy(this.context, "cart");
    cookie.destroy(this.context, "numberInCart");
  };

  renderMenuOption = () => {
    const { isAdmin } = this.state;
    return (
      <>
        {!isAdmin ? (
          <Menu style={{ backgroundColor: "white" }}>
            <Menu.Item
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white"
              }}
            >
              <Icon type='contacts' />
              <Link to='/profile'>
                <b>Hồ sơ cá nhân</b>
              </Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white"
              }}
              onClick={this.handleLogout}
            >
              <Icon type='logout' />
              <Link to='/login'>
                <b>Đăng xuất</b>
              </Link>
            </Menu.Item>
          </Menu>
        ) : (
          <Menu>
            <Menu.Item
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white"
              }}
            >
              <Icon type='contacts' />
              <Link to='/profile'>
                <b style={{ backgroundColor: "white" }}>Hồ sơ cá nhân</b>
              </Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white"
              }}
            >
              <Icon type='container' />
              <Link to='/admin'>
                <b style={{}}>Trang quản lý</b>
              </Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white"
              }}
              onClick={this.handleLogout}
            >
              <Icon type='logout' />
              <Link to='/login'>
                <b style={{}}>Đăng xuất</b>
              </Link>
            </Menu.Item>
          </Menu>
        )}
      </>
    );
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");
    if (accessToken) {
      console.log("matching");
      this.setState({
        token: accessToken
      });
      cookie.set(null, "token", accessToken);
    }
    console.log("accessToken", accessToken);
    axios
      .get(
        `${API_PRIVATE_URL}/users/me?token=${accessToken || this.state.token}`
      )
      .then((res) => {
        console.log("user", res.data);
        this.setState({
          user: res.data
        });
      });

    axios
      .post(
        `${API_PRIVATE_URL}/check-admin?token=${accessToken ||
          this.state.token}`
      )
      .then((res) => {
        console.log("isAdmin", res.data);
        this.setState({
          isAdmin: res.data.isAdmin
        });
      });
    /* setInterval(() => {
      axios
        .get(
          `${API_PUBLIC_URL}/check-active-token?token=${accessToken ||
            this.state.token}`
        )
        .then((res) => {
          console.log("check-active-token", res.data);
          if (res.data.success === false) {
            cookie.destroy(this.context, "token");
            this.setState({
              token: undefined
            });
          }
        });
    }, 100000); */
  }

  render() {
    const { numberInCart } = this.props;
    const { choose } = this.props;
    const { user } = this.state;
    return (
      <Header
        style={{
          backgroundColor: "black",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Col span={24}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <div className='logo'>CELLPHONES</div>
            <Menu
              theme='light'
              mode='horizontal'
              defaultSelectedKeys={choose}
              style={{ marginLeft: "60px", color: "White" }}
            >
              <Menu.Item key='1'>
                <Link to='/'>
                  <a style={{ color: "White" }}>Trang chủ</a>
                </Link>
              </Menu.Item>
              <Menu.Item key='2'>
                {" "}
                <Link to='/product'>
                  <a style={{ color: "White" }}>Sản phẩm</a>
                </Link>
              </Menu.Item>
            </Menu>

            <div className='user-menu'>
              {!user || get(user, "success") === false ? (
                <Col>
                  <div
                    className='user-menu__content'
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div
                      className='register'
                      style={{
                        height: "auto",
                        fontWeight: "bold",
                        marginLeft: "30%",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <Link to='/cart'>
                        <Badge
                          count={numberInCart}
                          style={{ marginRight: "25px" }}
                        >
                          <Icon
                            type='shopping-cart'
                            style={{ fontSize: "25px", color: "white" }}
                          />
                        </Badge>
                      </Link>
                      <Link to='/register'>
                        <b
                          style={{
                            color: "#fff",
                            marginLeft: 10
                          }}
                        >
                          Đăng Ký
                        </b>
                      </Link>
                    </div>
                    <div
                      className='login'
                      style={{ height: "auto", fontWeight: "bold" }}
                    >
                      <Link to='/login'>
                        <b style={{ color: "#fff" }}>Đăng Nhập</b>
                      </Link>
                    </div>
                  </div>
                </Col>
              ) : (
                <div className='user-menu__content__expand'>
                  <div className='user-menu__content__expand__account'>
                    <Link to='/cart'>
                      <Badge
                        count={numberInCart}
                        style={{ marginRight: "25px" }}
                      >
                        <Icon
                          type='shopping-cart'
                          style={{ fontSize: "30px" }}
                        />
                      </Badge>
                    </Link>
                    <div className='user-avatar'>
                      <img
                        src={
                          get(user, "avatar") ||
                          "https://icon-library.net/images/631929649c.svg.svg"
                        }
                        alt='avatar'
                        style={{ width: "35px" }}
                      />
                    </div>
                    <div className='user-name'>
                      <Dropdown
                        overlay={this.renderMenuOption}
                        trigger={["click"]}
                        placement='bottomRight'
                        style={{ backgroundColor: "white" }}
                      >
                        <b className='ant-dropdown-link user-name__content'>
                          <span style={{ color: "white" }}>
                            {get(user, "name") || "Your Name"}
                          </span>
                          <Icon style={{ marginLeft: "10px" }} type='down' />
                        </b>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Header>
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
)(Nav);
