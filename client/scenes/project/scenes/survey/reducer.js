import { omit } from "lodash";
import * as types from "./data/actionTypes";
import { reducer as dataReducer } from "./data/reducer";

const SIDEBAR_OPEN_TOGGLE = "survey.SIDEBAR_OPEN_TOGGLE";
const ENGAGEMEN_TAB_IN_VIEW = "survey.ENGAGEMEN_TAB_IN_VIEW";
const VERIFICATION_STATUS_IN_VIEW = "survey.VERIFICATION_STATUS_IN_VIEW";
const ANNOTATION_SORT_BY = "survey.ANNOTATION_SORT_BY";
const COMMENT_SORT_BY = "survey.COMMENT_SORT_BY";

export const toggleSidebar = () => ({
  type: "survey.SIDEBAR_OPEN_TOGGLE"
});

export const updateEngagementTabInView = engagementTab => ({
  type: "survey.ENGAGEMEN_TAB_IN_VIEW",
  engagementTab
});

export const updateVerificationStatusInView = verificationStatus => ({
  type: "survey.VERIFICATION_STATUS_IN_VIEW",
  verificationStatus
});

export const sortAnnotationBy = annotationSortBy => ({
  type: "survey.ANNOTATION_SORT_BY",
  annotationSortBy
});

export const sortCommentBy = commentSortBy => ({
  type: "survey.COMMENT_SORT_BY",
  commentSortBy
});

const initialState = {
  sidebarOpen: true,
  verificationStatus: "all",
  engagementTab: "annotations",
  annotationSortBy: "position",
  commentSortBy: "timestamp"
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case ENGAGEMEN_TAB_IN_VIEW:
      return { ...state, engagementTab: action.engagementTab };
    case VERIFICATION_STATUS_IN_VIEW:
      return { ...state, verificationStatus: action.verificationStatus };
    case SIDEBAR_OPEN_TOGGLE:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case ANNOTATION_SORT_BY:
      return { ...state, annotationSortBy: action.annotationSortBy };
    case COMMENT_SORT_BY:
      return { ...state, commentSortBy: action.commentSortBy };
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        data: dataReducer(rest.data, action)
      };
  }
}
