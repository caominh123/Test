import React from "react";
import { Table } from "antd";
import "./order.css";
import axios from "axios";
import { API_PUBLIC_URL } from "../../../../util/config";
import cookie from "../../../../util/cookie";

const columns = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address"
  },
  {
    title: "SĐT",
    dataIndex: "phoneNumber",
    key: "phoneNumber"
  },
  {
    title: "Tổng đơn",
    key: "total",
    dataIndex: "total",
    render: (text) => <b>{text}</b>
  }
];

class Order extends React.Component {
  state = {
    order: [],
    token: cookie.get(null, "token")
  };
  componentDidMount() {
    axios
      .get(`${API_PUBLIC_URL}/order?token=${this.state.token}`)
      .then((res) => {
        this.setState({
          order: res.data
        });
      });
  }
  render() {
    console.log("order", this.state.order);
    return <Table columns={columns} dataSource={this.state.order || []} />;
  }
}
export default Order;
