import React from "react";
import { productDetail } from "./api";
import {
  Modal,
  Grid,
  Image,
  Icon,
  Placeholder,
  Card,
  Label,
  Message
} from "semantic-ui-react";
import productImage from "./img/product.png";

class ProductDetailView extends React.Component {
  /**
   * Show the details of the product.
   */
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      open: false,
      loading: true
    };
  }

  componentDidMount = () => {
    this.getProduct();
    this.setState({ open: true });
  };

  getProduct = () => {
    /**
     * Get All the details of the prodct from the APi
     */
    fetch(productDetail + this.props.product.pk + "/", {
      method: "GET"
    })
      .then(resp => resp.json())
      .then(obj => this.setState({ product: obj, loading: false }));
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.product !== this.props.product) {
      this.getProduct();
    }
  };

  render = () => {
    let { product: p } = this.state;
    return (
      <React.Fragment>
        <Modal
          className="add_modal"
          open={this.state.open}
          closeIcon={true}
          onClose={() => {
            this.setState({ open: false });
            this.props.set({ product: false }, () => {});
          }}
          centered
          size="small"
        >
          <Modal.Content>
            <Grid>
              <Grid.Row>
                {this.state.loading ? (
                  <React.Fragment>
                    <Grid.Column width={8}>
                      <Placeholder>
                        <Placeholder.Image />
                      </Placeholder>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Placeholder>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                      </Placeholder>
                    </Grid.Column>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Grid.Column
                      width={8}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Card style={{ height: "auto", width: "auto" }}>
                        <Image
                          src={p.image === null ? productImage : p.image}
                          style={{ margin: 10 }}
                        />
                      </Card>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <h2>{p.name}</h2>
                      <Message info>
                        <p>
                          <Icon name="tag" color="teal" /> {p.brand}
                        </p>
                        <p>
                          <b>Category:</b> {p.category}
                        </p>
                        <h4>Specs</h4>
                        {p.spec.map((obj, index) => (
                          <Label
                            as="a"
                            color="teal"
                            key={index}
                            icon
                            style={{ marginTop: 2 }}
                          >
                            <Icon
                              name="clipboard list"
                              style={{ marginRight: 5 }}
                            />
                            <b>{obj.key}</b>
                            <Label.Detail>{obj.value}</Label.Detail>
                          </Label>
                        ))}
                      </Message>
                    </Grid.Column>
                  </React.Fragment>
                )}
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  };
}

export default ProductDetailView;
