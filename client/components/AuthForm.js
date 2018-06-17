import "./AuthForm.scss";
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { auth } from "../data/reducer";
import { Link } from "react-router-dom";

/**
 * COMPONENT
 */
const AuthForm = props => {
  const { name, displayName, handleSubmit, error } = props;

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
          <form className="auth__form" onSubmit={handleSubmit} name={name}>
            <div className="form-group row">
              <a href="/auth/google" target="_blank">
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
                  border: "1px solid black",
                  borderWidth: "0 0 1px 0",
                  width: "45%"
                }}
              />
              <span style={{ marginTop: "-4px" }}>or</span>
              <div
                style={{
                  border: "1px solid black",
                  borderWidth: "0 0 1px 0",
                  width: "45%"
                }}
              />
            </div>
            {name === "signup" && (
              <div className="form-group row">
                <div style={{ margin: "0 1% 0 0", width: "48%" }}>
                  <label htmlFor="firstName">
                    <small>First Name</small>
                  </label>
                  <input
                    name="firstName"
                    className="form-control"
                    type="text"
                  />
                </div>
                <div style={{ margin: "0 0 0 1%", width: "48%" }}>
                  <label htmlFor="lastName">
                    <small>Last Name</small>
                  </label>
                  <input
                    name="lastName"
                    className="form-control"
                    type="lastName"
                  />
                </div>
              </div>
            )}
            {name === "signup" && (
              <div className="form-group row">
                <label htmlFor="organization">
                  <small>Organization</small>
                </label>
                <input
                  name="organization"
                  className="form-control"
                  type="text"
                />
              </div>
            )}
            <div className="form-group row">
              <label htmlFor="email">
                <small>Email</small>
              </label>
              <input name="email" className="form-control" type="text" />
            </div>
            <div className="form-group row">
              <label htmlFor="password">
                <small>Password</small>
              </label>
              <input name="password" className="form-control" type="password" />
            </div>
            <div className="form-group row auth-form__submit-btn-container">
              <button className="btn btn-outline-primary" type="submit">
                {displayName}
              </button>
            </div>
            {error && error.response && <div> {error.response.data} </div>}
          </form>
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
              {name === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}
              <Link
                className="btn__sign-in"
                to={`/${name === "signup" ? "login" : "signup"}`}
              >
                {name === "signup" ? "Log in" : "Sign up"}
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
};

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: "login",
    displayName: "Login",
    error: state.data.user.error
  };
};

const mapSignup = state => {
  return {
    name: "signup",
    displayName: "Sign Up",
    error: state.data.user.error
  };
};

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const email = evt.target.email.value;
      const password = evt.target.password.value;
      var userInfo =
        formName === "login"
          ? { email, password }
          : {
              email,
              password,
              first_name: evt.target.firstName.value,
              last_name: evt.target.lastName.value,
              organization: evt.target.organization.value
            };
      dispatch(auth(userInfo, formName));
    }
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
};
