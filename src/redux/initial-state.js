const initialState = {
  reduxTokenAuth: {
    currentUser: {
      isLoading: false,
      isSignedIn: false,
      isSuperAdmin: false,
      attributes: {
        name: null, // <-- Just an example. Attributes are whatever you specify in your cofig (below).
        role: null
      }
    }
  }
  // All your other state
};

export default initialState;
