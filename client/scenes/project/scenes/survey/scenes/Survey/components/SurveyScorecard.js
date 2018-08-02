import React, { Component } from "react";
import { Element } from "react-scroll";
import { keys, capitalize } from "lodash";

export default ({ scorecard, parent }) => (
  <Element
    name="qna-scorecard"
    ref={el => (parent["qna-scorecard"] = el)}
    key="qna-scorecard"
  >
    <div className="qna__container">
      <div>
        <div className="qna__question">
          <h3>consumer token framework scorecard</h3>
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
                  {keys(scorecard).map(principleKey => {
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
