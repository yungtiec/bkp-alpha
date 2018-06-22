import "./index.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { auth } from "../../data/reducer";
import { Link } from "react-router-dom";
import { InputEmail, InputPassword, InputText } from "../index";
import Formsy from "formsy-react";

/**
 * COMPONENT
 */
class AuthForm extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = { canSubmit: false };
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  handleSubmit(authMethod, model) {
    const email = model.email;
    const password = model.password;
    var userInfo =
      authMethod === "login"
        ? { email, password }
        : {
            email,
            password,
            first_name: model.firstName,
            last_name: model.lastName,
            organization: model.organization
          };
    this.props.auth(userInfo, authMethod);
  }

  render() {
    const { authMethod, authMethodLabel, handleSubmit, error } = this.props;

    return (
      <div className="auth-page">
        <div className="auth-page__header">
          <div className="logo-tbp">
            <img
              width="120px"
              height="auto"
              className="logo__large"
              src="/assets/the-brooklyn-project-logo-white-transparent.png"
            />
          </div>
        </div>
        <div className="auth__form-wrapper">
          <div className="auth__form-contents">
            <Formsy
              className="auth__form"
              onValidSubmit={model => this.handleSubmit(authMethod, model)}
              name={authMethod}
              onValid={this.enableButton}
              onInvalid={this.disableButton}
            >
              <div className="form-group row">
                <a href="/auth/google">
                  <img
                    width="191px"
                    height="46px"
                    src="/assets/btn_google_signin_dark_normal_web.png"
                  />
                </a>
              </div>
              <div className="d-flex" style={{ margin: "0px -30px" }}>
                <div
                  style={{
                    border: "1px solid #c2c2c2",
                    borderWidth: "0 0 1px 0",
                    width: "45%"
                  }}
                />
                <span style={{ marginTop: "4px" }}>or</span>
                <div
                  style={{
                    border: "1px solid #c2c2c2",
                    borderWidth: "0 0 1px 0",
                    width: "45%"
                  }}
                />
              </div>
              {authMethod === "signup" && (
                <div className="form-group row">
                  <div style={{ margin: "0 1% 0 0", width: "49%" }}>
                    <label htmlFor="firstName">
                      <small>First Name</small>
                    </label>
                    <InputText name="firstName" required />
                  </div>
                  <div style={{ margin: "0 0 0 1%", width: "49%" }}>
                    <label htmlFor="lastName">
                      <small>Last Name</small>
                    </label>
                    <InputText name="lastName" required />
                  </div>
                </div>
              )}
              {authMethod === "signup" && (
                <div className="form-group row d-flex flex-column">
                  <label htmlFor="organization">
                    <small>Organization</small>
                  </label>
                  <InputText name="organization" />
                </div>
              )}
              <div className="form-group row d-flex flex-column">
                <label htmlFor="email">
                  <small>Email</small>
                </label>
                <InputEmail
                  name="email"
                  validations="isEmail"
                  validationError="This is not a valid email"
                  required
                />
              </div>
              <div className="form-group row d-flex flex-column">
                <label htmlFor="password">
                  <small>Password</small>
                </label>
                <InputPassword
                  name="password"
                  // validations="minLength:8"
                  // validationError="Password must have a minimum length of 8 characters"
                  required
                />
              </div>
              {authMethod === "signup" && (
                <div className="form-group row d-flex flex-column">
                  <label htmlFor="password">
                    <small>Confirm password</small>
                  </label>
                  <InputPassword
                    name="confirm"
                    validations="equalsField:password"
                    validationError="Password and confirmation password do not match"
                  />
                </div>
              )}
              <div className="form-group row auth-form__submit-btn-container">
                <button className="btn btn-outline-primary" type="submit">
                  {authMethodLabel}
                </button>
              </div>
              {error && error.response && <div>{error.response.data}</div>}
            </Formsy>
          </div>
          <div className="auth-form__form-footer">
            <div className="auth-form__form-footer__left">
              <nav>
                <a
                  href="https://thebrooklynproject.consensys.net/"
                  target="_blank"
                >
                  <span>About</span>
                </a>
              </nav>
            </div>
            <div className="auth-form__form-footer__right">
              <p id="no-acct-msg" className="message__has-account">
                {authMethod === "signup"
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <Link
                  className="btn__sign-in"
                  to={`/${authMethod === "signup" ? "login" : "signup"}`}
                >
                  {authMethod === "signup" ? "Log in" : "Sign up"}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="auth-page__footer">
          <div className="logo-consensys">
            <img
              width="100px"
              height="auto"
              className="logo__large"
              src="/assets/consensys-logo-white-transparent.png"
            />
          </div>
        </div>
      </div>
    );
  }
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    authMethod: "login",
    authMethodLabel: "Login",
    error: state.data.user.error
  };
};

const mapSignup = state => {
  return {
    authMethod: "signup",
    authMethodLabel: "Sign Up",
    error: state.data.user.error
  };
};

const mapDispatch = (dispatch, props) => {
  return {
    handleSubmit(model) {
      console.log(props);
      const email = model.email;
      const password = model.password;
      var userInfo =
        props.authMethod === "login"
          ? { email, password }
          : {
              email,
              password,
              first_name: model.firstName,
              last_name: model.lastName,
              organization: model.organization
            };
      dispatch(auth(userInfo, props.authMethod));
    }
  };
};

export const Login = connect(mapLogin, { auth })(AuthForm);
export const Signup = connect(mapSignup, { auth })(AuthForm);

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  authMethod: PropTypes.string.isRequired,
  authMethodLabel: PropTypes.string.isRequired,
  error: PropTypes.object
};
