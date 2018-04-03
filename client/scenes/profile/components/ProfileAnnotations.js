import React from "react";
import { Link } from "react-router-dom";
import { groupBy, keys } from "lodash";
import moment from "moment";
import { ProjectSymbolBlueBox, AnnotationMain } from "../../../components";
import history from "../../../history";

export default props => {
  const groupByUri = groupBy(props.annotations, "uri");
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
              <AnnotationMain annotation={annotation} path={path} />
            ))}
          </div>
        );
      })}
    </div>
  );
};
