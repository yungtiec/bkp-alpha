import "./ProfileReplies.scss";
import React from "react";
import { Link } from "react-router-dom";
import { groupBy, keys } from "lodash";
import moment from "moment";
import { ProjectSymbolBlueBox } from "../../../components";
import history from "../../../history";
import Avatar from "react-avatar";

export default props => {
  const groupByUri = groupBy(props.replies, "uri");
  return (
    <div className="profile-subroute">
      {keys(groupByUri).map(uri => {
        const annotations = groupByUri[uri];
        const projectSymbol = uri.substring(22).split("/")[1];
        const path = uri.replace(window.location.origin, "");
        return (
          <div className="profile-annotation__uri">
            <ProjectSymbolBlueBox name={projectSymbol} />
            {annotations.map(annotation => (
              <div className="profile-annotation__main">
                <p className="profile-annotation__quote">{annotation.quote}</p>
                <div className="profile-annotation__parent">
                  <p className="profile-annotation__user">
                    <span>
                      <Avatar
                        name={`${annotation.parent.owner.first_name} ${
                          annotation.parent.owner.last_name
                        }`}
                        size={40}
                      />
                    </span>
                    <span>{moment(annotation.parent.createdAt).fromNow()}</span>
                  </p>
                  <p className="profile-annotation__comment">
                    {annotation.parent.comment}
                  </p>
                </div>
                <div className="profile-annotation__reply">
                  <p className="profile-annotation__user">
                    <span>you replied {moment(annotation.createdAt).fromNow()}</span>
                  </p>
                  <p className="profile-annotation__comment">
                    {annotation.comment}
                  </p>
                </div>
                <div className="profile-annotation__action--bottom">
                  <a
                    className="see-in-context"
                    onClick={() =>
                      history.push(
                        `${path}/question/${
                          annotation.survey_question_id
                        }/annotation/${annotation.id}`
                      )
                    }
                  >
                    see in context
                  </a>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
