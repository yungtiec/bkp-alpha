import "./ScoreWidget.scss";
import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

const SCORE_AND_ASSESSMENT = [
  {
    label: "-",
    value: NaN,
    assessment: "Not applicable"
  },
  {
    label: 0,
    value: 0,
    assessment: "Red flag"
  },
  {
    label: 1,
    value: 1,
    assessment: "Red flag"
  },
  {
    label: 2,
    value: 2,
    assessment: "Red flag"
  },
  {
    label: 3,
    value: 3,
    assessment: "Poor"
  },
  {
    label: 4,
    value: 4,
    assessment: "Poor"
  },
  {
    label: 5,
    value: 5,
    assessment: "Present but lacking"
  },
  {
    label: 6,
    value: 6,
    assessment: "Present but lacking"
  },
  {
    label: 7,
    value: 7,
    assessment: "Good"
  },
  {
    label: 8,
    value: 8,
    assessment: "Good"
  },
  {
    label: 9,
    value: 9,
    assessment: "Very good"
  },
  {
    label: 10,
    value: 10,
    assessment: "Very good"
  }
];

const renderUnit = props => (
  <div
    className={`score-widget__unit ${props.currentValue === props.value &&
      "is-focus"}`}
    onClick={() => props.onChange(props.value)}
  >
    <div data-tip data-for={`score-widget__unit-${props.value}`}>
      {props.label}
    </div>
    <ReactTooltip id={`score-widget__unit-${props.value}`} type="light">
      <span>{props.assessment}</span>
    </ReactTooltip>
  </div>
);

var ScoreWidget = ({ value, onChange }) => {
  return (
    <div className="wizard__score-widget d-flex">
      {SCORE_AND_ASSESSMENT.map(props =>
        renderUnit({
          ...props,
          onChange,
          currentValue: value
        })
      )}
    </div>
  );
};

ScoreWidget.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false
};

if (process.env.NODE_ENV !== "production") {
  ScoreWidget.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  };
}

export default ScoreWidget;
