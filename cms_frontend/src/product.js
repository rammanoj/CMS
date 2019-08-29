import React from "react";
import {
  Card,
  Placeholder,
  Grid,
  Image,
  Icon,
  Transition,
  Input,
  Button,
  Dropdown
} from "semantic-ui-react";
import Nav from "./nav";
import { productList, images } from "./api";
import { Fab, Action } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.css";

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      product: "",
      loading: true,
      search: "",
      filters: false
    };
  }

  componentDidMount = () => {
    this.getProducts(productList);
  };

  getProducts = uri => {
    fetch(uri, {
      method: "GET"
    })
      .then(response => response.json())
      .then(object => {
        this.callback(object);
      });
  };

  callback = response => {
    this.setState({
      loading: false,
      products: response.results
    });
  };

  render = () => {
    let rows = [];
    for (let i = 0; i < 8; i++) {
      rows.push(
        <Placeholder fluid className="wide">
          <Placeholder.Line style={{ background: "#f8f9fa" }} />
        </Placeholder>
      );
    }

    return (
      <React.Fragment>
        <Nav message={1} />

        <Fab
          icon={<Icon name="plus" style={{ marginLeft: 4 }} />}
          mainButtonStyles={{ background: "#36c" }}
          alwaysShowTitle={false}
        >
          <Action
            text="Product"
            style={{ background: "#36c" }}
            onClick={() => {}}
          >
            <Icon name="box" />
          </Action>
          <Action
            style={{ background: "#36c" }}
            text="Brand"
            onClick={() => {}}
          >
            <Icon name="tag" />
          </Action>
          <Action
            style={{ background: "#36c" }}
            text="Category"
            onClick={() => {}}
          >
            <Icon name="bars" />
          </Action>
        </Fab>

        <Grid>
          <Grid.Row>
            <Grid.Column width={1}></Grid.Column>
            <Grid.Column width={14}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    marginTop: "5vh",
                    width: "100%",
                    display: "inline-block"
                  }}
                >
                  <Input
                    icon="search"
                    style={{ width: "60%" }}
                    placeholder="Search Products..."
                    value={this.state.search}
                    onChange={e => this.setState({ search: e.target.valyue })}
                  />
                  <Button
                    icon="options"
                    onClick={() =>
                      this.setState({ filters: !this.state.filters })
                    }
                  ></Button>
                </div>
              </div>
              <Transition
                animation="fade"
                duration="500"
                visible={this.state.filters}
              >
                <Card className="filters">
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={2}></Grid.Column>
                      <Grid.Column width={6}>
                        <Dropdown
                          placeholder="Filter by Brand"
                          fluid
                          search
                          selection
                          options={[]}
                          icon=""
                        />
                      </Grid.Column>
                      <Grid.Column width={6}>
                        <Dropdown
                          placeholder="Filter by category"
                          fluid
                          search
                          selection
                          options={[]}
                          icon=""
                        />
                      </Grid.Column>
                      <Grid.Column width={2}></Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card>
              </Transition>
              {this.state.loading ? (
                <React.Fragment>
                  <div style={{ marginTop: "15vh" }}></div>
                  {rows}
                </React.Fragment>
              ) : (
                ""
              )}

              <Transition
                animation="fade"
                duration="500"
                visible={!this.state.loading}
              >
                <div className="gallary">
                  {this.state.products.map((obj, index) => (
                    <Card key={index} className="product">
                      <Image
                        src={images[index % 10]}
                        style={{ height: "auto", width: "auto" }}
                        wrapped
                      />
                      <Card.Content>
                        <Card.Header>{obj.name}</Card.Header>
                        <Card.Meta style={{ marginTop: 10 }}>
                          <Icon name="tag" />
                          {obj.brand}
                        </Card.Meta>
                      </Card.Content>
                      <Card.Content extra>
                        <span style={{ paddingTop: 5, paddingBottom: 5 }}>
                          Category: {obj.category}
                        </span>
                      </Card.Content>
                    </Card>
                  ))}
                </div>
              </Transition>
            </Grid.Column>
            <Grid.Column width={1}></Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  };
}

export default Product;
