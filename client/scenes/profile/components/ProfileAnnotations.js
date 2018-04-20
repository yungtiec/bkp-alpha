import React from "react";
import { Link } from "react-router-dom";
import { groupBy, keys, isEmpty } from "lodash";
import moment from "moment";
import { ProjectSymbolBlueBox, AnnotationMain } from "../../../components";
import history from "../../../history";

export default props => {
  const groupByUri = groupBy(props.annotations, "uri");
  if (isEmpty(groupByUri))
    return (
      <p class="profile-subroute__empty">You haven't made any annotation yet</p>
    );
  return (
    <div className="profile-subroute">
      {keys(groupByUri).map((uri, i) => {
        const annotations = groupByUri[uri];
        const uriFragments = uri.substring(window.origin.length + 1).split("/");
        const projectSymbol = uriFragments[1];
        const survey = `${uriFragments[2]} ${uriFragments[3]}`;
        const path = uri.replace(window.origin, "");
        return (
          <div
            className="profile-annotation__uri"
            key={`profile-annotation__uri-${i}`}
          >
            <div>
              <ProjectSymbolBlueBox name={`${projectSymbol}`} />
              <span style={{ marginLeft: "5px" }}>{survey}</span>
            </div>
            {annotations.map(annotation => (
              <AnnotationMain
                key={`profile__annotation-main--${annotation.id}`}
                annotation={annotation}
                path={path}
              >
                <a
                  key={`profile__annotation-main--${annotation.id}`}
                  className="see-in-context"
                  onClick={() =>
                    history.push(
                      `${path}/question/${
                        annotation.survey_question_id
                      }/annotation/${annotation.id}`
                    )
                  }
                >
                  {annotation.reviewed !== "spam" && "see in context"}
                </a>
              </AnnotationMain>
            ))}
          </div>
        );
      })}
    </div>
  );
};
