import React from "react";
import "../Styles/header.css";
import { withRouter } from "react-router-dom";
import GoogleLogin from "react-google-login";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "antiquewhite",
    border: "1px solid brown",
  },
};

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoginModalIsOpen: false,
      isLoggedIn: false,
      loggedInUser: undefined,
    };
  }
  handleNavigate = () => {
    this.props.history.push("/");
  };

  handleLogin = () => {
    this.setState({ isLoginModalIsOpen: true });
  };

  responseGoogle = (response) => {
    this.setState({
      loggedInUser: response.profileObj.name,
      isLoggedIn: true,
      isLoginModalIsOpen: false,
    });
  };

  handlelogOut = () => {
    this.setState({ isLoggedIn: false, loggedInUser: undefined });
  };

  render() {
    const { isLoginModalIsOpen, isLoggedIn, loggedInUser } = this.state;
    return (
      <div className="header">
        <div className="headerlogo" onClick={this.handleNavigate}>
          e!
        </div>
        {isLoggedIn ? (
          <div className="loginblock">
            <div className="headerlogin">{loggedInUser}</div>
            <div className="headeraccount" onClick={this.handlelogOut}>
              Logout
            </div>
          </div>
        ) : (
          <div className="loginblock">
            <div className="headerlogin" onClick={this.handleLogin}>
              Login
            </div>
            <div className="headeraccount">Create an account</div>
          </div>
        )}
        <Modal isOpen={isLoginModalIsOpen} style={customStyles}>
          <div>
            <GoogleLogin
              clientId="848525729973-1bd1tojc9944p4pv98u8rdhimas09jog.apps.googleusercontent.com"
              buttonText="Continue with google"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Header);
