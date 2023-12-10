import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import { useEffect, useState } from "react";
import { userRequest } from "../../utils/requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { _getResultDeletenotify, getResultnotify } from "../../components/_resultsuccess/resultNotify";
import { getUsers, _updateUserWithRedux } from "../../redux/apiCalls";
import "./user.css";
import { _handleUploadAssets } from "../../utils/handleEvents";
import { Box, Button, TextField } from "@mui/material";
import Avatar from "../../components/_customAvatar/Avatar";
const UASSETS = "http://localhost:8282/assets/admin/user/";

function User() {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState({});
  const location = useLocation();
  const navigate = useNavigate(); 
  const userId = location.pathname.split("/")[4];
  const [userEditUploaderSuccess, setUserEditUploaderSuccess] = useState(null);
  const [userEditUploadedError, setUserEditUploaderError] = useState(null);
  const [showImageFilewithblob, setShowImageFilewithblob] = useState(null);
  const [deactiveUserSuccess,setDeactiveUserSuccess] = useState(null);
  const [deactiveUserError,setDeactiveUserError] = useState(null);
  const product = useSelector((state) =>
    state.user.users.find((user) => user._id === userId)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      if (value.trim() === "") {
        const { [name]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  useEffect(() => {
    if (file) {
      const blob = URL.createObjectURL(file);
      setShowImageFilewithblob(blob);
    }
  }, [file]);

  const handleClick = async (e) => {
    e.preventDefault();

    if (file) {
      const filedata = new FormData();
      filedata.append("name", Date.now() + file.name);
      filedata.append("file", file, file.mimetype);
      try {
        const resupload = await userRequest.post(
          "/upload/admin/user/assets",
          filedata
        );
        setUserEditUploaderSuccess(resupload.data);
        const user = { ...inputs, imgName: resupload?.data.filename };
        const resedit = await _updateUserWithRedux(product._id, user, dispatch);
        getUsers(dispatch);
      } catch (err) {
        setUserEditUploaderError(err);
      }
    } else {
      try {
        if (Object.keys(inputs).length !== 0) {
          const resedit = await _updateUserWithRedux(
            product._id,
            { ...inputs },
            dispatch
          );
          setUserEditUploaderSuccess(resedit);

          getUsers(dispatch);
        }
      } catch (err) {
        setUserEditUploaderError(err);
      }
    }
    if (Object.keys(inputs).length === 0) {
      return getResultnotify("empty");
    }
  };


   const deleteActiveUser = async () => {
      try{
        const res = await userRequest.delete("/admin/users/delete/" + product?._id)
            setDeactiveUserSuccess(res.data);
      }catch(err){
         setDeactiveUserError(err);
      }
     
   }

   //userDelete  useEffect 
 useEffect(() => {
  if(deactiveUserSuccess){
        navigate("/admin/users")
   }
 },[deactiveUserSuccess])
   
  //success error message
  useEffect(() => {
    if (userEditUploaderSuccess) {
      return getResultnotify("ok");
    }

    if (userEditUploadedError) {
      return getResultnotify("error");
    }

    if(deactiveUserSuccess){
      return _getResultDeletenotify("ok");
    }
    if(deactiveUserError){
      return _getResultDeletenotify("error");
    }
  }, [userEditUploaderSuccess, userEditUploadedError,deactiveUserSuccess]);

  useEffect(() => {
    if (userEditUploaderSuccess) {
      setTimeout(() => {
        setUserEditUploaderSuccess(null);
        setUserEditUploaderError(null);
      }, 4000);
    }
  }, [userEditUploaderSuccess]);

  return (
    <div className="user" style={{ color: "white" }}>
      <div className="userContainer">
        <div className="userShowBottom">
          <div className="userTitleContainer" style={{ width: "100%" }}>
            <Button sx={{ padding: 2, color: "red", borderRadius: 12 }} onClick={deleteActiveUser}>
              Deactive User
            </Button>

            <h2 className="userTitle">User Info</h2>
          </div>
          <div className="userShow">
            <div className="userShowTopTitle">
              <img
                src={UASSETS + product?.imgName}
                alt=""
                className="userShowImg"
              />
              <span className="userShowUsername">{product?.username}</span>
            </div>
          </div>
          <span className="userShowTitle">Account Details</span>
          <div className="userShowInfo">
            <PermIdentity className="userShowIcon" />
            <span className="userShowInfoTitle">{product?.username}</span>
          </div>
          <div className="userShowInfo">
            <CalendarToday className="userShowIcon" />
            <span className="userShowInfoTitle">
              {product?.firstName} {product?.lastname}
            </span>
          </div>
          <span className="userShowTitle">Contact Details</span>
          <div className="userShowInfo">
            <PhoneAndroid className="userShowIcon" />
            <span className="userShowInfoTitle">{product?.phone}</span>
          </div>
          <div className="userShowInfo">
            <MailOutline className="userShowIcon" />
            <span className="userShowInfoTitle">{product?.email}</span>
          </div>
          <div className="userShowInfo">
            <LocationSearching className="userShowIcon" />
            <span className="userShowInfoTitle">{product?.ipAddress}</span>
          </div>
        </div>

        <ToastContainer />
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <div className="userUpdateUpload">
            <img
              src={file ? showImageFilewithblob : UASSETS + product?.imgName}
              alt=""
              className="userUpdateImg"
            />
            <label htmlFor="file">
              <Publish className="userUpdateIcon" />
            </label>
            <input
              type="file"
              hidden
              id="file"
              onChange={(e) => _handleUploadAssets(e, setFile)}
              accept="image/*"
            />
          </div>
          <form className="userUpdateForm">
            <TextField
              variant="standard"
              name="username"
              type="text"
              label="Username"
              placeholder={product?.username}
              className="userUpdateInput"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "white",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  color: "white",
                  "&::before": {
                    borderBottomColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
              }}
            />

            <TextField
              variant="standard"
              name="lastname"
              type="text"
              label="Lastname"
              className="userUpdateInput"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "white",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  color: "white",
                  "&::before": {
                    borderBottomColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
              }}
            />
            <TextField
              variant="standard"
              name="firstName"
              type="text"
              label="Firstname"
              placeholder={product?.firstname}
              className="userUpdateInput"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "white",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  color: "white",
                  "&::before": {
                    borderBottomColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
              }}
            />
            <TextField
              variant="standard"
              name="email"
              label="Email"
              type="text"
              placeholder={product?.email}
              className="userUpdateInput"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "white",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  color: "white",
                  "&::before": {
                    borderBottomColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
              }}
            />

            <TextField
              variant="standard"
              name="password"
              label="Password *"
              type="text"
              className="userUpdateInput"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "white",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  color: "white",
                  "&::before": {
                    borderBottomColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
              }}
            />

            <TextField
              variant="standard"
              name="phone"
              type="text"
              label="Phone"
              placeholder={product?.phone}
              className="userUpdateInput"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "white",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  color: "white",
                  "&::before": {
                    borderBottomColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
              }}
            />

            <Button
              sx={{ padding: 1, width: "20%", margin: 3, background: "#fff" }}
              onClick={handleClick}
            >
              Update
            </Button>
          </form>
        </div>
      </div>
      <div className="userUpdateRight">
        <Box component={"div"}>
          <Avatar file={file} setfile={setFile} />
        </Box>
      </div>
    </div>
  );
}

export default User;
