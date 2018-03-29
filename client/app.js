import React from "react";

import { Navbar, ModalContainer } from "./components";
import Routes from "./routes";

const App = () => {
  return (
    <div>
      <Routes />
      <ModalContainer />
    </div>
  );
};

export default App;
