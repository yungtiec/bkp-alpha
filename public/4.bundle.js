(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{456:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getProjectBySymbol=function(e){return(0,r.keyBy)(o,"symbol")[e]};var r=n(9),o=n(127)},457:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.fetchQuestionsBySurveyId=function(e){var t=e.projectSymbol,n=e.surveyId;return i=regeneratorRuntime.mark(function e(i,a){var u,c,p,l,y,f;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,(0,o.getProjectBySymbol)(t);case 3:u=e.sent,c=(0,s.keyBy)(u.project_surveys,"id"),p=c[n].survey.survey_questions,l=(0,s.keyBy)(p,"id"),y=p.map(function(e){return e.id}),f=(0,s.assignIn)((0,s.pick)(c[n],["name","id"]),(0,s.omit)(c[n].survey,["survey_questions","id"])),i({type:r.SURVEY_FETCH_SUCCESS,surveyQnasById:l,surveyQnaIds:y,surveyMetadata:f}),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(0),console.error(e.t0);case 15:case"end":return e.stop()}},e,this,[[0,12]])}),a=function(){var e=this,t=arguments;return new Promise(function(n,r){var o=i.apply(e,t);function s(e,t){try{var s=o[e](t),i=s.value}catch(e){return void r(e)}s.done?n(i):Promise.resolve(i).then(a,u)}function a(e){s("next",e)}function u(e){s("throw",e)}a()})},function(e,t){return a.apply(this,arguments)};var i,a};var r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}(n(88)),o=n(456),s=n(9)},458:function(e,t,n){(e.exports=n(16)()).push([e.i,'.project-survey {\n  max-width: 740px;\n  padding-top: 50px;\n  padding-bottom: 6rem;\n  margin-left: 80px; }\n\n.project-survey__back-btn {\n  cursor: pointer; }\n\n.project-survey__header .survey-name__box {\n  font-weight: 700;\n  font-size: 3rem;\n  line-height: 3rem;\n  text-transform: capitalize; }\n\n.project-survey__header .survey-creator-name__box {\n  font-size: 1.2rem;\n  color: #838383;\n  font-family: "Roboto Condensed", sans-serif;\n  margin-bottom: 60px; }\n\n.qna__container {\n  margin-bottom: 2rem; }\n\n.qna__question {\n  font-family: "Vollkorn", serif;\n  font-size: 16px;\n  font-weight: 600;\n  margin-bottom: 1rem;\n  text-align: left;\n  line-height: 1; }\n',""])},459:function(e,t,n){var r=n(458);"string"==typeof r&&(r=[[e.i,r,""]]);n(15)(r,{});r.locals&&(e.exports=r.locals)},873:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n(459);var r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}(n(3)),o=n(22),s=n(18),i=(m(n(0)),n(457)),a=n(128),u=n(356),c=n(357),p=n(355),l=n(150),y=n(333),f=n(99),d=m(n(19)),v=m(n(201));function m(e){return e&&e.__esModule?e:{default:e}}function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var g=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),n=function(e,t){if(t&&("object"===h(t)||"function"==typeof t))return t;if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e)),(0,d.default)(function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(n)),v.default.on("annotationAdded",function(e){n.props.addNewAnnotationSentFromServer(e)}),n}var n,o,s;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.Component),n=t,(o=[{key:"componentDidMount",value:function(){this.props.fetchQuestionsBySurveyId({projectSymbol:this.props.match.url.split("/")[2],surveyId:this.props.match.params.surveyId}),this.props.fetchAnnotationsBySurvey("http://localhost:8000".concat(this.props.match.url)),y.Events.scrollEvent.register("begin",function(){}),y.Events.scrollEvent.register("end",function(){}),y.scrollSpy.update()}},{key:"componentDidUpdate",value:function(e){var t=e.match.url.split("/")[2],n=this.props.match.url.split("/")[2],r=e.match.params.surveyId,o=this.props.match.params.surveyId;t===n&&r===o||y.animateScroll.scrollToTop()}},{key:"componentWillUnmount",value:function(){y.Events.scrollEvent.remove("begin"),y.Events.scrollEvent.remove("end")}},{key:"componentWillReceiveProps",value:function(e){var t=this.props.match.url.split("/")[2],n=e.match.url.split("/")[2],r=this.props.match.params.surveyId,o=e.match.params.surveyId;t&&r&&(t!==n||r!==o)&&(this.props.fetchQuestionsBySurveyId({projectSymbol:n,surveyId:e.match.params.surveyId}),this.props.fetchAnnotationsBySurvey("http://localhost:8000".concat(e.match.url)))}},{key:"shouldComponentUpdate",value:function(e){var t=this.props.match.url.split("/")[2],n=e.match.url.split("/")[2],r=this.props.match.params.surveyId,o=e.match.params.surveyId;return this.props.isLoggedIn!==e.isLoggedIn||!this.props.surveyMetadata.id||t!==n||r!==o||JSON.stringify(e.annotationsById)!==JSON.stringify(this.props.annotationsById)}},{key:"render",value:function(){return this.props.surveyQnaIds.length?r.default.createElement(f.Survey,this.props):"loading"}}])&&b(n.prototype,o),s&&b(n,s),t}(),S={fetchQuestionsBySurveyId:i.fetchQuestionsBySurveyId,fetchAnnotationsBySurvey:a.fetchAnnotationsBySurvey,addNewAnnotationSentFromServer:a.addNewAnnotationSentFromServer,editAnnotationComment:a.editAnnotationComment},_=(0,s.withRouter)((0,o.connect)(function(e){var t=(0,u.getAllSurveyQuestions)(e),n=t.surveyQnasById,r=t.surveyQnaIds,o=(0,p.getAllAnnotations)(e),s=o.annotationsById,i=o.annotationIds;return{isLoggedIn:!!e.data.user.id,surveyQnasById:n,surveyQnaIds:r,surveyMetadata:(0,c.getSelectedSurvey)(e),projectMetadata:(0,l.getSelectedProject)(e),annotationsById:s,annotationIds:i}},S)(g));t.default=_}}]);
//# sourceMappingURL=4.bundle.js.map