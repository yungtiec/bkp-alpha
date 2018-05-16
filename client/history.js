import createHistory from "history/createBrowserHistory";
import createMemoryHistory from "history/createMemoryHistory";
import ReactGA from "react-ga";

const history =
  process.env.NODE_ENV === "test" ? createMemoryHistory() : createHistory();

export default history;
