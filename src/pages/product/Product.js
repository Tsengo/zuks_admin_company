import "./product.css";
import { Delete, DeleteOutline, Publish } from "@material-ui/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useState } from "react";
import { userRequest } from "../../utils/requestMethods";
import { useEffect } from "react";
import { carmakes } from "../../components/Sections/allMakes";
import {
  _getProductsWithRedux,
  _updateProductWithRedux,
} from "../../redux/apiCalls";
import {
  _getResultDeletenotify,
  getResultnotify,
} from "../../components/_resultsuccess/resultNotify";
import {
  _handleUploadAssets,
  _handleUploadProductImage,
} from "../../utils/handleEvents";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import Loading from "../../components/_customloading/Loading";

function Product() {
  const inputsdata = {
    key_type: "",
    fuel_type: "",
    start_code: "",
    transmission: "",
    drive_type: "",
    primary_damage: "",
    secondary_damage: "",
    cylinder: "",
    engine: "",
    name: "",
  };
  const ASSETS = "http://192.168.0.192:8282/assets";
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.pathname.split("/")[3];

  const product = useSelector((state) =>
    state.product.products.find((product) => product.id === productId) ? state.product.products.find((product) => product.id === productId) : state.product_db2.products.data.find((product) => product.id === productId)
  );

  const [inputs, setInputs] = useState(inputsdata);
  const [file, setFile] = useState(null);
  const [getEditSuccess, setGetEditSuccess] = useState(null);
  const [getEditError, setGetEditError] = useState(null);
  const [showImageFilesWithBlobs, setShowImageFilesWithBlobs] = useState(null);
  const [pictureDeleteErr, setPictureDeleteErr] = useState(null);
  const [pictureDeleteSucc, setPictureDeleteSucc] = useState(null);
  const [uploadDataLoading, setUploadDataLoading] = useState(false);
  const [selectedMake, setSelectedMake] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleModelChange = (event, value) => {
    setSelectedMake(value);
  };
  useEffect(() => {
    // Clean up the URLs when the component unmounts or the file changes
    return () => {
      if (file) {
        for (let i = 0; i < file.length; i++) {
          URL.revokeObjectURL(file[i]);
        }
      }
    };
  }, [file]);


  const removeImageFile = (index) => {
    const updatedFiles = [...file];
    const updatedShowImageFilesWithBlobs = [...showImageFilesWithBlobs];

    updatedFiles.splice(index, 1);
    updatedShowImageFilesWithBlobs.splice(index, 1);

    setFile(updatedFiles);
    setShowImageFilesWithBlobs(updatedShowImageFilesWithBlobs);
  };


  const handleDeletePicture = async (item) => {

    setUploadDataLoading(true);



    try {
      const res = await userRequest.delete(
        `/upload/admin/product/assets/delete/${product?.id}?` +  "&filename=" +
          item + "&vin="+ product?.vin
      );
      setUploadDataLoading(false);
      setPictureDeleteSucc(res.data);

    } catch (err) {
      setPictureDeleteErr(err);
      setUploadDataLoading(false);
    }

  };


  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const filteredInputs = {};
    for (const key in inputs) {
      if (inputs[key].trim() !== "") {
        filteredInputs[key] = inputs[key];
      }
    }


    if (!file && Object.keys(filteredInputs).length === 0 ) {
      return getResultnotify("empty");
    }

    const folders = product?.imgUrls[0].split("/");




    setUploadDataLoading(true);
    if (file) {
      const formData = new FormData();

      file.forEach((file, index) => {
        const fileName = `${product?.vin}_${product?.name}_${index}.jpg`;
        formData.append("files", file, fileName); // Append each file with its respective filename
      });

      try {
        const res = await userRequest.post(
          `/upload/admin/product/assets/edit?vin=${
            inputs?.vin ? inputs?.vin : ""
          }&exfolder=${folders[2]}`  ,
          formData
        );

        const products = { ...filteredInputs, makes:selectedMake?.value,imgUrls: res?.data.filename };
        await _updateProductWithRedux(product.id, products, dispatch);
        _getProductsWithRedux(dispatch);
        setUploadDataLoading(false);
        setGetEditSuccess(res.data);

      } catch (err) {
        setUploadDataLoading(false);
        setGetEditError(err);
      }
    } else {
      try {
        if (Object.keys(filteredInputs).length !== 0) {
           await _updateProductWithRedux(
            product.id,
            { makes:selectedMake?.value,...filteredInputs },
            dispatch
          ).then(data => {

            setUploadDataLoading(false);
            if(data?.response?.status === 409 ){

            return   setGetEditError(data)
            }

            return setGetEditSuccess(data)
            }
            )
          _getProductsWithRedux(dispatch)

        }
      } catch (err) {
        setUploadDataLoading(false);
        setGetEditError(err);
      }
    }
  };

  //success/error message
  useEffect(() => {
    if (getEditSuccess) {
      return getResultnotify("ok");
    }
    if (getEditError?.response?.status === 409) {
      return getResultnotify("error409");
    }
    if (getEditError) {
      return getResultnotify("error");
    }

    if (pictureDeleteSucc) {
      return _getResultDeletenotify("ok");
    }
    if (pictureDeleteErr) {
      return _getResultDeletenotify("error");
    }
  }, [getEditSuccess, getEditError, pictureDeleteSucc, pictureDeleteErr]);

  useEffect(() => {
    if (getEditSuccess) {
      setTimeout(() => {
       setGetEditSuccess(null);
        setGetEditError(null);
        navigate(product?.by_admin ? "/admin/products":  "/admin/products/db2")
          setFile(null);
      }, 2000);
    }


  }, [getEditSuccess,]);


  useEffect(() => {
    if (pictureDeleteSucc) {
      _getProductsWithRedux(dispatch);
    }
  },[pictureDeleteSucc])

  const generateOptions = () => {
    const options = [];

    for (let i = 1; i <= 100; i++) {
      const value = (i / 10).toFixed(1);
      options.push(
        <MenuItem key={value} value={value}>
          {value}
        </MenuItem>
      );
    }

    return options;
  };


  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
      </div>
      <div className="productTop">
        <div className="productInfo">
          <Typography className="productInfoItem">
            <span className="productInfoKey">id:</span>
            <span className="productInfoValue">{product?.id}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Start Code:</span>
            <span className="productInfoValue">{product?.start_code}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">VinCode:</span>
            <span className="productInfoValue">{product?.vin}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Odometer:</span>
            <span className="productInfoValue">{product?.odometer ? product?.odometer : product?.odometer_to_string}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Primary Damage:</span>
            <span className="productInfoValue">{product?.primary_damage}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Secondary Damage:</span>
            <span className="productInfoValue">{product?.secondary_damage}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Key:</span>
            <span className="productInfoValue">{product?.key_type}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Engine :</span>
            <span className="productInfoValue">{product?.engine}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Models :</span>
            <span className="productInfoValue">{product?.model}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Makes :</span>
            <span className="productInfoValue">{product?.makes}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Transmission :</span>
            <span className="productInfoValue">{product?.transmission}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">cylindres:</span>
            <span className="productInfoValue">{product?.cylinder}</span>
          </Typography>

          <Typography className="productInfoItem">
            <span className="productInfoKey">Drive:</span>
            <span className="productInfoValue">{product?.drive_type}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Lot :</span>
            <span className="productInfoValue">{product?.lot}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">Price:</span>
            <span className="productInfoValue">{product?.final_bid_formatted}</span>
          </Typography>
          <Typography className="productInfoItem">
            <span className="productInfoKey">BodyStyle:</span>
            <span className="productInfoValue">{product?.body_style}</span>
          </Typography>
        </div>

        <div className="productInfoTop" >
          {product?.imgUrls?.map((i, x) => (
            <div key={x} className="productInfoImgDiv">
              <img
                key={x}
                src={`${ASSETS}${i}`}
                alt=""
                className="productInfoImg"

              />
              <span className="deleteImagespan" onClick={() => handleDeletePicture(i)}><Delete/></span>
            </div>
          ))}
        </div>
      </div>

      {file && (
        <div style={{ display: "flex", alignItems: "center", gap: 10  ,margin:"auto", width: " 80vw",overflow:'scroll'}}>
          {showImageFilesWithBlobs.map((blob, index) => (
            <div key={index} style={{borderRadius:20, position:"relative"}}>
              <img
                width={170}
                height={170}
                style={{
                  borderRadius: "10px",
                  objectFit: "contain ",
                  marginRight: "10px",
                }}
                src={blob}
                alt=""
              />
              <span
                onClick={() => removeImageFile(index)}
                style={{  cursor:"pointer", color: "red", position:"absolute", bottom: 0, right: 0 }}
              >
                <Delete />
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <TextField
              name="name"
              type="text"
              label="name"
              className="addProductItem"
              onChange={handleChange}
            />

            <TextField
              name="odometer"
              type="text"
              label="odometer"
              className="addProductItem"
              placeholder="(mi)"
              onChange={handleChange}
            />

            <TextField
              name="vin"
              type="text"
              label="Vin *"
              className="addProductItem"
              onChange={handleChange}
            />

            <TextField
              name="final_bid_formatted"
              type="number"
              label="Price *"
              className="addProductItem"
              placeholder="100"
              onChange={handleChange}
            />
            <TextField
              name="lot"
              type="text"
              label="Lot Name *"
              className="addProductItem"
              onChange={handleChange}
            />
            <TextField
              name="makes"
              type="text"
              label="Makes *"
              className="addProductItem"
              placeholder="f.e  (BMW)X5"
              onChange={handleChange}
            />
            <Autocomplete
          options={carmakes}
          getOptionLabel={(option) => option.value}
          value={selectedMake}
          onChange={handleModelChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Makes *"
              name="makes"
              variant="outlined"
            />
          )}
        />
            <TextField
              name="model"
              type="text"
              label="Model *"
              className="addProductItem"
              placeholder="f.e  (BMW)X5"
              onChange={handleChange}
            />
            <TextField
              name="body_style"
              type="text"
              label="Body Style *"
              className="addProductItem"
              onChange={handleChange}
            />

            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Engine *
              </InputLabel>
              <Select
                id="demo-simple-select-helper-label"
                value={inputs?.engine}
                className="addProductItem"
                onChange={handleChange}
                name="engine"
              >
                <MenuItem value="">
                  <em>Null</em>
                </MenuItem>
                {generateOptions()}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Start Code *
              </InputLabel>
              <Select
                id="demo-simple-select-helper-label"
                className="addProductItem"
                onChange={handleChange}
                value={inputs?.start_code}
                name="start_code"
              >
                <MenuItem value="">
                  <em>Null</em>
                </MenuItem>
                <MenuItem value={"unknown"}>Unkown</MenuItem>
                <MenuItem value={"starts"}>Starts</MenuItem>
                <MenuItem value={"run and drive"}>Run and Drive</MenuItem>
                <MenuItem value={"engine start program"}>
                  Engine Start Program
                </MenuItem>
                <MenuItem value={"stationary"}>Stationary</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Transmission *
              </InputLabel>
              <Select
                id="demo-simple-select-helper-label"
                className="addProductItem"
                onChange={handleChange}
                name="transmission"
                value={inputs?.transmission}
              >
                <MenuItem value="">
                  <em>Null</em>
                </MenuItem>
                <MenuItem value={"automatic"}>Automatic</MenuItem>
                <MenuItem value={"manual"}>Manual</MenuItem>
                <MenuItem value={"cvt"}>CVT</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Cylinder *
              </InputLabel>
              <Select
                id="demo-simple-select-helper-label"
                className="addProductItem"
                onChange={handleChange}
                name="cylinder"
                value={inputs?.cylinder}
              >
                <MenuItem value="">
                  <em>Null</em>
                </MenuItem>
                <MenuItem value={"2cyl"}> 2 cyl</MenuItem>
                <MenuItem value={"3cyl"}> 3 cyl</MenuItem>
                <MenuItem value={"4cyl"}> 4 cyl</MenuItem>
                <MenuItem value={"5cyl"}> 5 cyl</MenuItem>
                <MenuItem value={"6cyl"}> 6 cyl</MenuItem>
                <MenuItem value={"8cyl"}> 8 cyl</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Key *
              </InputLabel>
              <Select
                id="demo-simple-select-helper-label"
                className="addProductItem"
                onChange={handleChange}
                value={inputs?.key_type}
                name="key_type"
              >
                <MenuItem value="">
                  <em>Null</em>
                </MenuItem>
                <MenuItem value={"missing"}>Missing</MenuItem>
                <MenuItem value={"present"}>Present</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Drive Type *
              </InputLabel>
              <Select
                id="demo-simple-select-helper-label"
                className="addProductItem"
                onChange={handleChange}
                value={inputs?.drive_type}
                name="drive_type"
              >
                <MenuItem value="">
                  <em>Null</em>
                </MenuItem>
                <MenuItem value={"4wd"}>4WD</MenuItem>
                <MenuItem value={"fwd"}>FWD</MenuItem>
                <MenuItem value={"RWD"}>RWD</MenuItem>
                <MenuItem value={"AWD"}>AWD</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Fuel Type *
              </InputLabel>
              <Select
                id="demo-simple-select-helper-label"
                className="addProductItem"
                onChange={handleChange}
                value={inputs?.fuel_type}
                name="fuel_type"
              >
                <MenuItem value="">
                  <em>Null</em>
                </MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"gas"}>Gas</MenuItem>
                <MenuItem value={"diesel"}>Diesel</MenuItem>
                <MenuItem value={"electric"}>Electric</MenuItem>
                <MenuItem value={"hybrid"}>hybrid</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Primary Damage *
              </InputLabel>
              <Select
                id="demo-simple-select-helper-label"
                className="addProductItem"
                onChange={handleChange}
                value={inputs?.primary_damage}
                name="primary_damage"
              >
                <MenuItem value="">
                  <em>Null</em>
                </MenuItem>
                <MenuItem value={"None"}>None</MenuItem>
                <MenuItem value={"all over"}>All Over</MenuItem>
                <MenuItem value={"Biohazard/Chemical"}>
                  Biohazard/Chemical
                </MenuItem>
                <MenuItem value={"Burn"}>Burn</MenuItem>
                <MenuItem value={"Burn – Engine"}>Burn – Engine</MenuItem>
                <MenuItem value={"Burn – Interior"}>Burn – Interior</MenuItem>
                <MenuItem value={"Damage History"}>Damage History</MenuItem>
                <MenuItem value={"Frame Damage"}>Frame Damage</MenuItem>
                <MenuItem value={"Front & rear"}>Front & rear</MenuItem>
                <MenuItem value={"Front End"}>Front End</MenuItem>
                <MenuItem value={"Hail"}>Hail</MenuItem>
                <MenuItem value={"Mechanical"}>Mechanical</MenuItem>
                <MenuItem value={"Minor Dents/Scratches"}>
                  Minor Dents/Scratches
                </MenuItem>
                <MenuItem value={"Missing/Altered Vin"}>
                  Missing/Altered Vin
                </MenuItem>
                <MenuItem value={"Normal Wear"}>Normal Wear</MenuItem>
                <MenuItem value={"Partial Repair"}>Partial Repair</MenuItem>
                <MenuItem value={"Rear End"}>Rear End</MenuItem>
                <MenuItem value={"Rejected Repair"}>Rejected Repair</MenuItem>
                <MenuItem value={"Replaced Vin"}>Replaced Vin</MenuItem>
                <MenuItem value={"Rollover"}>Rollover</MenuItem>
                <MenuItem value={"Suspension"}>Suspension</MenuItem>
                <MenuItem value={"Side"}>Side</MenuItem>
                <MenuItem value={"Stripped"}>Stripped</MenuItem>
                <MenuItem value={"Top/Roof"}>Top/Roof</MenuItem>
                <MenuItem value={"Undercarriage"}>Undercarriage</MenuItem>
                <MenuItem value={"Unknown"}>Unknown</MenuItem>
                <MenuItem value={"Vandalism"}>Vandalism</MenuItem>
                <MenuItem value={"electrical"}>Electrical</MenuItem>
                <MenuItem value={"Water/Flood"}>Water/Flood</MenuItem>
                <MenuItem value={"Storm Damage"}>Storm Damage</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Secondary Damage *
              </InputLabel>
              <Select
                id="demo-simple-select-helper-label"
                className="addProductItem"
                onChange={handleChange}
                value={inputs?.secondary_damage}
                name="secondary_damage"
              >
                <MenuItem value="">
                  <em>Null</em>
                </MenuItem>
                <MenuItem value={"all over"}>All Over</MenuItem>
                <MenuItem value={"Biohazard/Chemical"}>
                  Biohazard/Chemical
                </MenuItem>
                <MenuItem value={"None"}>None</MenuItem>
                <MenuItem value={"Burn"}>Burn</MenuItem>
                <MenuItem value={"Burn – Engine"}>Burn – Engine</MenuItem>
                <MenuItem value={"Burn – Interior"}>Burn – Interior</MenuItem>
                <MenuItem value={"Damage History"}>Damage History</MenuItem>
                <MenuItem value={"Frame Damage"}>Frame Damage</MenuItem>
                <MenuItem value={"Front & rear"}>Front & rear</MenuItem>
                <MenuItem value={"Front End"}>Front End</MenuItem>
                <MenuItem value={"Hail"}>Hail</MenuItem>
                <MenuItem value={"Mechanical"}>Mechanical</MenuItem>
                <MenuItem value={"Minor Dents/Scratches"}>
                  Minor Dents/Scratches
                </MenuItem>
                <MenuItem value={"Missing/Altered Vin"}>
                  Missing/Altered Vin
                </MenuItem>
                <MenuItem value={"Normal Wear"}>Normal Wear</MenuItem>
                <MenuItem value={"Partial Repair"}>Partial Repair</MenuItem>
                <MenuItem value={"Rear End"}>Rear End</MenuItem>
                <MenuItem value={"Rejected Repair"}>Rejected Repair</MenuItem>
                <MenuItem value={"Replaced Vin"}>Replaced Vin</MenuItem>
                <MenuItem value={"Rollover"}>Rollover</MenuItem>
                <MenuItem value={"Side"}>Side</MenuItem>
                <MenuItem value={"Stripped"}>Stripped</MenuItem>
                <MenuItem value={"Top/Roof"}>Top/Roof</MenuItem>
                <MenuItem value={"Undercarriage"}>Undercarriage</MenuItem>
                <MenuItem value={"Unknown"}>Unknown</MenuItem>
                <MenuItem value={"Vandalism"}>Vandalism</MenuItem>
                <MenuItem value={"electrical"}>Electrical</MenuItem>
                <MenuItem value={"Water/Flood"}>Water/Flood</MenuItem>
                <MenuItem value={"Storm Damage"}>Storm Damage</MenuItem>
              </Select>
            </FormControl>
          </div>
          <ToastContainer />
          {uploadDataLoading && (
        <div className="newProduct-loading">
          <Loading/>
        </div>
      )}
          <div className="productFormRight">
            <div className="productUpload">
              <label htmlFor="file">
                <Publish />
              </label>
              <input
                type="file"
                id="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) =>
                  _handleUploadProductImage(
                    e,
                    setFile,
                    setShowImageFilesWithBlobs
                  )
                }
              />
            </div>
            <button className="productButton" onClick={handleUpdateProduct}>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Product;
