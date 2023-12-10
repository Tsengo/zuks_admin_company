import { DeleteOutline } from "@material-ui/icons";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./productlist.css";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { _getResultDeletenotify } from "../../components/_resultsuccess/resultNotify";
import {
  _deleteProductWithRedux,
  _getProductsWithRedux,
} from "../../redux/apiCalls";

function ProductList() {
  const [deleteProductSuccess, setDeleteProductSuccess] = useState(null);
  const [deleteProductError, setDeleteProductError] = useState(null);
  const ASSETS = "http://192.168.0.192:8282/"
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product?.products);





  useEffect(() => {

    _getProductsWithRedux(dispatch);

  }, [dispatch,deleteProductSuccess]);


  const handleDelete = async (id) => {
    try {
      const resdelete = await _deleteProductWithRedux(id, dispatch);
      setDeleteProductSuccess(resdelete);
    } catch (err) {
      setDeleteProductError(err);
    }
  };

  useEffect(() => {
    if (deleteProductSuccess) {
      return _getResultDeletenotify("ok");
    }
    if (deleteProductError) {
      return _getResultDeletenotify("error");
    }
  }, [deleteProductSuccess, deleteProductError]);

  const columns = [

    { field: "id", headerName: "ID", minWidth: 220 },
    {
      field: "name",
      headerName: "Title",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.imgUrls.length !== 0 ?`${ASSETS}assets${params.row?.imgUrls[0]}`: ""} alt="" />
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: "vin",
      headerName: "vinCode",
      minWidth: 170,
    },
    {
      field: "model",
      headerName: "Models",
      minWidth: 170,
    },{
      field: "engine",
      headerName: "Engine",
      minWidth: 150,
    },
    {
      field: "primary_damage",
      headerName: "Primary Damage",
      minWidth: 150,
    },
    {
      field: "secondary_damage",
      headerName: "Secondary Damage",
      minWidth: 150,
    },
    {
      field: "start_code",
      headerName: "Start Code",
      minWidth: 150,
    },
    {
      field: "drive_type",
      headerName: "Drive",
      minWidth: 170,
    },


    {
      field:"edit",
      headerName: "Edit",
      minWidth: 50,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/admin/products/" + params.row.id}>
              <button className="productListEdit">Edit</button>
            </Link>
          </>
        );
      },

    },
    {
      field:"remove",
      headerName: "Remove",
      minWidth:50,
      renderCell: (params) => {
        return (
          <>

            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },

  ];


  // const useStyles = makeStyles((theme) => ({
  //   // Custom styles for the MuiDataGrid component
  //   customDataGrid: {
  //     // Set the background color to white
  //     backgroundColor: '#F2F2F2',
  //     // Other styles for the MuiDataGrid component
  //     // ...

  //     // Customize the scrollbar style
  //     '&::-webkit-scrollbar': {
  //       width: '12px', // Set the width of the scrollbar
  //     },
  //     '&::-webkit-scrollbar-thumb': {
  //       backgroundColor: '#333', // Set the color of the thumb
  //       borderRadius: '6px', // Set the border-radius of the thumb
  //     },
  //     '&::-webkit-scrollbar-track': {
  //       backgroundColor: '#ccc', // Set the color of the track
  //     },
  //   },
  // }));

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: "#F2F2F2",
            '&$customDataGrid': {
              // Custom styles for the MuiDataGrid component
              // ...
            },
          // Set the background color to white
          },
        },
      },
    },
  });

  return (
    <Box
      className="productList"
      sx={{
        height: "80vh",
        width: "90%",
        margin:"auto"


      }}
    >
      <ThemeProvider theme={theme}>


        <DataGrid

          rows={products}
          columns={columns}
          getRowId={(row) => row.id}
          pagination
          pageSizeOptions={[25, 50, 100]}

        />

      </ThemeProvider>
      <ToastContainer/>
    </Box>
  );
}

export default ProductList;
