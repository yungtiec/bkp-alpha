import React, { Component } from "react";
import { Element } from "react-scroll";
import { keys, capitalize } from "lodash";

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

export default ({ scorecard, parent }) => (
  <Element
    name="qna-scorecard"
    ref={el => (parent["qna-scorecard"] = el)}
    key="qna-scorecard"
  >
    <div className="qna__container">
      <div>
        <div className="qna__question">
          <h3>Consumer token framework scorecard</h3>
        </div>
        <div className="qna__answer-container">
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
                    var principle = capitalize(principleKey.replace(/_/g, " "));
                    return (
                      <tr>
                        <td className="text-left">{principle}</td>
                        <td className="text-left">{scorecard[principleKey]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Element>
);
