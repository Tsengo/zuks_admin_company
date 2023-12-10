import React from "react";
import "./topbar.css";

import { useDispatch, useSelector } from "react-redux";
import { _loginUserByEmail, _logoutUser } from "../../redux/apiCalls";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const ASSETS = "https://vinallhistory-61174a5103b4.herokuapp.com/assets/admin/user/";
  const ADMIN = process.env.REACT_APP_ASSETS_ADMIN;
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.currentUser._id);
  const user = useSelector((state) =>
    state.user.users.find((o) => o._id === userId)
  );
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    _logoutUser(dispatch);
    navigate("/admin/login");
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft" >
           <img width={70} height={70} src={ADMIN + "/adminlogo.png"} alt=""/>
         <span className="logo" style={{ fontSize: 20 }}>
            OnlyMyAdmin
          </span>
        </div>
        <div className="topRight">
          <div
            onClick={handleLogout}
            style={{
              padding: 10,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ color: "white", fontSize: 20 }}>
              {user?.username}
            </span>
            <img src={ASSETS + user?.imgName} alt="" className="topAvatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
