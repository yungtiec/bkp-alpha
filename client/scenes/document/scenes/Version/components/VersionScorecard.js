import React, { Component } from "react";
import { Element } from "react-scroll";
import { keys, capitalize, isEqual } from "lodash";
import autoBind from "react-autobind";
import { ContentEditingContainer } from "./index";

const scorecardOrder = [
  "consumer_token_design",
  "project_governance_and_operation",
  "responsible_token_distribution",
  "use_of_token_distribution_proceeds",
  "token_inventory",
  "mitigation_of_conflicts_and_improper_trading",
  "token_safety_and_security",
  "marketing_practices",
  "protecting_and_empowering_consumers",
  "compliance_with_application_laws"
];

export default class VersionScorecard extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      scorecard: this.props.scorecard,
      editing: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.scorecard, prevProps.scorecard)) {
      this.setState({ scorecard: this.props.scorecard });
    }
  }

  handleEditOnClick() {
    this.setState({
      editing: true
    });
  }

  render() {
    const {
      user,
      scorecard,
      parent,
      editScorecard,
      versionMetadata
    } = this.props;
    return (
      <Element
        name="qna-scorecard"
        ref={el => (parent["qna-scorecard"] = el)}
        key="qna-scorecard"
      >
        <div className="qna__container mb-4">
          <div className="qna__question">
            <h3>Consumer token framework scorecard</h3>
          </div>
          <ContentEditingContainer
            otherClassNames="qna__answer-container"
            editing={this.state.editing}
            handleEditOnClick={this.handleEditOnClick}
            user={user}
            punditType="Disclosure"
            punditAction="Create"
            punditModel={{
              project: this.props.versionMetadata.document.project,
              disclosure: this.props.versionMetadata.document
            }}
          >
            {this.state.editing ? null : (
              <div className="markdown-body">
                <div className="qna__answer">
                  <table>
                    <thead>
                      <tr>
                        <th className="text-left">principle</th>
                        <th className="text-left">score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scorecardOrder.map(principleKey => {
                        var principle = capitalize(
                          principleKey.replace(/_/g, " ")
                        );
                        return (
                          <tr>
                            <td className="text-left">{principle}</td>
                            <td className="text-left">
                              {scorecard[principleKey]}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </ContentEditingContainer>
        </div>
      </Element>
    );
  }
}
