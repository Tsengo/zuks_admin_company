import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AddCircleOutline, MenuBook } from "@material-ui/icons";
import { Button, Drawer } from "@mui/material";
import { DBList } from "./List";

const Sidebar = () => {
  const location = useLocation();
  const [, , products] = location.pathname.split("/");

  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div
      className="sidebar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        color: "white",
      }}
    >
  
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            style={{ padding: 10, gap: 5 }}
            onClick={toggleDrawer(anchor, true)}
          >
            <MenuBook />
            Quick Access
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            PaperProps={{
              sx: {
                backgroundColor: "#02080fef",
                color: "whitesmoke",
              },
            }}
          >
            {<DBList />}
          </Drawer>
        </React.Fragment>
      ))}
      {products == "users" && (
        <Link to="/admin/users/adduser">
          <Button style={{ gap: 5, padding: 10 }}>
            <AddCircleOutline />
            Add New User
          </Button>
        </Link>
      )}
      {products == "products" && (
        <Link to="/admin/products/addproduct">
          <Button style={{ gap: 5, padding: 10 }}>
            <AddCircleOutline />
            Add New Product
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
