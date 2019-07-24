import React from "react";
import { Divider, Flag } from "semantic-ui-react";
import SiteHeader from "./SiteHeader";
const PageHeader = () => {
  return (
    <React.Fragment>
      <h3>
        <b>
          <Flag name="us" />
        </b>
        POS by DEVSINC
      </h3>
      <SiteHeader />

      <Divider />
    </React.Fragment>
  );
};

export default PageHeader;
