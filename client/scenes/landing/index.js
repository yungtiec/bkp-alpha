import "./index.css";
import React, { Component } from "react";
import { Link } from "react-router-dom"

export default ({ user }) => (
  <div className="landing">
    <header className="masthead">
      <nav className="navbar navbar-expand-lg navbar-light" id="mainNav">
        <div className="container">
          <a
            className="navbar-brand js-scroll-trigger"
            href="https://thebkp.com/"
          />
          <button
            className="navbar-toggler navbar-toggler-right d-none"
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            Menu
            <i className="fa fa-bars" />
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="projects">View Framework</Link>
              </li>
              <li className="nav-item">
                <Link to="login">Log In</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container h-fill">
        <div className="row">
          <div className="col-lg-12 my-auto">
            <div className="header-content mx-auto">
              <h5 className="header-title mb-5">
                Help The Brooklyn Project roll out the first official release of
                the Consumer Token Framework, the premier community-driven
                framework to promote transparency and accountability in the
                blockchain.
              </h5>
              <div className="row">
                <div className="col-lg-12 header-text">
                  <p>
                    As a registered Contributor, you will take part in
                    constructive debate about the pros and cons of our approach
                    and help shape a self-regulated future for token projects by
                    sharing suggestions for improvements of the Framework.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 my-auto">
                  <Link class="btn btn-landing btn-xl" to="signup">Sign Up</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section className="framework" id="framework">
      <div className="container">
        <div className="row mb-3">
          <div className="col-md-12">
            <h2>How does it work?</h2>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-sm-12">
            <p>
              As a registered member of our community, your contributions will
              be recorded and evaluated by other community members. Exceptional
              contributions may be rewarded with acknowledgements in the final
              release of the Framework. You can provide feedback directly by
              using the BKP’s proprietary Annotator App. By registering you
              agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </section>
    <footer>
      <div className="container">
        <img src="assets/consensys-logo-white-transparent.png" />
      </div>
    </footer>
  </div>
);
