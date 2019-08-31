import React, { Component, Fragment } from "react";
import { Transition, Message } from "semantic-ui-react";

export default class MessageDisplay extends Component {
  /**
   * Display Success / Error messages.
   */
  constructor(props) {
    super(props);
    this.state = {
      trigger: false,
      update: false
    };
    this.timeout = false;
  }

  componentDidUpdate = (prevProps, presState) => {
    if (prevProps.update !== this.props.update) {
      if (this.timeout !== false) {
        clearTimeout(this.timeout);
      }
      this.setState(
        {
          update: !this.state.update,
          trigger: this.props.trigger
        },
        () => {
          this.timeout = setTimeout(
            () => this.setState({ trigger: false }),
            7000
          );
        }
      );
    }
  };

  handleDismiss = () => {
    /**
     * Dismiss the Message onclicking (X)s
     */
    this.setState({ trigger: false, message: "", type: 1 });
    clearTimeout(this.timeout);
  };

  render = () => {
    return (
      <Fragment>
        <Transition
          animation="scale"
          duration={400}
          visible={this.state.trigger}
        >
          <Message
            success={this.props.type === 0}
            negative={this.props.type === 1}
            id="messages"
            onDismiss={this.handleDismiss}
            header={this.props.type === 1 ? "Error" : "Success"}
            content={this.props.message}
          />
        </Transition>
      </Fragment>
    );
  };
}
