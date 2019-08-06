import React from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import AdminAuth from "../authentication/adminAuth";
import CompanyHome from "../company/companyHome";
import "react-toastify/dist/ReactToastify.css";
import "../app/App.css";

function AdminApp({ isSignedIn, isLoading, isSuperAdmin }) {
  if (isLoading) {
    return (
      <img className="loading_img" src="./images/cart.gif" alt="Loading...." />
    );
  }
  return (
    <div className="App">
      <ToastContainer />
      {isSignedIn && isSuperAdmin && <CompanyHome />}
      {!isSignedIn && <AdminAuth />}
    </div>
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

export default connect(mapStateToProps)(AdminApp);
