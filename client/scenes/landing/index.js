import "./index.css";
import React, { Component } from "react";
import { Link } from "react-router-dom";

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
              <h1 class="mb-5">
                A collaborative approach to support innovators and protect
                consumers on blockchains
              </h1>
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
                  <Link
                    class="btn btn-landing btn-xl"
                    to="project/BKP/survey/21"
                  >
                    View Framework
                  </Link>
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
              Recommended disclosures that provide a frame of reference for
              smart transparency.
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
      <div className="container">
        <img src="assets/consensys-logo-white-transparent.png" />
      </div>
    </footer>
  </div>
);
