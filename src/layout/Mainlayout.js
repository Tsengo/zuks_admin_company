import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/topbar/Topbar";
import Sidebar from "../components/sidebar/Sidebar";

const Mainlayout = () => {
  return (
    <div styles={{ display: "flex", flexDirection: "column" }}>
      <Topbar />
      <div>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Mainlayout;
