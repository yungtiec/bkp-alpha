import "./ScoreInput.scss";
import { withFormsy } from "formsy-react";
import React from "react";
import autoBind from "react-autobind";

class ScoreInput extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  changeValue(event) {
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    // Important: Don't skip this step. This pattern is required
    // for Formsy to work.
    this.props.setValue(event.currentTarget.value);
  }

  render() {
    // An error message is returned only if the component is invalid
    var errorMessage = this.props.getErrorMessage();

    return (
      <div className="score-input__container">
        <div className="d-flex justify-content-between score-input__div">
          <span>{this.props.label}</span>
          <input
            className="score-input"
            onChange={this.changeValue}
            type="Number"
            className=""
            value={this.props.getValue() || ""}
          />
        </div>
        <span className="text-danger score-input__error">{errorMessage}</span>
      </div>
    );
  }
}
export default withFormsy(ScoreInput);
