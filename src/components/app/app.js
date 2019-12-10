import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "../home/home";
import Admin from "../admin/admin";
import NotFound from "../elements/not-found/not-found";
import RegisterPage from "../register/register";
import LoginPage from "../login/login";
import ListProduct from "../list-product/list-product";
import ProductDetail from "../product-detail/product-detail";
import "antd/dist/antd.css";
import Cart from "../cart/cart";
import { connect } from "react-redux";

const App = () => {
  return (
    <BrowserRouter>
      <React.Fragment>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/register' component={RegisterPage} exact />
          <Route path='/login' component={LoginPage} exact />
          <Route path='/product' component={ListProduct} exact />
          <Route path='/cart' component={Cart} exact />
          <Route path='/admin' component={Admin} exact />
          <Route path='/:productId' component={ProductDetail} exact />
          <Route component={NotFound} />
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default connect(
  null,
  null
)(App);
