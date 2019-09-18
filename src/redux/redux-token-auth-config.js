import { generateAuthActions } from "redux-token-auth";
import { apiUrl, apiSubDomain, pathName } from "../utils/api-config";

var authUrl =
  apiSubDomain === "www" || pathName === "/admin"
    ? apiUrl + "/admin_auth"
    : apiUrl + "/auth";
const config = {
  authUrl,
  userAttributes: {
    name: "name",
    imageUrl: "image",
    isSuperAdmin: "super_admin",
    role: "role"
  },
  userRegistrationAttributes: {
    name: "name",
    role: "role"
  }
};

const {
  registerUser,
  signInUser,
  signOutUser,
  verifyCredentials
} = generateAuthActions(config);

export { registerUser, signInUser, signOutUser, verifyCredentials };
