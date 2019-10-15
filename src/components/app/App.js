import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { signOutUser } from "../../redux/redux-token-auth-config";
import { ToastContainer } from "react-toastify";
import Navigation from "../company/navigation";
import AdminApp from "../admin/adminApp";
import { apiSubDomain, pathName } from "../../utils/api-config";
import { css } from '@emotion/core';
import FadeLoader from 'react-spinners/FadeLoader';

import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./App.css";


const override = css`
  position: relative;
  font-size: 0;
  left: 20px;
  top: 270px;
  width: 81px;
  height: 115px;
  display: block;
  margin: 0 auto;
`;

function App({ isSignedIn, isLoading, signOutUser, isSuperAdmin }) {
  if (isLoading) {
    return (
           <div className='sweet-loading'>
                  <FadeLoader
                    css={override}
                    sizeUnit={"px"}
                    size={150}
                    color={'#05b4ac'}
                    loading={true}
                  />
            </div> 
    );
  } else if (apiSubDomain === "www" || pathName === "/admin") {
    if (isSignedIn && !isSuperAdmin) {
      signOutUser();
    }
    return <AdminApp />;
  }
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Navigation />
      </div>
    </Router>
  );
}

function mapStateToProps(state) {
  const {
    isSignedIn,
    isLoading,
    attributes
  } = state.reduxTokenAuth.currentUser;
  const { isSuperAdmin } = attributes;
  return { isSignedIn, isLoading, isSuperAdmin };
}

export default connect(
  mapStateToProps,
  { signOutUser }
)(App);
