// Layout.js

import React from "react";
import NavBar from "./NavBar";
import SPFooter from "./SPFooter";

const Layout = ({ children }) => {
  return (
    <div>
      <NavBar />
      {children}
      <SPFooter />
    </div>
  );
};

export default Layout;
