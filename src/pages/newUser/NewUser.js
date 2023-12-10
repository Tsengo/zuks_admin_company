import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { _addNewUserWithRedux } from "../../redux/apiCalls";
import { ToastContainer, toast } from "react-toastify";
import "./newuser.css";
import { getResultnotify } from "../../components/_resultsuccess/resultNotify";
import { Publish } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { publicRequest, userRequest } from "../../utils/requestMethods";
import { _handleUploadAssets } from "../../utils/handleEvents";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import CustomInput from "../../components/customInput/CustomInput";
import { validateAll, validateOne } from "../../schema/valid.schema";
import Avatar from "../../components/_customAvatar/Avatar";
import { Box, InputLabel } from "@material-ui/core";
const inputData = {
  name: "",
  email: "",
  username: "",
  lastname: "",
  password: "",
  isAdmin: true,
};
export default function NewUser() {
  const [inputs, setInputs] = useState(inputData);
  const [validations, setValidations] = useState(inputData);
  const [newUserUploadedSuccess, setNewUserUploadedSuccess] = useState(null);
  const [newUserUploadedError, setNewUserUploadedError] = useState(null);
  const [validClassName, setValidClassName] = useState("");
  const [file, setFile] = useState(null);
  const [showImageFilewithblob, setShowImageFilewithblob] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));

       const {isAdmin,...other}=inputs
      validateOne(e, other, validations, setValidations);

      if (validations[name]) {
        setValidClassName("inputerror");
      } else if (name) {
        setValidClassName("inputsuccess");
      } else {
        setValidClassName("");
      }
    },
    [inputs, validations]
  );

  useEffect(() => {
    if (file) {
      const blob = URL.createObjectURL(file);
      setShowImageFilewithblob(blob);
    }
  }, [file]);

  const handleClick = async (e) => {
    e.preventDefault();

    const isValid = validateAll(inputs, setValidations);
    if (file && Object.keys(inputs).length !== 0 && isValid) {
      const datafile = new FormData();
      datafile.append("name", Date.now() + file.name);
      datafile.append("file", file, file.type);
      const imgName = datafile.get("name");
      const user = { ...inputs, img: imgName };
   
      try {
        const resdata = await _addNewUserWithRedux(user, dispatch);
         
        if (resdata?.status === 200) {
           await userRequest.post(
            "upload/admin/user/assets",
            datafile
          );
         
          setNewUserUploadedSuccess({ img:imgName, user: resdata });
        } else{
          setNewUserUploadedError(
            new Error("Request failed with status code 500")
          );
        }
      } catch (err) {setNewUserUploadedError(
            new Error("Request failed with status code 500")
          );}
    }

    if (!file || Object.keys(inputs).length === 0) {
      return getResultnotify("empty");
    }

    if (!isValid) {
      getResultnotify("empty");
      return false;
    }
  };

  //success error message
  useEffect(() => {
    if (newUserUploadedSuccess) {
      return getResultnotify("ok");
    }

    if (newUserUploadedError) {
      return getResultnotify("error");
    }
  }, [newUserUploadedSuccess, newUserUploadedError]);

  useEffect(() => {
    if (newUserUploadedSuccess) {
      setTimeout(() => {
        setNewUserUploadedSuccess(null);
        setNewUserUploadedError(null);
      }, 4000);
    }
  }, [newUserUploadedSuccess]);

  const RenderErrorPassword = () => {
    const validationpass = validations.password.split(",");

    return (
      <span
        className={validationpass.length > 15 ? "requiredpass" : "patternpass"}
      >
        {validationpass.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </span>
    );
  };
 console.log(inputs)
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        color: "white",
        height:'100%'
      }}

      className="newUserContainer"
    >
      <div className="newUser">
        <ToastContainer />
        <h1 className="newUserTitle">NewUser</h1>
        <div
          className="userUpdateUpload"
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            gap: 5,
            alignItems: "center",
          }}
        >
          <label>Photo Uploader *</label>

          {file && (
            <img src={showImageFilewithblob} alt="" className="userUpdateImg" />
          )}
          <label
            htmlFor="file"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Button>Upload Image</Button>
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

        <Box
          component="form"
          className="newUserForm"
          sx={{
            "& .MuiTextField-root": { m: 3, width: "40%" },
            display: "flex",
            padding: 15,
            gap: 30,
            flexDirection:"column"
          }}
          onSubmit={handleClick}
        >
          <TextField
            label="Usename *"
            value={inputs.username}
            type="text"
            placeholder="john"
            name="username"
            variant="standard"
            onChange={handleChange}
            className={validations.username && validClassName}
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
          { validations.username && (
           <div>{validations.username}</div>
          )}
          <TextField
            label="Firstname *"
            value={inputs.name}
            type="text"
            variant="standard"
            placeholder="John Smith"
            name="name"
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
            className={validations.name && validClassName}
            
          />
          {validations.name && <div className="error">{validations.name}</div>}
          <TextField
            label="Lastname *"
            type="text"
            value={inputs.lastname}
            placeholder="John Smith"
            name="lastname"
            onChange={handleChange}
            variant="standard"
            className={validations.lastname && validClassName}
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
          {validations.lastname && (
            <div className="error">{validations.lastname}</div>
          )}
          <TextField
            label="Email *"
            type="text"
            value={inputs.email}
            placeholder="john@exapmple.com"
            name="email"
            onChange={handleChange}
            variant="standard"
            className={validations.email && validClassName}
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

          {validations.email && (
            <div className="error">{validations.email}</div>
          )}
          <TextField
            label="Password *"
            value={inputs.password}
            type="password"
            placeholder="*****"
            name="password"
            variant="standard"
            onChange={handleChange}
            className={validations.password && validClassName}
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
          {validations.password && <RenderErrorPassword />}
          <TextField
            type="text"
            name="phone"
            label="Phone *"
            id=""
            
            variant="standard"
            placeholder="+1 123 456 78"
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


         <InputLabel id="demo-simple-select-standard" style={{color:"white"}}>isAdmin</InputLabel>
        <Select
          id="demo-simple-select-standard"
          onChange={handleChange}
          sx={{color:"white",width:"40%",borderColor:'white'}}
          variant="standard"
          name="isAdmin"
          defaultValue={true}
          label="isAdmin"
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
          
        </Select>
      

          <Button className="newUserButton" type="submit">
            Create
          </Button>
        </Box>
      </div>

      <div className="" style={{ flex: 2 }}>
        <Avatar file={file} setfile={setFile} />
      </div>
    </div>
  );
}
