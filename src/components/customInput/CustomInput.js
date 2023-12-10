import React, { useEffect, useRef, useState } from "react";

const CustomInput = ({ label, error, ...props }) => {
  const ASSETS = process.env.REACT_APP_ASSETS_IJORDAN;

  return (
    <div className="newUserItem" style={{ position: "relative" }}>
      <label>{label}</label>
      <input {...props} />
      {!error && props.value !== "" && (
        <img
          style={{
            position: "absolute",
            width: 30,
            height: 30,
            right: 3,
            top: "50%",
            borderRadius: 25,
          }}
          src={`${ASSETS}/correct.png`}
          alt="inputsuccess"
  
        />
      )}
      {error}
    </div>
  );
};

export default CustomInput;
