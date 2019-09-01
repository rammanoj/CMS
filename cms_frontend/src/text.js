import React from "react";
import { Random, Wave } from "react-animated-text";

class LoadingText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pause_1: false,
      pause_2: true,
      pause_3: true
    };
  }

  componentDidMount = () => {
    setTimeout(() => this.setState({ pause_1: true, pause_2: false }), 2000);
    setTimeout(() => this.setState({ pause_2: true, pause_3: false }), 3000);
  };

  render = () => {
    let { pause_1: p1, pause_3: p3, pause_2: p2 } = this.state;
    document.body.style.background = "linear-gradient(#36c, #eaf3ff)";
    return (
      <React.Fragment>
        <div className="load_text">
          <h1>
            {p1 ? (
              <span>Welcome to</span>
            ) : (
              <Random
                text={"Welcome to"}
                iterations={1}
                effectChange={0.1}
                effectDirection="up"
                effect={"verticalFadeIn"}
              />
            )}
          </h1>
          <h1>
            {p2 & p1 ? (
              "CMS"
            ) : (
              <Random
                text={"CMS"}
                iterations={1}
                effectChange={0.1}
                effect={"verticalFadeIn"}
                paused={p2}
              />
            )}
          </h1>
          <h1>
            <Random
              text={"Catelogue Management System"}
              iterations={1}
              effectChange={0.1}
              effect={"verticalFadeIn"}
              paused={p3}
            />
          </h1>
        </div>
      </React.Fragment>
    );
  };
}

export default LoadingText;
