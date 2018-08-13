import React from "react";
import { keys } from "lodash";
import { Link } from "react-router-dom";

export default ({
  cardHref,
  mainTitle,
  subtitle,
  textUpperRight,
  mainText,
  tagArray,
  metadataArray
}) => {
  return (
    <div className="col-md-12 entity-card">
      <Link to={cardHref}>
        <div className="entity__block">
          <div className="entity__header">
            <div className="entity__title">
              <span>{mainTitle}</span>
              <span className="entity__subtitle">{subtitle}</span>
            </div>
            <p className="entity__text-upper-right">{textUpperRight}</p>
          </div>
          <div className="entity__description">{mainText}</div>
          <div className="entity__action--bottom">
            {(tagArray &&
              tagArray.map(tag => (
                <div className="entity__metrics-stat">
                  <span>{tag}</span>
                </div>
              ))) ||
              (metadataArray &&
                metadataArray.map(metadata => (
                  <div className="entity__metadata">
                    <span>{metadata}</span>
                  </div>
                )))}
          </div>
        </div>
      </Link>
    </div>
  );
};
