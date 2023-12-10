import "./styles/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/pages/login/Login";
import Dash from "./pages/home/Dash";
import Mainlayout from "./layout/Mainlayout";
import Userlist from "./pages/userlist/Userlist";
import {  useSelector } from "react-redux";
import NewUser from "./pages/newUser/NewUser";
import User from "./pages/user/User";
import PageFetching from './pages/fetching/Page_Fetching' ;
import { useEffect } from "react";
import ProductList from "./pages/productlist/Productlist";
import NewProduct from "./pages/newProduct/NewProduct";
import Product from "./pages/product/Product";
import ProductListDB2 from "./pages/productlist/Prodcutlist-db2";
function App() {
// const dispatch = useDispatch();
//
//     useEffect(()=>{
//       getUsers(dispatch)
//     },[dispatch])

   const user =  useSelector(state=> state.user.currentUser);
   const userToken = user?.accessToken;


  return (
    <div className="App">
      <Routes>
        <Route path="/admin/login" element={userToken? <Navigate to="/"/> : <Login />} />
        <Route path="/" element={userToken ? <Mainlayout /> :<Navigate to="/admin/login"/>}>
          <Route index element={<Dash />} />

          <Route path="/admin/users/adduser" element={<NewUser/>}/>
          <Route path="/admin/users" element={<Userlist/>}/>
          <Route path="/admin/users/edituser/:id" element={<User/>}/>
          <Route path="/admin/products" element={<ProductList/>}/>
          <Route path="/admin/products/db2" element={<ProductListDB2/>}/>
          <Route path="/admin/products/addproduct" element={<NewProduct/>}/>
          <Route path="/admin/products/:id" element={<Product/>}/>
          <Route path="/admin/page_fetching" element={<PageFetching/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
