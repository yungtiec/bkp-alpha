import React from "react";
import { ListRow } from "../../../components";
import { keys } from "lodash";
import { Link } from 'react-router-dom'

export default (projectId, project) => {
  return (
    <ListRow className="project-card" rowId={projectId} onClick>
      <div className="project-custom">
        <div className="project__block">
          <div className="project__action--upper">
            <i className="fas fa-star" />
          </div>
          <div className="project__header">
            <p>{project.name}</p>
            <p className="project__ticker">({project.symbol})</p>
          </div>
          <div className="project__description">{project.description}</div>
          <div className="project__action--bottom">
            <Link to={`/project/${project.symbol}`}>
              <div className="project__more">
                browse surveys
                <i className="fas fa-long-arrow-alt-right" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ListRow>
  );
};
