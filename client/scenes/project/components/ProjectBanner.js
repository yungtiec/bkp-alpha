import "./ProjectBanner.scss";
import React from "react";
import Avatar from "react-avatar";

export default ({ metadata }) => (
  <div className="project-banner">
    <div className="project-banner__info">
      <div className="project-banner__logo">
        {metadata.logo_url ? (
          <img src={metadata.logo_url} className="project-logo__img" />
        ) : (
          <Avatar
            value={metadata.symbol}
            round={true}
            color={"#FFFFFF"}
            fgColor={"#3898f7"}
            textSizeRatio={4.5}
          />
        )}
      </div>
      <div className="project-banner__info-text">
        <h1 className="project-banner__title">{metadata.name}</h1>
        <p className="project-banner__description">{metadata.description}</p>
      </div>
    </div>
    <div className="project-banner__metrics">
      <div className="project-metrics__stats">
        <div className="project-metrics__stat">
          <span class="project-metrics__stat-label">Surveys</span>
          <div class="project-metrics__stat-value">
            <span class="project-metrics__stat-number">
              {metadata.num_surveys}
            </span>
          </div>
        </div>
        <div className="project-metrics__stat">
          <span class="project-metrics__stat-label">Comments</span>
          <div class="project-metrics__stat-value">
            <span class="project-metrics__stat-number">
              {metadata.num_page_comments}
            </span>
          </div>
        </div>
        <div className="project-metrics__stat">
          <span class="project-metrics__stat-label">Annotations</span>
          <div class="project-metrics__stat-value">
            <span class="project-metrics__stat-number">
              {metadata.num_annotations}
            </span>
          </div>
        </div>
        <div className="project-metrics__stat">
          <span class="project-metrics__stat-label">Issues</span>
          <div class="project-metrics__stat-value">
            <span class="project-metrics__stat-number">
              {metadata.num_issues}
            </span>
          </div>
        </div>
      </div>
      <div>
        <a
          className="project-metrics__stat"
          target="_blank"
          href={metadata.website}
        >
          <span class="project-metrics__stat-label">website</span>
          <div class="project-metrics__stat-value">
            <span class="project-metrics__stat-number">
              <i class="fas fa-home" />
            </span>
          </div>
        </a>
      </div>
    </div>
  </div>
);
