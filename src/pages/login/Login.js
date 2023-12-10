import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
import "./login.css";
import { _loginUserByEmail } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";
import { _getResultLoginNotify } from "../../components/_resultsuccess/resultNotify";
const Login = () => {
  const [customInputs, setCustomInputs] = useState(null);
  const [sentEmailVerif, setSentEmailVerif] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const dispatch = useDispatch();
const ADMIN = process.env.REACT_APP_ASSETS_ADMIN
  const handleInputsChange = (e) => {
    const { name, value } = e.target;
    setCustomInputs((prevInputs) => {
      return { ...prevInputs, [name]: value };
    });
  };

  const handleLoginByEmail = async (e) => {
    e.preventDefault();
    const user = { ...customInputs };

    if (!customInputs?.password || !customInputs?.email || !customInputs) {
      return _getResultLoginNotify("empty");
    }

    try {
      const data = await _loginUserByEmail(user, dispatch);
      setLoginError(null);
      setSentEmailVerif(data);

      if (data.response.status === 401) {
        setLoginError(data.response);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (sentEmailVerif?.verifiedEmail === false) {
      return _getResultLoginNotify("verifytoken");
    }
    if (loginError) {
      return _getResultLoginNotify("error");
    }
    if(sentEmailVerif){
         window.location.reload();
    }
  }, [sentEmailVerif, loginError]);

  return (
    <div className="login">
      <div className="loginTopLogo">
        <img width={70} height={70}src={ADMIN + "/adminlogo.png" } alt="" />
        <span style={{ color: "white", fontSize: 30, fontWeight: 400 }}>

          OnlyMyAdmin
        </span>
      </div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 3, width: "40ch" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id="outlined-required"
          label="Email"
          name="email"
          type="email"
          variant="standard"
          className="textfield"
          onChange={handleInputsChange}
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
          required
          id="standard-password-input"
          label="Password"
          type="password"
          name="password"
          onChange={handleInputsChange}
          InputLabelProps={{
            shrink: true,
            sx: {
              color: "white",
            },
          }}
          variant="standard"
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
          autoComplete="current-password"
        />

        <Button
          sx={{ color: "white" }}
          type="submit"
          onClick={handleLoginByEmail}
        >
          Sign in
        </Button>
      </Box>
      <ToastContainer />
    </div>
  );
};

export default Login;
