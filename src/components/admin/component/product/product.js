import React from "react";
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Icon,
  Button,
  Modal,
  Row,
  message,
  Avatar
} from "antd";
import "./product.css";
import { isNull } from "lodash";
import axios from "axios";
import { API_PRIVATE_URL, API_PUBLIC_URL } from "../../../../util/config";
import cookie from "../../../../util/cookie";
const EditableContext = React.createContext();
const initState = {
  name: null,
  cost: null,
  description: null,
  image1: null,
  image2: null,
  image3: null,
  showModal: false,
  editingKey: ""
};
class EditableCell extends React.Component {
  getInput = () => {
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: false,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initState,
      products: [],
      token: cookie.get(null, "token")
    };
    this.columns = [
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        width: "15%",
        editable: true
      },
      {
        title: "Giá",
        dataIndex: "cost",
        key: "cost",
        width: "10%",
        editable: true
      },
      {
        title: "Mô tả",
        key: "description",
        dataIndex: "description",
        width: "25%",
        editable: true
      },
      {
        title: "Hình ảnh 1",
        key: "image1",
        dataIndex: "image1",
        width: "10%",
        editable: true,
        align: "center",
        render: (text) => <Avatar src={text} shape='square' size='20px' />
      },
      {
        title: "Hình ảnh 2",
        key: "image2",
        dataIndex: "image2",
        width: "10%",
        editable: true,
        align: "center",
        render: (text) => <Avatar src={text} shape='square' />
      },
      {
        title: "Hình ảnh 3",
        key: "image3",
        dataIndex: "image3",
        width: "10%",
        editable: true,
        align: "center",
        render: (text) => <Avatar src={text} shape='square' />
      },
      {
        title: "Edit",
        dataIndex: "Edit",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {(form) => (
                  <a
                    href='#'
                    style={{ color: "red" }}
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title='Sure to cancel?'
                onConfirm={() => this.cancel(record.key)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <div>
              <a
                style={{ color: "red" }}
                disabled={editingKey !== ""}
                onClick={() => this.edit(record.key)}
              >
                <Icon type='edit' style={{ margin: "5px" }} />
                Edit
              </a>
            </div>
          );
        }
      },
      {
        title: "Delete",
        dataIndex: "Delete",
        render: (text, record) => {
          return (
            <Popconfirm
              title='Are you sure delete this task?'
              onConfirm={() => this.delete(record._id)}
              onCancel={this.cancel}
              okText='Yes'
              cancelText='No'
            >
              <a href='#'>
                <Icon type='delete' style={{ margin: "5px" }} />
                Delete
              </a>
            </Popconfirm>
          );
        }
      }
    ];
  }

  isEditing = (record) => record.key === this.state.editingKey;

  handleAdd = async () => {
    const {
      name,
      cost,
      description,
      image1,
      image2,
      image3,
      token
    } = this.state;
    if (isNull(name)) {
      message.error("Vui lòng  nhập tên sản phẩm");
      return;
    }
    if (isNull(cost)) {
      message.error("Vui lòng nhập giá");
      return;
    }
    if (isNull(description)) {
      message.error("Vui lòng nhập mô tả");
      return;
    }

    const res = await axios.post(`${API_PRIVATE_URL}/product?token=${token}`, {
      name,
      cost,
      description,
      image1,
      image2,
      image3
    });
    console.log(res.data);
    const products = await axios.get(
      `${API_PUBLIC_URL}/product?token=${token}`
    );
    console.log(products.data);
    this.setState({
      name: null,
      cost: null,
      description: null,
      image1: null,
      image2: null,
      image3: null,
      showModal: false,
      editingKey: "",
      products: products.data
    });
  };

  handleChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleChangeCost(e) {
    this.setState({
      cost: e.target.value
    });
  }

  handleChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  handleChangeImage1(e) {
    this.setState({
      image1: e.target.value
    });
  }

  handleChangeImage2(e) {
    this.setState({
      image2: e.target.value
    });
  }

  handleChangeImage3(e) {
    this.setState({
      image3: e.target.value
    });
  }
  renderModal() {
    const {
      name,
      cost,
      description,
      image1,
      image2,
      image3,
      showModal
    } = this.state;
    return (
      <Modal
        title='Thêm sản phẩm'
        visible={showModal}
        footer={null}
        onCancel={this.onCloseModal}
      >
        <div>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Tên sản phẩm</h2>
            <Input
              placeholder='Tên sản phẩm'
              className='input-detail'
              value={name}
              onChange={(name) => this.handleChangeName(name)}
            />
          </Row>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Giá</h2>
            <Input
              placeholder='Giá'
              className='input-detail'
              value={cost}
              onChange={(cost) => this.handleChangeCost(cost)}
            />
          </Row>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Mô tả</h2>
            <Input
              placeholder='Mô tả'
              className='input-detail'
              type='description'
              value={description}
              onChange={(description) =>
                this.handleChangeDescription(description)
              }
            />
          </Row>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Hình ảnh 1</h2>
            <Input
              placeholder='Hình ảnh 1'
              className='input-detail'
              type='image1'
              value={image1}
              onChange={(e) => this.handleChangeImage1(e)}
            />
          </Row>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Hình ảnh 2</h2>
            <Input
              placeholder='Hình ảnh 2'
              className='input-detail'
              type='image2'
              value={image2}
              onChange={(e) => this.handleChangeImage2(e)}
            />
          </Row>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Hình ảnh 3</h2>
            <Input
              placeholder='Hình ảnh 3'
              className='input-detail'
              type='image3'
              value={image3}
              onChange={(e) => this.handleChangeImage3(e)}
            />
          </Row>
          <Row style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              type='primary'
              className='button-manager'
              onClick={this.handleAdd}
            >
              Thêm
            </Button>
          </Row>
        </div>
      </Modal>
    );
  }

  onCloseModal = () => {
    this.setState({
      showModal: false
    });
  };

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  save(form, key) {
    form.validateFields(async (error, row) => {
      if (error) {
        return;
      }
      console.log("key", key);
      console.log("row", row);
      const { token } = this.state;
      const res = await axios.put(
        `${API_PRIVATE_URL}/product/${key}?token=${token}`,
        {
          name: row.name,
          cost: row.cost,
          description: row.description,
          image1: row.image1,
          image2: row.image2,
          image3: row.image3
        }
      );
      console.log(res.data);

      const products = await axios.get(
        `${API_PUBLIC_URL}/product?token=${token}`
      );
      console.log(products.data);
      this.setState({
        products: products.data,
        editingKey: ""
      });
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  delete = async (key) => {
    console.log("key", key);
    const { token } = this.state;
    const res = await axios.delete(
      `${API_PRIVATE_URL}/product/${key}?token=${token}`
    );
    console.log(res.data);

    const products = await axios.get(
      `${API_PUBLIC_URL}/product?token=${token}`
    );
    console.log(products.data);
    this.setState({
      products: products.data,
      editingKey: ""
    });
  };

  onClickShowModal = () => {
    this.setState({
      showModal: true
    });
  };

  componentDidMount() {
    axios.get(`${API_PUBLIC_URL}/product`).then((res) => {
      this.setState({
        products: res.data
      });
    });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const { showModal, products } = this.state;
    (products || []).forEach((e) => {
      e.key = e._id;
    });
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === "age" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <div>
        <Button
          onClick={(value) => this.onClickShowModal(value)}
          type='primary'
          icon='plus-circle'
          className='button-add'
        >
          Thêm
        </Button>

        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={products}
            columns={columns}
            rowClassName='editable-row'
            pagination={{
              onChange: this.cancel
            }}
          />
        </EditableContext.Provider>
        {showModal && this.renderModal()}
      </div>
    );
  }
}

const Product = Form.create()(EditableTable);

export default Product;
