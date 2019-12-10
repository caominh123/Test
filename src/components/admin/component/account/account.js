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
  message
} from "antd";
import "./account.css";
import { isNull } from "lodash";
import axios from "axios";
import { API_PRIVATE_URL } from "../../../../util/config";
import cookie from "../../../../util/cookie";
const EditableContext = React.createContext();
const initState = {
  name: null,
  email: null,
  password: null,
  showModal: false,
  editingKey: ""
};
class EditableCell extends React.Component {
  getInput = (title) => {
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
            })(this.getInput(title))}
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
      accounts: [],
      token: cookie.get(null, "token")
    };
    this.columns = [
      {
        title: "Họ tên",
        dataIndex: "name",
        key: "name",
        width: "15%",
        editable: true
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: "25%",
        editable: true
      },

      {
        title: "Mật khẩu",
        key: "password",
        dataIndex: "password",
        width: "25%",
        editable: false,
        render: (text) => <p type='password'>***********************</p>
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
              title='Are you sure delete this?'
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
    const { name, email, password, token } = this.state;
    if (isNull(name)) {
      message.error("Vui lòng  nhập tên");
      return;
    }
    if (isNull(email)) {
      message.error("Vui lòng nhập email");
      return;
    }
    if (isNull(password)) {
      message.error("Vui lòng nhập mật khẩu");
      return;
    }

    const res = await axios.post(`${API_PRIVATE_URL}/users?token=${token}`, {
      name,
      email,
      password
    });
    console.log(res.data);
    const accounts = await axios.get(`${API_PRIVATE_URL}/users?token=${token}`);
    console.log(accounts.data);
    this.setState({
      name: null,
      email: null,
      password: null,
      showModal: false,
      accounts: accounts.data
    });
  };

  handleChangeFullName(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  handleChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }
  renderModal() {
    const { name, email, password, showModal } = this.state;
    return (
      <Modal
        title='Thêm tài khoản'
        visible={showModal}
        footer={null}
        onCancel={this.onCloseModal}
      >
        <div>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Họ tên</h2>
            <Input
              placeholder='Họ tên'
              className='input-detail'
              value={name}
              onChange={(name) => this.handleChangeFullName(name)}
            />
          </Row>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Email</h2>
            <Input
              placeholder='Email'
              className='input-detail'
              value={email}
              onChange={(email) => this.handleChangeEmail(email)}
            />
          </Row>
          <Row style={{ textAlign: "left" }}>
            <h2 className='label-title'>Mật khẩu</h2>
            <Input
              placeholder='Mật khẩu'
              className='input-detail'
              type='password'
              value={password}
              onChange={(password) => this.handleChangePassword(password)}
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
        `${API_PRIVATE_URL}/users/${key}?token=${token}`,
        {
          name: row.name,
          email: row.email
        }
      );
      console.log(res.data);

      const accounts = await axios.get(
        `${API_PRIVATE_URL}/users?token=${token}`
      );
      console.log(accounts.data);
      this.setState({
        accounts: accounts.data,
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
      `${API_PRIVATE_URL}/users/${key}?token=${token}`
    );
    console.log(res.data);

    const accounts = await axios.get(`${API_PRIVATE_URL}/users?token=${token}`);
    console.log(accounts.data);
    this.setState({
      accounts: accounts.data,
      editingKey: ""
    });
  };

  onClickShowModal = () => {
    this.setState({
      showModal: true
    });
  };

  componentDidMount() {
    axios
      .get(`${API_PRIVATE_URL}/users?token=${this.state.token}`)
      .then((res) => {
        this.setState({
          accounts: res.data
        });
      });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const { showModal, accounts } = this.state;
    (accounts || []).forEach((e) => {
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
            dataSource={accounts}
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

const Account = Form.create()(EditableTable);

export default Account;
