/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import FourColGrid from "../elements/four-col-grid/four-col-grid";
import ProductItem from "../elements/product-item/product-item";
import "./home.css";
import { Col, Layout, Row, Carousel } from "antd";
import Header from "../elements/header/header";
import axios from "axios";
import { API_PUBLIC_URL } from "../../util/config";
import { Link } from "react-router-dom";
import Slider from "react-slick";

class Home extends Component {
  state = {
    news: [],
    products: []
  };
  componentDidMount() {
    axios.get(`${API_PUBLIC_URL}/product`).then((res) => {
      this.setState({
        products: res.data
      });
    });
  }

  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 6
    };
    return (
      <Layout>
        <Header choose='1' />
        <Carousel autoplay>
          <div>
            <img
              height='400px'
              width='100%'
              src='https://cdn.cellphones.com.vn/media/ltsoft/promotion/note-10_-_blue_-1600x600_2_.png'
            />
          </div>
          <div>
            <img
              height='400px'
              width='100%'
              src='https://cdn.cellphones.com.vn/media/ltsoft/promotion/sliding_8_plus_511.png'
            ></img>
          </div>
          <div>
            <img
              height='400px'
              width='100%'
              src='https://cdn.cellphones.com.vn/media/ltsoft/promotion/Sliding-1600x600minote10pro.png'
            ></img>
          </div>
          <div>
            <img
              height='400px'
              width='100%'
              src='https://cdn.cellphones.com.vn/media/ltsoft/promotion/sliding_2.3_912.png'
            ></img>
          </div>
        </Carousel>
        <div style={{ padding: "50px" }}>
          <Slider {...settings}>
            {(this.state.products || []).map((element, i) => {
              return (
                <Link to={`/${element._id}`}>
                  <div>
                    <ProductItem key={element._id} products={element} />
                  </div>
                </Link>
              );
            })}
          </Slider>
        </div>
      </Layout>
    );
  }
}

export default Home;
