import { DataGrid } from "@mui/x-data-grid";
import "./productlist.css";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  _deleteProductWithRedux,
  _deleteProduct_db2_WithRedux,
  _getProductsWithRedux,
  _getProducts_db2_WithRedux,
} from "../../redux/apiCalls";
import { Box, ThemeProvider, createTheme,CircularProgress } from "@mui/material";
import { _getResultDeletenotify } from "../../components/_resultsuccess/resultNotify";
import { ToastContainer } from "react-toastify";

function ProductListDB2() {
  const [deleteProductSuccess, setDeleteProductSuccess] = useState(null);
  const [deleteProductError, setDeleteProductError] = useState(null);
  const [loadingDataGrid,setLoadingDataGrid] = useState(false);
  const [page ,setPage] = useState(1);
  const ASSETS = "http://192.168.0.192:8282/"
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product_db2.products?.data);
  const totalPage = useSelector((state) => state.product_db2.products?.totalPages);
  const totalLength = useSelector((state) => state.product_db2.products?.totalLength);




  useEffect(() => {

    _getProducts_db2_WithRedux(dispatch,  page  );
    setTimeout(() => setLoadingDataGrid(false),2000)
  }, [dispatch, page,deleteProductSuccess,loadingDataGrid]);


  const handleDelete = async (id) => {
    try {
      const resdelete = await _deleteProduct_db2_WithRedux(id, dispatch);
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

  const handleChange = (params) => {
    setLoadingDataGrid(true)// Fetch data based on the new page value (params.page)
    // _getProductsWithRedux(dispatch, { page: params.page });
    setPage(params.page + 1);
  };

  const columns = [
    { field: "id", headerName: "ID", minWidth: 220 },
    {
      field: "name",
      headerName: "Title",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.imgUrls?.length !== 0 ?`${ASSETS}assets${params.row?.imgUrls[0]}`: ""} alt="" />
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
      headerName: "edit",
      minWidth: 150,
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
      minWidth: 150,
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

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
              backgroundColor: "#F2F2F2", // Set the background color to white
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
        margin:"auto",
        position: "relative",
      }}
    >
      <ThemeProvider theme={theme}>

    {products && (
        <DataGrid
          rows={products}
          columns={columns}
          disableVirtualization={loadingDataGrid}
          getRowId={(row) => row.id}
          pagination
          pageSizeOptions={[25, 50, 100]}
          onPaginationModelChange={handleChange}
          rowCount={totalLength} // Total number of rows in the entire dataset
          paginationMode="server" // Set pagination mode to server
          paginationTotalRows={totalPage}
          page={page} // Set the current page




        />
      )
      }

{loadingDataGrid && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width:"100%",
            height:"100%",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            transform: "translate(-50%, -50%)",
            backgroundColor:"rgb(0,0,0,0.19)",
            zIndex: 55,

          }}
        >
          <CircularProgress />
        </Box>
      )}

      </ThemeProvider>
      <ToastContainer/>
    </Box>
  );
}

export default ProductListDB2;
