import React from "react";
import {
  Icon,
  Modal,
  Form,
  Dropdown,
  Button,
  Grid,
  Input,
  Popup
} from "semantic-ui-react";
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
      this.props.set(
        {
          message: {
            type: 1,
            trigger: true,
            update: !this.props.message.update,
            message: "Fill the form completely!"
          }
        },
        () => {}
      );
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
            this.setState({ loading: false });
          } else {
            this.props.set(
              {
                message: {
                  type: 0,
                  trigger: true,
                  update: !this.props.message.update,
                  message: "Successfully updated"
                }
              },
              () => {}
            );
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
      <div
        className="nav"
        style={window.innerWidth <= 750 ? { height: 100 } : {}}
      >
        <Grid>
          {console.log(window.innerWidth)}
          {window.innerWidth >= 750 ? (
            <Grid.Row>
              <Grid.Column computer={1} tablet={1} mobile={2}>
                <h2 className="header">CMS</h2>
              </Grid.Column>
              <Grid.Column computer={3} tablet={1} mobile={1} />
              <Grid.Column computer={10} tablet={12} mobile={16}>
                <Form
                  onSubmit={() => {
                    this.props.set(
                      { loading: true, products: [], page: 1 },
                      () => this.props.getProducts(this.props.getUri())
                    );
                  }}
                >
                  <Form.Field>
                    <Input
                      icon="search"
                      className="search"
                      placeholder="Search Products..."
                      value={this.props.search}
                      loading={this.props.loading && this.props.search !== ""}
                      onChange={e => {
                        this.props.set({ search: e.target.value }, () => {});
                      }}
                    />
                  </Form.Field>
                </Form>
              </Grid.Column>
              <Grid.Column computer={2}>
                <Popup
                  trigger={
                    <Button
                      onClick={() => this.setState({ open: !this.state.open })}
                      className="update_parent"
                    >
                      <Icon name="redo" />
                      Update
                    </Button>
                  }
                  content={"update category"}
                  position="bottom center"
                />
              </Grid.Column>
            </Grid.Row>
          ) : (
            <React.Fragment>
              <Grid.Row>
                <Grid.Column tablet={2} mobile={4}>
                  <h2 className="header">CMS</h2>
                </Grid.Column>
                <Grid.Column tablet={11} mobile={7} />
                <Grid.Column tablet={2} mobile={4}>
                  <Popup
                    trigger={
                      <Button
                        onClick={() =>
                          this.setState({ open: !this.state.open })
                        }
                        className="update_parent"
                      >
                        <Icon name="redo" />
                        Update
                      </Button>
                    }
                    content={"update category"}
                    position="bottom center"
                  />
                </Grid.Column>
                <Grid.Column tablet={1} mobile={1} />
              </Grid.Row>

              <Grid.Row>
                <Grid.Column tablet={2} mobile={2} />
                <Grid.Column
                  tablet={12}
                  mobile={12}
                  style={{ textAlign: "center" }}
                >
                  <Form
                    style={{ marginTop: -45 }}
                    onSubmit={() => {
                      this.props.set(
                        { loading: true, products: [], page: 1 },
                        () => this.props.getProducts(this.props.getUri())
                      );
                    }}
                  >
                    <Form.Field>
                      <Input
                        icon="search"
                        className="search"
                        placeholder="Search Products..."
                        value={this.props.search}
                        loading={this.props.loading && this.props.search !== ""}
                        onChange={e => {
                          this.props.set({ search: e.target.value }, () => {});
                        }}
                      />
                    </Form.Field>
                  </Form>
                </Grid.Column>
                <Grid.Column tablet={2} mobile={2} />
              </Grid.Row>
            </React.Fragment>
          )}
        </Grid>
      </div>
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
