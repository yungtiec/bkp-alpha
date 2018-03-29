import React from "react";
import { Navbar, ModalContainer } from "./components";
import Routes from "./routes";
import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-wybo';

const App = () => {
  return (
    <div>
      <Routes />
      <ModalContainer />
      <NotificationsSystem theme={theme} />
    </div>
  );
};

export default App;
