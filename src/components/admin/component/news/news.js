import React from "react";
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Icon,
  Button,
  Avatar,
  Modal,
  Row,
  message
} from "antd";
import "./news.css";
import { isNull } from "lodash";
import axios from "axios";
import { API_PRIVATE_URL, API_PUBLIC_URL } from "../../../../util/config";
import cookie from "../../../../util/cookie";
const EditableContext = React.createContext();

const initState = {
  name: null,
  content: null,
  image: null,
  editingKey: "",
  showModal: false
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
      editingKey: "",
      news: [],
      token: cookie.get(null, "token")
    };
    this.columns = [
      {
        title: "Tên bài viết",
        dataIndex: "name",
        key: "name",
        width: "15%",
        editable: true
      },
      {
        title: "Nội dung",
        dataIndex: "content",
        key: "content",
        width: "70%",
        editable: true
      },
      {
        title: "Hình ảnh",
        key: "image",
        dataIndex: "image",
        width: "15%",
        editable: true,
        align: "center",
        render: (text) => <Avatar src={text} shape='square' size='70px' />
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
                href='#'
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
    const { name, content, image, token } = this.state;
    if (isNull(this.state.content)) {
      message.error("Vui lòng nhập nội dung");
      return;
    }
    if (isNull(this.state.name)) {
      message.error("Vui lòng nhập tên bài viết");
      return;
    }
    if (isNull(this.state.image)) {
      message.error("Vui lòng chọn hình ảnh");
      return;
    }
    const res = await axios.post(`${API_PRIVATE_URL}/news?token=${token}`, {
      name,
      content,
      image
    });
    console.log(res.data);
    const news = await axios.get(`${API_PUBLIC_URL}/news?token=${token}`);
    console.log(news.data);
    this.setState({
      name: null,
      content: null,
      image: null,
      editingKey: "",
      showModal: false,
      news: news.data
    });
  };

  handleChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleChangeContent(e) {
    this.setState({
      content: e.target.value
    });
  }

  handleChangeImage(e) {
    this.setState({
      image: e.target.value
    });
  }

  renderModal() {
    const { name, content, image, showModal } = this.state;
    return (
      <Modal
        title='Thêm tin tức'
        visible={showModal}
        footer={null}
        onCancel={this.onCloseModal}
      >
        <div>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Tên bài viết</h2>
            <Input
              placeholder='Tên bài viết'
              className='input-detail'
              value={name}
              onChange={(name) => this.handleChangeName(name)}
            />
          </Row>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Nội dung</h2>
            <Input
              placeholder='Nội dung'
              className='input-detail'
              value={content}
              onChange={(content) => this.handleChangeContent(content)}
            />
          </Row>

          <Row style={{ textAlign: "left", marginBottom: "10px" }}>
            <h2 className='label-title'>Hình ảnh</h2>
            <Input
              placeholder='Hình ảnh'
              className='input-detail'
              value={image}
              onChange={(image) => this.handleChangeImage(image)}
            />
          </Row>
          <Row style={{ textAlign: "center" }}>
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
        `${API_PRIVATE_URL}/news/${key}?token=${token}`,
        {
          name: row.name,
          image: row.image,
          content: row.content
        }
      );
      console.log(res.data);

      const news = await axios.get(`${API_PUBLIC_URL}/news?token=${token}`);
      console.log(news.data);
      this.setState({
        news: news.data,
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
      `${API_PRIVATE_URL}/news/${key}?token=${token}`
    );
    console.log(res.data);

    const news = await axios.get(`${API_PUBLIC_URL}/news?token=${token}`);
    console.log(news.data);
    this.setState({
      news: news.data,
      editingKey: ""
    });
  };

  onClickShowModal = () => {
    this.setState({
      showModal: true
    });
  };

  componentDidMount() {
    axios.get(`${API_PUBLIC_URL}/news`).then((res) => {
      this.setState({
        news: res.data
      });
    });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const { showModal, news } = this.state;
    (news || []).forEach((e) => {
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
            dataSource={news}
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

const News = Form.create()(EditableTable);

export default News;
