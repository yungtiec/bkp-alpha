import "./Landing.scss";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../data/reducer";

const Landing = ({ user, logout }) => (
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

          <div>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                {!!user.id ? (
                  <a onClick={logout}>Log Out</a>
                ) : (
                  <Link
                    to={{
                      pathname: "/login",
                      state: { lastPath: "/project/BKP/document/1/version/2" }
                    }}
                  >
                    Log In
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container h-fill">
        <div className="row">
          <div className="col-lg-12 my-auto">
            <div className="header-content mx-auto">
              <h1 class="mb-5">
                A collaborative approach to support innovators and protect
                consumers on blockchains
              </h1>
              <div className="row">
                <div className="col-lg-12 header-text">
                  <p>
                    The Brooklyn Project is developing a Core Framework and
                    experimenting with a crypto-economic system to help consumer
                    token projects engage the community to build more trust,
                    cooperation, fairness, safety, and regulatory compliance
                    across the industry.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 my-auto">
                  <Link
                    class="btn btn-landing btn-xl"
                    to="project/BKP/document/1/version/2"
                  >
                    Collaborate on Framework
                  </Link>
                  <a
                    class="btn btn-landing btn-xl ml-2"
                    href="https://static1.squarespace.com/static/5a329be3d7bdce9ea2f3a738/t/5b9a09b50ebbe8e9409e291a/1536821696423/The+Brooklyn+Project%E2%80%94Framework+Version+1+09_06_18.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View pdf
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="framework" id="framework">
      <div class="container">
        <div class="row mb-3">
          <div class="col-md-12">
            <h2>The Core Framework consists of:</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-1 d-none d-md-block">
            <div class="text-baseline" />
          </div>
          <div class="col-sm-11">
            <p>
              10 Principles that serve as general, aspirational guideposts for
              projects.
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-1 d-none d-md-block">
            <div class="text-baseline" />
          </div>
          <div class="col-sm-11">
            <p>
              Detailed suggested practices that form a foundation for
              consumer-oriented behavior and community-driven collaboration.
            </p>
          </div>
        </div>
        <div class="row  mb-3">
          <div class="col-sm-1 d-none d-md-block">
            <div class="text-baseline" />
          </div>
          <div class="col-sm-11">
            <p>
              Recommended transparency goals that provide projects and their
              communities a frame of reference for smart, useful transparency
              practices.
            </p>
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-sm-12">
            <p>
              Crypto-economic systems form the backbone of blockchain
              technology. In the context of the Core Framework, a
              crypto-economic system will allow projects to apply to a registry
              that (1) signals whether a project is implementing the framework,
              and (2) invites the community to scrutinize their practices.
            </p>
            <p>
              The goal of this initiative is to build a vibrant community that
              collaborates with projects to solve their most urgent and
              difficult problems, and a signaling system to inform consumers and
              innovators when they may be treading into risky territory on
              public blockchains.
            </p>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-sm-12">
            <p>
              To collaborate with us, sign up
              <Link to="signup"> here.</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
    <footer>
      <div className="container d-flex flex-column align-items-center">
        <img src="assets/consensys-logo-white-transparent.png" />
        <div className="mt-5">
          <a
            href="https://tinyurl.com/y94wspyg"
            target="_blank"
            className="mr-4"
          >
            privacy policy
          </a>
          <a
            href="https://drive.google.com/open?id=1p4F4UVhCohifqb0R5WzfJ8R1nKJOahIV"
            target="_blank"
          >
            terms of use
          </a>
        </div>
      </div>
    </footer>
  </div>
);

const mapState = state => ({ user: state.data.user });

const actions = { logout };

export default connect(mapState, actions)(Landing);
