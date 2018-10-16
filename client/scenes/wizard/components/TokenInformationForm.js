import React from "react";
import { Async } from "react-select";
import axios from "axios";
import autoBind from "react-autobind";

// render one item on the list
const MyItemView = function({ item }) {
  return (
    <div className="user-data">
      <div>{item.id}</div>
      <div>{item.name}</div>
    </div>
  );
};

export default class TokenInformationForm extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: undefined
    };
    autoBind(this);
  }

  loadOptions(input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return axios.get("/api/projects/search?q=" + input).then(res => {
      return { options: res.data.map(p => ({ value: p, label: p.name })) };
    });
  }

  onChange(option) {
    this.setState({
      value: option.value
    });
  }

  render() {
    return (
      <div>
        <Async
          name="form-field-name"
          loadOptions={this.loadOptions}
          onChange={this.onChange}
          value={this.state.value}
        />
        <div>
          <button onClick={this.props.next}>next</button>
          <button onClick={this.props.back}>back</button>
        </div>
      </div>
    );
  }
}
