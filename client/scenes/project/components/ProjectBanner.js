import "./ProjectBanner.scss";
import React from "react";
import Avatar from "react-avatar";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../../../policies.js";
import { connect } from "react-redux";
import { loadModal } from "../../../data/reducer";

const ProjectBanner = ({ metadata, user, loadModal }) => (
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
    <div className="project-banner__editors">
      <span class="project-metrics__stat-label">Editors</span>
      <div>
        {(metadata.admins || []).map(a => (
          <h5 className="project-banner__editor-badge mr-2 mt-2">
            <span class="badge badge-white">
              {a.email}
              <span class="badge badge-secondary ml-1">admin</span>
            </span>
          </h5>
        ))}
        {(metadata.currentEditors || []).map(a => (
          <h5 className="project-banner__editor-badge mr-2 mt-2">
            <span class="badge badge-white">
              {a.email}
              <span />
            </span>
          </h5>
        ))}
        <PunditContainer policies={policies} user={user}>
          <PunditTypeSet type="Project">
            <VisibleIf action="ManageEditors" model={{ project: metadata }}>
              <h5
                className="project-banner__editor-badge mr-2"
                onClick={() =>
                  loadModal("PROJECT_EDITORS_MODAL", {
                    currentEditors: metadata.currentEditors,
                    projectAdmins: metadata.admins || []
                  })
                }
              >
                <button class="btn badge btn-primary">
                  manage editors<span />
                </button>
              </h5>
            </VisibleIf>
          </PunditTypeSet>
        </PunditContainer>
      </div>
    </div>
    <div className="project-banner__metrics">
      <div className="project-metrics__stats">
        <div className="project-metrics__stat">
          <span class="project-metrics__stat-label">Disclosures</span>
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
              {metadata.num_total_comments}
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
      <div className="project-metrics__website">
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

const mapState = (state, ownProps) => ({ ...ownProps, user: state.data.user });

export default connect(mapState, { loadModal })(ProjectBanner);
