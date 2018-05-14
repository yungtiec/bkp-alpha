import { omit } from "lodash";
import * as types from "./data/actionTypes";
import { reducer as dataReducer } from "./data/reducer";

const SIDEBAR_OPEN_TOGGLE = "survey.SIDEBAR_OPEN_TOGGLE";
const ENGAGEMENT_TAB_IN_VIEW = "survey.ENGAGEMENT_TAB_IN_VIEW";
const VERIFICATION_STATUS_IN_VIEW = "survey.VERIFICATION_STATUS_IN_VIEW";
const ANNOTATION_SORT_BY = "survey.ANNOTATION_SORT_BY";
const COMMENT_SORT_BY = "survey.COMMENT_SORT_BY";
const ENGAGEMENT_ITEM_CONTEXT_UPDATED =
  "survey.ENGAGEMENT_ITEM_CONTEXT_UPDATED";

export const toggleSidebar = () => ({
  type: "survey.SIDEBAR_OPEN_TOGGLE"
});

export const updateEngagementTabInView = engagementTab => ({
  type: "survey.ENGAGEMENT_TAB_IN_VIEW",
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

export const updateSidebarContext = sidebarContext => ({
  type: ENGAGEMENT_ITEM_CONTEXT_UPDATED,
  sidebarContext
});

const initialState = {
  sidebarOpen: true,
  verificationStatus: "all",
  engagementTab: "annotations",
  annotationSortBy: "position",
  commentSortBy: "timestamp",
  sidebarContext: {
    selectedText: "",
    selectedCommentId: null,
    selectedAnnotationId: null
  }
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case ENGAGEMENT_TAB_IN_VIEW:
      return { ...state, engagementTab: action.engagementTab };
    case VERIFICATION_STATUS_IN_VIEW:
      return { ...state, verificationStatus: action.verificationStatus };
    case SIDEBAR_OPEN_TOGGLE:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case ANNOTATION_SORT_BY:
      return { ...state, annotationSortBy: action.annotationSortBy };
    case COMMENT_SORT_BY:
      return { ...state, commentSortBy: action.commentSortBy };
    case ENGAGEMENT_ITEM_CONTEXT_UPDATED:
      return {
        ...state,
        sidebarContext: { ...state.sidebarContext, ...action.sidebarContext }
      };
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        data: dataReducer(rest.data, action)
      };
  }
}

export const getSidebarContext = state =>
  state.scenes.project.scenes.survey.sidebarContext;
