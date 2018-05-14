import './index.scss'
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchAllProjects } from "../../data/projects/actions";
import { getAllProjects } from "../../data/projects/reducer";
import { ProjectCard } from './components'
import { ListView } from '../../components'
import autoBind from "react-autobind";

class ProjectList extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { projectsBySymbol, projectSymbolArr } = this.props

    return (
      <div className="main-container">
        <ListView
          viewClassName={"row entity-cards"}
          rowClassName={"col-md-12 entity-card__container"}
          rowsIdArray={projectSymbolArr}
          rowsById={projectsBySymbol}
          renderRow={ProjectCard}
        />
      </div>
    );
  }
}

const mapState = state => {
  const { projectsBySymbol, projectSymbolArr } = getAllProjects(state);
  return {
    projectsBySymbol,
    projectSymbolArr
  };
};

const actions = dispatch => {
  return {
    loadInitialData() {
      dispatch(fetchAllProjects());
    }
  };
};

export default connect(mapState, actions)(ProjectList);
