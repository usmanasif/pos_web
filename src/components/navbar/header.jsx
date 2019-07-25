import React from "react";
import { Divider, Flag } from "semantic-ui-react";
const Header = () => {
  return (
    <React.Fragment>
      <h3>
        <b>
          <Flag name="us" />
        </b>
        POS by DEVSINC
      </h3>
      <Divider />
    </React.Fragment>
  );
};

export default Header;
