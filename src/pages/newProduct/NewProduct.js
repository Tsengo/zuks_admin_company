import { Fragment, useEffect, useState } from "react";
import "./newproduct.css";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { _addProductWithRedux } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";
import { userRequest } from "../../utils/requestMethods";
import { ToastContainer, toast } from "react-toastify";
import { getResultnotify } from "../../components/_resultsuccess/resultNotify";
import { _handleUploadProductImage } from "../../utils/handleEvents";
import Loading from "../../components/_customloading/Loading";
import { useNavigate } from "react-router-dom";
import { carmakes } from "../../components/Sections/allMakes";
const ASSETS = "http://localhost:8282/";
function NewProduct() {
  const inputsdata = {
    key: "",
    fuel: "",
    startcode: "",
    transmission: "",
    drive: "",
    primarydamage: "",
    secondarydamage: "",
    cylindres: "",
    engine: "",
    title: "",
    date: "",
  };
  const [inputs, setInputs] = useState(inputsdata);
  const [showImageFilesWithBlobs, setShowImageFilesWithBlobs] = useState(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(null);
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [uploadDataLoading, setUploadDataLoading] = useState(false);
  const [selectedMake, setSelectedMake] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleClick = async (e) => {
    e.preventDefault();

    const isObjectEmpty = Object.values(inputs).every((value) => value !== "");

    const isObjectEmptySome = Object.values(inputs).some(
      (value) => value === ""
    );
    if (!file || !isObjectEmpty) {
      return getResultnotify("empty");
    }

    if (file && isObjectEmptySome) {
      return getResultnotify("empty");
    }
    if (file && isObjectEmpty) {
      setUploadDataLoading(true);
      const formData = new FormData();

      file.forEach((file, index) => {
        const fileName = `${Date.now()}_${inputs?.title}_${index}.jpg`;
        formData.append("files", file, fileName); // Append each file with its respective filename
      });

      try {
        const res = await userRequest.post(
          "/upload/admin/product/assets?vin=" + inputs.vin,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const product = {
          ...inputs,
          makes: selectedMake?.value,
          productPicture: res.data.filenames,
          foldername: res.data.folder,
        };
        setUploadDataLoading(false);
        await _addProductWithRedux(product, dispatch).then((data) =>
          setFileUploadSuccess(data)
        );
      } catch (err) {
        setUploadDataLoading(false);
        setFileUploadError(err);
      }
    }
  };

  useEffect(() => {
    if (fileUploadSuccess) {
      return getResultnotify("ok");
    }

    if (fileUploadError?.response.status === 409) {
      return getResultnotify("error409");
    }

    if (fileUploadError?.response.status === 500) {
      return getResultnotify("error");
    }
  }, [fileUploadError, fileUploadSuccess]);

  useEffect(() => {
    if (fileUploadSuccess) {
      setTimeout(() => {
        setFileUploadSuccess(null);
        setFileUploadError(null);
        navigate("/admin/products");
      }, 2000);
    }
  }, [fileUploadSuccess]);
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

  const generateDateOptions = () => {
    const options = [];

    for (let i = 1900; i <= 2024; i++) {
      const value = i;
      options.push(
        <MenuItem key={value} value={value}>
          {value}
        </MenuItem>
      );
    }

    return options.slice().reverse();
  };

  return (
    <div className="newProduct">
      <form className="addProductForm">
        <h1 className="addProductTitle">New Product</h1>
        <div className="addProductItem">
          <label
            htmlFor="file"
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            Image *
            <span
              style={{
                padding: 8,
                outline: "none",
                fontSize: 16,
                width: "40%",
                textAlign: "center",
                margin: "0px auto",
                background: "black",
                color: "white",
                borderRadius: 8,
              }}
            >
              Upload Image
            </span>
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) =>
              _handleUploadProductImage(e, setFile, setShowImageFilesWithBlobs)
            }
            multiple
            accept="image/*"
            hidden
          />
        </div>

        <TextField
          name="title"
          type="text"
          label="name"
          className="addProductItem"
          onChange={handleChange}
        />
        <TextField
          name="lot"
          type="text"
          label="Lot*"
          className="addProductItem"
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
          name="price"
          type="number"
          label="Price *"
          className="addProductItem"
          placeholder="100"
          onChange={handleChange}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-helper-label">
            Primary Damage *
          </InputLabel>
          <Select
            id="demo-simple-select-helper-label"
            className="addProductItem"
            onChange={handleChange}
            value={inputs?.primarydamage}
            name="primarydamage"
          >
            <MenuItem value="">
              <em>Null</em>
            </MenuItem>
            <MenuItem value={"None"}>None</MenuItem>
            <MenuItem value={"all over"}>All Over</MenuItem>
            <MenuItem value={"Biohazard/Chemical"}>Biohazard/Chemical</MenuItem>
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
            value={inputs?.secondarydamage}
            name="secondarydamage"
          >
            <MenuItem value="">
              <em>Null</em>
            </MenuItem>
            <MenuItem value={"None"}>None</MenuItem>
            <MenuItem value={"all over"}>All Over</MenuItem>
            <MenuItem value={"Biohazard/Chemical"}>Biohazard/Chemical</MenuItem>
            <MenuItem value={"Burn"}>Burn</MenuItem>
            <MenuItem value={"Burn – Engine"}>Burn – Engine</MenuItem>
            <MenuItem value={"Burn – Interior"}>Burn – Interior</MenuItem>
            <MenuItem value={"Damage History"}>Damage History</MenuItem>
            <MenuItem value={"Frame Damage"}>Frame Damage</MenuItem>
            <MenuItem value={"Front End"}>Front End</MenuItem>
            <MenuItem value={"Front & rear"}>Front & rear</MenuItem>
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
        <TextField
          name="odometer"
          type="text"
          label="odometer"
          className="addProductItem"
          placeholder="(mi)"
          onChange={handleChange}
        />

              <FormControl>
                <InputLabel id="demo-simple-select-helper-label">
                  Start Code *
                </InputLabel>
                <Select
                  id="demo-simple-select-helper-label"
                  className="addProductItem"
                  onChange={handleChange}
                  value={inputs?.startcode}
                  name="startcode"
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
          <InputLabel id="demo-simple-select-helper-label">Key *</InputLabel>
          <Select
            id="demo-simple-select-helper-label"
            className="addProductItem"
            onChange={handleChange}
            value={inputs?.key}
            name="key"
          >
            <MenuItem value="">
              <em>Null</em>
            </MenuItem>
            <MenuItem value={"Unknown"}>Unknown</MenuItem>
            <MenuItem value={"missing"}>Missing</MenuItem>
            <MenuItem value={"present"}>Present</MenuItem>
          </Select>
        </FormControl>
         <TextField
          name="bodystyle"
          type="text"
          label="Body Style *"
          className="addProductItem"
          placeholder="BMW"
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
          value={inputs?.model}
          placeholder="f.e  (BMW)X5"
          onChange={handleChange}
        />
       

        <FormControl>
          <InputLabel id="demo-simple-select-helper-label">Date *</InputLabel>
          <Select
            id="demo-simple-select-helper-label"
            value={inputs?.date}
            className="addProductItem"
            onChange={handleChange}
            name="date"
          >
            <MenuItem value="">
              <em>Null</em>
            </MenuItem>
            <MenuItem value={"Unknown"}>Unknown</MenuItem>
            {generateDateOptions()}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="demo-simple-select-helper-label">Engine *</InputLabel>
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
            <MenuItem value={"Unknown"}>Unknown</MenuItem>
            {generateOptions()}
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
            <MenuItem value={"Unknown"}>Unknown</MenuItem>
            <MenuItem value={"automatic"}>Automatic</MenuItem>
            <MenuItem value={"manual"}>Manual</MenuItem>
            <MenuItem value={"cvt"}>CVT</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="demo-simple-select-helper-label">
            Cylinders *
          </InputLabel>
          <Select
            id="demo-simple-select-helper-label"
            className="addProductItem"
            onChange={handleChange}
            name="cylindres"
            value={inputs?.cylindres}
          >
            <MenuItem value="">
              <em>Null</em>
            </MenuItem>
            <MenuItem value={"Unknown"}>Unknown</MenuItem>
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
            Drive Type *
          </InputLabel>
          <Select
            id="demo-simple-select-helper-label"
            className="addProductItem"
            onChange={handleChange}
            value={inputs?.drive}
            name="drive"
          >
            <MenuItem value="">
              <em>Null</em>
            </MenuItem>
            <MenuItem value={"Unknown"}>Unknown</MenuItem>
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
            value={inputs?.fuel}
            name="fuel"
          >
            <MenuItem value="">
              <em>Null</em>
            </MenuItem>
            <MenuItem value={"Unknown"}>Unknown</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
            <MenuItem value={"gas"}>Gas</MenuItem>
            <MenuItem value={"diesel"}>Diesel</MenuItem>
            <MenuItem value={"electric"}>Electric</MenuItem>
            <MenuItem value={"hybrid"}>hybrid</MenuItem>
          </Select>
        </FormControl>

        <Button onClick={handleClick} className="addProductButton">
          Create
        </Button>
      </form>
      <ToastContainer />
      {uploadDataLoading && (
        <div className="newProduct-loading">
          <Loading />
        </div>
      )}
      <div className="ImageShowerContainer">
        {file && (
          <>
            {showImageFilesWithBlobs.map((blob, index) => (
              <div key={index}>
                <img
                  width={170}
                  height={170}
                  style={{
                    borderRadius: "5px",
                    objectFit: "contain",

                    marginRight: "10px",
                  }}
                  src={blob}
                  alt=""
                />
                <span
                  onClick={() => removeImageFile(index)}
                  style={{ fontSize: 18, color: "blue" }}
                >
                  <img
                    width="50"
                    height="50"
                    src={ASSETS + "/closeimage.png"}
                    alt=""
                  />
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default NewProduct;
