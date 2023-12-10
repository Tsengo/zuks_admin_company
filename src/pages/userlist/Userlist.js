import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom";
import React,{ useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/apiCalls";
import { userRequest } from "../../utils/requestMethods";
import { ToastContainer } from "react-toastify";
import { _getResultDeletenotify } from "../../components/_resultsuccess/resultNotify";
import { Button, Box,  } from "@mui/material";


function Userlist() {
  const UASSETS = "http://localhost:8282/assets/admin/user/";
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user?.users);
  

  const filtuser = users.filter(item => item.id);
    
  const [deleteUserSuccess, setDeleteUserSuccess] = useState(null);
  const [deleteUserError, setDeleteUserError] = useState(null);

  const handleDeleteUserById = async (id) => {
    try {
      const res = await userRequest.delete(`admin/users/${id}`);
      setDeleteUserSuccess(res.data);
    } catch (err) {
      setDeleteUserError(err);
    }
  };
  useEffect(() => {
    getUsers(dispatch);
  }, [dispatch, deleteUserSuccess]);

  useEffect(() => {
    if (deleteUserSuccess) {
      return _getResultDeletenotify("ok");
    }
    if (deleteUserError) {
      return _getResultDeletenotify("error");
    }
  }, [deleteUserSuccess, deleteUserError]);


  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "headerclass",
      minWidth: "200",
    },
    {
      field: "user_name",
      headerName: "User",
      headerClassName: "headerclass",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser" style={{alignItems:"center",display:"flex",gap:5}}>
            <img
              className="userListImg"
              width={40}
              height={40}
              src={params.row.imgName ? UASSETS + params.row.imgName : ""}
              alt=""
            />
            {params.row.user_name}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "headerclass",
      minWidth: 200,
    },

    {
      field: "phone",
      headerName: "Phone",
      headerClassName: "headerclass",
      minWidth: 200,
    },
    {
      field: "verified_user",
      headerName: "Verified",
      headerClassName: "headerclass",
      minWidth: 200,
    },
    {
      field: "settings",
      headerName: "Settings",
      headerClassName: "headerclass",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/users/edituser/" + params.row._id}>
              <Button className="userListEdit">Edit</Button>
            </Link>
            {/* <DeleteOutline
              className="userListDelete"
              onClick={() => handleDeleteUserById(params.row._id)}
            /> */}
          </>
        );
      },
    },
  ];


  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF', // Set the background color to white
          },
        },
      },
    },
  });
  return (
    <Box
      sx={{
        height: 800,
        width: "100%",
        
      }}
    >
      <ThemeProvider theme={theme}>
      <DataGrid
        rows={filtuser}
        columns={columns}
         
        getRowId={(row) => row.id}
        pagination
        rowsPerPageOptions={25}
        experimentalFeatures={{ newEditingApi: true }}
       
        />
        </ThemeProvider>
      <ToastContainer />
    </Box>
  );
}

export default Userlist;
