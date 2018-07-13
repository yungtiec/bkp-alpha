import React from "react";
import { ListRow } from "../components";
import { keys } from "lodash";
import { Link } from "react-router-dom";

export default (projectId, project) => {
  return (
    <ListRow className="entity-card" rowId={projectId} onClick>
      <Link to={`/project/${project.symbol}`}>
        <div className="entity__block">
          <div className="entity__header">
            <div className="entity__title">
              <span>{project.name}</span>
              <span className="entity__ticker">({project.symbol})</span>
            </div>
          </div>
          <div className="entity__description">
            {project.description || " "}
          </div>
          <div className="entity__action--bottom">
            <div className="entity__metrics-stat">
              <span>disclosures ({project.num_surveys || 0})</span>
            </div>
            <div className="entity__metrics-stat">
              <span>comments ({project.num_total_comments || 0})</span>
            </div>
            <div className="entity__metrics-stat">
              <span>issues ({project.num_issues || 0})</span>
            </div>
          </div>
        </div>
      </Link>
    </ListRow>
  );
};
