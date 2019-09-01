import React from "react";
import { Form, Modal, Button, Table, Icon, Dropdown } from "semantic-ui-react";
import {
  productList as productCreate,
  BrandList as BrandCreate,
  CategoryList as categoryCreate
} from "./api";

class AddItems extends React.Component {
  /**
   * Provide functionality to Create Brand, Category and Product
   */
  constructor(props) {
    super(props);
    this.state = {
      brand: "",
      name: "",
      category: "",
      spec: [],
      file: "",
      parent: false
    };
  }

  addData = () => {
    /**
     * Make the Request Payload.
     */
    let data;
    if (this.props.add == 0) {
      data = new FormData();
      data.append("name", this.state.name);
      data.append("brand", this.state.brand);
      data.append("category", this.state.category);
      data.append("image", this.state.file);
      for (let i of this.state.spec) {
        data.append("spec[][key]", i.key);
        data.append("spec[][value]", i.value);
      }
    } else {
      if (this.state.parent !== false) {
        data = JSON.stringify({
          name: this.state.name,
          parent: this.state.parent
        });
      } else {
        data = JSON.stringify({
          name: this.state.name
        });
      }
    }

    return data;
  };

  CreateItem = (uri, data) => {
    /**
     * Perform the Api request to create the Item (i.e Brand, Category or Product).
     */
    this.setState({ loading: true });
    let obj = {
      method: "POST",
      body: data
    };
    if (this.props.add != 0) {
      obj.headers = {
        "Content-Type": "application/json"
      };
    }
    fetch(uri, obj)
      .then(resp => resp.json())
      .then(resp => {
        if (resp.error !== undefined) {
          this.setState({ loading: false });
          this.props.set(
            {
              message: {
                type: 1,
                trigger: true,
                update: !this.props.message.update,
                message: resp.message
              }
            },
            () => {}
          );
        } else {
          let obj = {
            add: false,
            message: {
              type: 0,
              trigger: true,
              update: !this.props.message.update,
              message: "Successfully added!"
            }
          };
          if (this.props.add == 0) {
            let products = [...this.props.product];
            products.unshift(resp);
            obj.products = products;
          } else if (this.props.add == 1) {
            let brands = [...this.props.brand];
            brands.push({
              text: resp.name,
              key: brands.length,
              value: resp.name
            });
            obj.brands = brands;
          } else {
            let categories = [...this.props.category];
            categories.push({
              text: resp.name,
              key: categories.length,
              value: resp.name
            });
            obj.categories = categories;
          }
          this.setState({ loading: false });
          this.props.set(obj, () => {});
        }
      });
  };

  render = () => {
    let arr = ["Product", "Brand", "Category"];
    let table_rows = [];
    for (let i = 0; i < this.state.spec.length; i++) {
      table_rows.push(
        <Table.Row>
          <Table.Cell>
            <Form.Input
              placeholder="Enter key"
              value={this.state.spec[i].key}
              onChange={e => {
                let specs = [...this.state.spec];
                specs[i].key = e.target.value;
                this.setState({ spec: specs });
              }}
            ></Form.Input>
          </Table.Cell>
          <Table.Cell>
            <Form.Input
              placeholder="Enter value"
              value={this.state.spec[i].value}
              onChange={e => {
                let specs = [...this.state.spec];
                specs[i].value = e.target.value;
                this.setState({ spec: specs });
              }}
            ></Form.Input>
          </Table.Cell>
          <Table.Cell>
            <Icon
              name="minus circle"
              color="red"
              style={{ cursor: "pointer" }}
              onClick={() => {
                let specs = [...this.state.spec];
                specs.splice(i, 1);
                this.setState({ spec: specs });
              }}
            />
          </Table.Cell>
        </Table.Row>
      );
    }
    return (
      <Modal
        open={this.props.add !== false}
        centered
        size="tiny"
        closeIcon={true}
        onClose={(e, obj) => {
          this.props.set({ add: false }, () => {});
        }}
        className="add_modal"
      >
        <Modal.Header> Add new {arr[this.props.add]}</Modal.Header>
        <Modal.Content>
          {this.props.add == 0 ? (
            <React.Fragment>
              <Form>
                <Form.Field>
                  <label>Name</label>
                  <input
                    placeholder="Enter name of product"
                    value={this.state.name}
                    name="name"
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                </Form.Field>

                <Form.Field>
                  <label>Brand</label>
                  <Dropdown
                    placeholder="Select Brand"
                    selectOnBlur={false}
                    fluid
                    search
                    selection
                    options={this.props.brand}
                    value={this.state.brand !== "" ? this.state.brand : ""}
                    onChange={(e, obj) => this.setState({ brand: obj.value })}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Category</label>
                  <Dropdown
                    placeholder="Select Category"
                    selectOnBlur={false}
                    fluid
                    search
                    selection
                    options={this.props.category}
                    value={
                      this.state.category !== "" ? this.state.category : ""
                    }
                    onChange={(e, obj) =>
                      this.setState({ category: obj.value })
                    }
                  />
                </Form.Field>

                {this.state.spec.length !== 0 ? (
                  <Table celled padded>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Key</Table.HeaderCell>
                        <Table.HeaderCell>value</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                      </Table.Row>
                      {table_rows}
                    </Table.Header>
                  </Table>
                ) : (
                  ""
                )}

                <Form.Field>
                  <Button
                    className="add_key_value"
                    onClick={() => {
                      let specs = [...this.state.spec];
                      specs.push({
                        key: "",
                        value: ""
                      });
                      this.setState({
                        spec: specs
                      });
                    }}
                    icon="plus"
                  ></Button>
                  <label
                    htmlFor="fileupload"
                    style={{ float: "left", marginTop: 10 }}
                  >
                    <span className="file_upload">Select Image</span>
                    {this.state.file !== ""
                      ? "    " + this.state.file.name
                      : ""}
                    <input
                      id="fileupload"
                      type="file"
                      style={{
                        display: "none"
                      }}
                      onChange={e => {
                        this.setState({ file: e.target.files[0] });
                      }}
                    />
                  </label>
                </Form.Field>
              </Form>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {this.props.add === 1 ? (
                <div>
                  <Form>
                    <Form.Field>
                      <label>Name</label>
                      <input
                        placeholder="Enter name of Brand"
                        value={this.state.name}
                        name="name"
                        onChange={e => this.setState({ name: e.target.value })}
                      />
                    </Form.Field>
                  </Form>
                </div>
              ) : (
                <div>
                  <Form>
                    <Form.Field>
                      <label>Name</label>
                      <input
                        placeholder="Enter name of Category"
                        value={this.state.name}
                        name="name"
                        onChange={e => this.setState({ name: e.target.value })}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Select Parent</label>
                      <Dropdown
                        placeholder="Select parent category"
                        selectOnBlur={false}
                        fluid
                        search
                        selection
                        options={this.props.category}
                        value={
                          this.state.parent !== false ? this.state.parent : ""
                        }
                        onChange={(e, obj) => {
                          this.setState({ parent: obj.value });
                        }}
                      />
                    </Form.Field>
                  </Form>
                </div>
              )}
            </React.Fragment>
          )}
          <div
            style={{
              textAlign: "center",
              marginTop: this.props.add == 0 ? "10vh" : "2vh"
            }}
          >
            <Button
              className="submit"
              loading={this.state.loading}
              onClick={() =>
                this.CreateItem(
                  this.props.add === 0
                    ? productCreate
                    : this.props.add == 1
                    ? BrandCreate
                    : categoryCreate,
                  this.addData()
                )
              }
            >
              Submit
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  };
}

export default AddItems;
