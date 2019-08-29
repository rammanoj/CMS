import React from "react";
import { Menu, Button, Popup, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => (
    <Menu className="nav" secondary>
      <Menu.Item className="header" to="/" as={Link}>
        CMS
      </Menu.Item>
      <Menu.Item position="right">
        <Menu secondary>
          <Menu.Item>
            <Button
              className="docs"
              onClick={() => {
                var win = window.open("https://www.google.com", "_blank");
                win.focus();
              }}
            >
              <Icon name="book" />
              Docs
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Popup
              trigger={<Button icon="info"></Button>}
              position="bottom right"
              content={
                <div style={{ textAlign: "center" }}>
                  <h4>CMS</h4>
                  <p>
                    CMS is abbrevated as <b>Catalogue Management System.</b> It
                    displays different products to the customers along with
                    their brands, categories etc.
                  </p>
                </div>
              }
            />
          </Menu.Item>
        </Menu>
      </Menu.Item>
    </Menu>
  );
}

export default Nav;
