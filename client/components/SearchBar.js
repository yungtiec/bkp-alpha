import "./SearchBar.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import {
  updateSearchInput,
  clearSearchInput,
  getSearchInput
} from "../data/reducer";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleSearchInputOnChange(event) {
    if (event.target.value !== this.props.searchInput) {
      this.props.updateSearchInput(event.target.value);
    }
  }

  render() {
    const { handleSearchIconOnClick, setSearchBarRef } = this.props;

    return (
      <div className="box--search">
        <div className="box--left">
          <input
            ref={setSearchBarRef}
            type="text"
            onChange={this.handleSearchInputOnChange}
            placeholder="SEARCH FOR COMPANY OR TOKEN"
            className="header__search-input"
            value={this.props.searchInput}
          />
        </div>
        <div className="box--right">
          <div className="icon-container" onClick={handleSearchIconOnClick}>
            <i className="fas fa-times" />
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  searchInput: getSearchInput(state)
});

const actions = { updateSearchInput, clearSearchInput };

export default connect(mapState, actions)(SearchBar);
