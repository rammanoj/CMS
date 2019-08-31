import React from "react";
import {
  Card,
  Placeholder,
  Grid,
  Image,
  Icon,
  Form,
  Button,
  Dropdown,
  Pagination,
  Breadcrumb
} from "semantic-ui-react";
import Nav from "./nav";
import { productList, BrandList, CategoryList } from "./api";
import { Fab, Action } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.css";
import ProductDetailView from "./detail";
import AddItems from "./add";
import MessageDisplay from "./message";

class Product extends React.Component {
  /**
   * Main Product class, render all the products and display in form of Grid
   */
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      product: false,
      loading: true,
      search: "",
      page: 1,
      filters_load: 0,
      pages: 0,
      brand: false,
      category: false,
      brands: [],
      categories: [],
      tree: [],
      add: false,
      message: {
        update: false,
        type: 1,
        message: "",
        trigger: false
      }
    };
  }

  set = obj => {
    /**
     * Update the state from child components
     * @param {object} obj Parameters of the current state (to be updated).
     */
    this.setState(obj);
  };

  componentDidMount = () => {
    // get products.
    this.getProducts(productList);

    // get Brands
    fetch(BrandList, {
      method: "GET"
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          brands: this.format(response.results),
          filters_load: this.state.filters_load + 1,
          loading: this.state.filters_load == 2 ? false : true
        });
      });

    // get Categories
    fetch(CategoryList, {
      method: "GET"
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          categories: this.format(response.results),
          filters_load: this.state.filters_load + 1,
          loading: this.state.filters_load == 2 ? false : true
        });
      });
  };

  getProducts = uri => {
    /**
     * Get the products from the API
     * @param {string} uri URL to be fetched.
     */
    this.setState({ loading: true, products: [] });
    fetch(uri, {
      method: "GET"
    })
      .then(response => response.json())
      .then(object => {
        this.callback(object);
      });
  };

  format = data => {
    /**
     * Fromat the fetched Data
     * @param {object} data data to be formatted.
     */
    let out = [];
    for (let i in data) {
      out.push({
        key: i,
        value: data[i].name,
        text: data[i].name
      });
    }
    return out;
  };

  callback = response => {
    /**
     * Callback function to getProducts()
     * @param {object} response Response object from the APi
     */
    if (this.state.filters_load > 2) {
      this.setState({
        loading: false,
        products: response.results,
        pages: Math.ceil(response.count / 10),
        tree:
          response.categories !== undefined ? response.categories.reverse() : []
      });
    } else {
      this.setState({
        loading: this.state.filters_load === 2 ? false : true,
        products: response.results,
        pages: Math.ceil(response.count / 10),
        filters_load: this.state.filters_load + 1
      });
    }
  };

  getUri = () => {
    /**
     * Create the URI to be fetched (to get the products).
     */
    let uri = productList;
    if (this.state.brand !== false) {
      uri += "?brand=" + this.state.brand;
    }
    if (this.state.category !== false) {
      if (uri.indexOf("?") === -1) {
        uri += "?category=" + this.state.category;
      } else {
        uri += "&category=" + this.state.category;
      }
    }

    if (this.state.search !== "") {
      if (uri.indexOf("?") === -1) {
        uri += "?search=" + this.state.search;
      } else {
        uri += "&search=" + this.state.search;
      }
    }

    return uri;
  };

  render = () => {
    return (
      <React.Fragment>
        <Nav
          message={this.state.message}
          category={this.state.categories}
          set={this.set}
          brand={this.state.brands}
        />
        <MessageDisplay
          update={this.state.message.update}
          trigger={this.state.message.trigger}
          message={this.state.message.message}
          type={this.state.message.type}
        />
        <Fab
          icon={<Icon name="plus" style={{ marginLeft: 4 }} />}
          mainButtonStyles={{ background: "#36c" }}
          alwaysShowTitle={false}
        >
          <Action
            text="Product"
            style={{ background: "#36c" }}
            onClick={() => this.setState({ add: 0 })}
          >
            <Icon name="box" />
          </Action>
          <Action
            style={{ background: "#36c" }}
            text="Brand"
            onClick={() => this.setState({ add: 1 })}
          >
            <Icon name="tag" />
          </Action>
          <Action
            style={{ background: "#36c" }}
            text="Category"
            onClick={() => this.setState({ add: 2 })}
          >
            <Icon name="bars" />
          </Action>
        </Fab>
        {this.state.product !== false ? (
          <ProductDetailView product={this.state.product} set={this.set} />
        ) : (
          ""
        )}
        {this.state.add !== false ? (
          <AddItems
            add={this.state.add}
            brand={this.state.brands}
            category={this.state.categories}
            product={this.state.products}
            set={this.set}
            message={this.state.message}
          />
        ) : (
          ""
        )}
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
                  <Form
                    onSubmit={() => {
                      this.setState(
                        { loading: true, products: [], page: 1 },
                        () => this.getProducts(this.getUri())
                      );
                    }}
                  >
                    <Form.Input
                      icon="search"
                      style={{ width: "60%" }}
                      placeholder="Search Products..."
                      value={this.state.search}
                      loading={this.state.loading && this.state.search !== ""}
                      onChange={e => {
                        this.setState({ search: e.target.value });
                      }}
                    />
                  </Form>
                </div>
              </div>
              <Card className="filters">
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column width={6}>
                      <Dropdown
                        selectOnBlur={false}
                        placeholder="Filter by Brand"
                        onChange={(e, obj) =>
                          this.setState({ brand: obj.value })
                        }
                        value={
                          this.state.brand !== false ? this.state.brand : ""
                        }
                        allowAdditions={true}
                        fluid
                        search
                        selection
                        options={this.state.brands}
                        icon=""
                      />
                    </Grid.Column>
                    <Grid.Column width={6}>
                      <Dropdown
                        selectOnBlur={false}
                        onChange={(e, obj) =>
                          this.setState({ category: obj.value })
                        }
                        placeholder="Filter by category"
                        fluid
                        allowAdditions={true}
                        value={
                          this.state.category !== false
                            ? this.state.category
                            : ""
                        }
                        search
                        selection
                        options={this.state.categories}
                        icon=""
                      />
                    </Grid.Column>
                    <Grid.Column width={2}></Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card>
              <Button onClick={() => this.getProducts(this.getUri())}>
                Apply
              </Button>

              {this.state.loading ? (
                <React.Fragment>
                  <div style={{ marginTop: "4vh" }}>
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width={4}>
                          <Card>
                            <Card.Content>
                              <Placeholder>
                                <Placeholder.Image square />
                              </Placeholder>
                            </Card.Content>
                          </Card>
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <Card>
                            <Card.Content>
                              <Placeholder>
                                <Placeholder.Image square />
                              </Placeholder>
                            </Card.Content>
                          </Card>
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <Card>
                            <Card.Content>
                              <Placeholder>
                                <Placeholder.Image square />
                              </Placeholder>
                            </Card.Content>
                          </Card>
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <Card>
                            <Card.Content>
                              <Placeholder>
                                <Placeholder.Image square />
                              </Placeholder>
                            </Card.Content>
                          </Card>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {this.state.tree.length !== 0 ? (
                    <Breadcrumb>
                      {this.state.tree.map((obj, index) => (
                        <React.Fragment>
                          <Breadcrumb.Section
                            key={index}
                            link
                            onClick={() =>
                              this.setState({ category: obj }, () =>
                                this.getProducts(this.getUri())
                              )
                            }
                          >
                            {obj}
                          </Breadcrumb.Section>
                          <Breadcrumb.Divider icon="right angle" />
                        </React.Fragment>
                      ))}
                    </Breadcrumb>
                  ) : (
                    ""
                  )}
                  {this.state.products.length !== 0 ? (
                    <div className="gallary">
                      {this.state.products.map((obj, index) => (
                        <Card
                          key={index}
                          className="product"
                          onClick={() => this.setState({ product: obj })}
                        >
                          <Image
                            src={obj.image}
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
                  ) : (
                    <div style={{ textAlign: "center", marginTop: "5vh" }}>
                      <Icon name="frown outline" size="massive" />
                      <h2>No products found!!!</h2>
                    </div>
                  )}
                </React.Fragment>
              )}

              {[0, 1].indexOf(this.state.pages) === -1 &&
              !this.state.loading ? (
                <div style={{ textAlign: "center" }}>
                  <Pagination
                    style={{ marginTop: "4vh" }}
                    defaultActivePage={this.state.page}
                    onPageChange={(e, data) => {
                      this.setState({ page: data.activePage });
                      this.getProducts(
                        this.getUri() + "?page=" + data.activePage
                      );
                    }}
                    ellipsisItem={{
                      content: <Icon name="ellipsis horizontal" />,
                      icon: true
                    }}
                    firstItem={{
                      content: <Icon name="angle double left" />,
                      icon: true
                    }}
                    lastItem={{
                      content: <Icon name="angle double right" />,
                      icon: true
                    }}
                    prevItem={{
                      content: <Icon name="angle left" />,
                      icon: true
                    }}
                    nextItem={{
                      content: <Icon name="angle right" />,
                      icon: true
                    }}
                    totalPages={this.state.pages}
                  />
                </div>
              ) : (
                ""
              )}
            </Grid.Column>
            <Grid.Column width={1}></Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  };
}

export default Product;
