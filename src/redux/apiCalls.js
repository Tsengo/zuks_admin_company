import {
  loginFailure,
  loginStart,
  loginSuccess,
  getUserStart,
  getUserFailure,
  getUserSuccess,
  updateUserStart,
  updateUserSucces,
  updateUserFailure,
  addUserStart,
  addUserSuccess,
  logOut,
  addUserFailure,
} from "./userRedux";
import { publicRequest, userRequest } from "../utils/requestMethods";
import {
  getProductStart,
  getProductSuccess,
  getProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  updateProductFailure,
  updateProductStart,
  updateProductSuccess,
  addProductFailure,
  addProductStart,
  addProductSuccess,
} from "./productRedux";
import {
  getProductDB2Start,
  getProductDB2Success,
  getProductDB2Failure,
  deleteProductDB2Start,
  deleteProductDB2Success,
  deleteProductDB2Failure,
  updateProductDB2Failure,
  updateProductDB2Start,
  updateProductDB2Success,
  addProductDB2Failure,
  addProductDB2Start,
  addProductDB2Success,
} from "./productDb2Redux";
export const _loginUserByEmail = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/admin/login", user);
    dispatch(loginSuccess(res.data));
     
    return res.data;
  } catch (err) {
    dispatch(loginFailure());
    return err;
  }
};
export const _logoutUser = async (dispatch) => {
  dispatch(logOut());
};

export const getUsers = async (dispatch) => {
  dispatch(getUserStart());
  try {
    const res = await userRequest.get("/admin/users");
    dispatch(getUserSuccess(res.data));
  } catch (err) {
    dispatch(getUserFailure());
  }
};
export const _updateUserWithRedux = async (id, user, dispatch) => {
  dispatch(updateUserStart());
  try {
    const res = await userRequest.put(`/admin/users/${id}`, user);
    dispatch(updateUserSucces(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateUserFailure());
  }
};
export const _addNewUserWithRedux = async (user, dispatch) => {
  dispatch(addUserStart());
  try {
    const res = await userRequest.post("/auth/admin/register", user);

    dispatch(addUserSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(addUserFailure());
    return err;
  }
};
export const _getProductsWithRedux = async (dispatch) => {
  dispatch(getProductStart());
  try {
    const res = await publicRequest.get(`/admin/product/byadmin`);
    dispatch(getProductSuccess(res.data));
  } catch (err) {
    dispatch(getProductFailure());
  }
};
export const _deleteProductWithRedux = async (id, dispatch) => {
  dispatch(deleteProductStart());
  try {
    const res = await userRequest.delete(`/admin/product/${id}`);
    dispatch(deleteProductSuccess(id));
    return res.data;
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};

export const _updateProductWithRedux = async (id, product, dispatch) => {
  dispatch(updateProductStart());
  try {
    const res = await userRequest.put(`/admin/product/${id}`, product);
    dispatch(updateProductSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateProductFailure());
    return err;
  }
};
export const _addProductWithRedux = async (product, dispatch) => {
  dispatch(addProductStart());
  try {
    const res = await userRequest.post(`/admin/product`, product);
    dispatch(addProductSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(addProductFailure());
  }
};

export const _getProducts_db2_WithRedux = async (dispatch, page) => {
  dispatch(getProductDB2Start());

  try {
    const res = await publicRequest.get(`/admin/product/?page=${page}`);
    dispatch(getProductDB2Success(res.data));
  } catch (err) {
    dispatch(getProductDB2Failure());
  }
};

export const _deleteProduct_db2_WithRedux = async (id, dispatch) => {
  dispatch(deleteProductDB2Start());
  try {
    const res = await userRequest.delete(`/admin/product/${id}`);
    dispatch(deleteProductDB2Success(id));
    return res.data;
  } catch (err) {
    dispatch(deleteProductDB2Failure());
  }
};

export const _updateProduct_db2_WithRedux = async (id, product, dispatch) => {
  dispatch(updateProductDB2Start());
  try {
    const res = await userRequest.put(`/admin/product/${id}`, product);
    dispatch(updateProductDB2Success(res.data));
    return res.data;
  } catch (err) {
    dispatch(updateProductDB2Failure());
    return err;
  }
};
export const _addProduct_db2_WithRedux = async (product, dispatch) => {
  dispatch(addProductDB2Start());
  try {
    const res = await userRequest.post(`/admin/product`, product);
    dispatch(addProductDB2Success(res.data));
    return res.data;
  } catch (err) {
    dispatch(addProductDB2Failure());
  }
};
