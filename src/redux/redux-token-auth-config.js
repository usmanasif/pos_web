import { generateAuthActions } from "redux-token-auth";
import {apiUrl} from "../utils/api-config";

var authUrl = apiUrl + '/auth'
const config = {
  authUrl,
  userAttributes: {
    name: "name",
    imageUrl: "image"
  },
  userRegistrationAttributes: {
    name: "name"
  }
};

const {
  registerUser,
  signInUser,
  signOutUser,
  verifyCredentials
} = generateAuthActions(config);

export { registerUser, signInUser, signOutUser, verifyCredentials };
