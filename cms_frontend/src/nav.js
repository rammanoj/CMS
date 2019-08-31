import React from "react";
import { Menu, Modal, Form, Dropdown, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { categoryUpdate } from "./api";

class Nav extends React.Component {
  /**
   * Render navbar in webpage
   */
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: "",
      loading: false,
      parent: ""
    };
  }

  update = () => {
    /**
     * Update the parent of a category.
     */
    if (this.state.name === "" || this.state.parent === "") {
      this.props.set({
        message: {
          type: 1,
          trigger: true,
          update: !this.props.message.update,
          message: "Fill the form completely!"
        }
      });
    } else {
      this.setState({ loading: true });
      fetch(categoryUpdate + this.state.name + "/", {
        method: "PATCH",
        body: JSON.stringify({
          parent: this.state.parent
        }),
        headers: {
          "Content-type": "application/json"
        }
      })
        .then(response => response.json())
        .then(resp => {
          if (resp.error !== undefined) {
            this.props.set({
              message: {
                type: 1,
                trigger: true,
                update: !this.props.message.update,
                message: resp.message
              }
            });
            this.setState({ loading: false });
          } else {
            this.props.set({
              message: {
                type: 0,
                trigger: true,
                update: !this.props.message.update,
                message: "Successfully updated"
              }
            });
            this.setState({
              loading: false,
              open: false,
              parent: "",
              name: ""
            });
          }
        });
    }
  };

  render = () => (
    <React.Fragment>
      <Menu className="nav" secondary>
        <Menu.Item className="header" to="/" as={Link}>
          CMS
        </Menu.Item>
        <Menu.Item position="right">
          <span onClick={() => this.setState({ open: !this.state.open })}>
            Update
          </span>
        </Menu.Item>
      </Menu>
      <Modal
        open={this.state.open}
        centered
        size="tiny"
        closeIcon={true}
        onClose={(e, obj) => {
          this.setState({ open: !this.state.open });
        }}
        className="add_modal"
      >
        <Modal.Header>Update Parent Category</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Name</label>
              <Dropdown
                placeholder="Select category"
                selectOnBlur={false}
                fluid
                search
                selection
                options={this.props.category}
                value={this.state.name !== false ? this.state.name : ""}
                onChange={(e, obj) => {
                  this.setState({ name: obj.value });
                }}
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
                value={this.state.parent !== false ? this.state.parent : ""}
                onChange={(e, obj) => {
                  this.setState({ parent: obj.value });
                }}
              />
            </Form.Field>
          </Form>
          <div style={{ textAlign: "center" }}>
            <Button
              style={{ marginTop: "3vh" }}
              className="submit"
              loading={this.state.loading}
              onClick={() => this.update()}
            >
              Update
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    </React.Fragment>
  );
}

export default Nav;
