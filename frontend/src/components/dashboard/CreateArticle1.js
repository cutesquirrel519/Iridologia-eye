import React, { useState, useRef, useEffect } from 'react';
import { useHistory, Link, withRouter } from 'react-router-dom';
import { InputBase } from '@material-ui/core';
import { useParams } from "react-router"
import ArticleImage from "./articleImage/article-image"
import { Typography, Box, TextField, Select, InputLabel, RadioGroup, FormControlLabel, Radio, Checkbox, Button, FormControl } from '@material-ui/core';
import { format } from 'date-fns';
import MuiGrid from '@material-ui/core/Grid';
import moment from 'moment';
import Axios from 'axios';
import { connect } from "react-redux";
import classnames from "classnames";
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSelector, useDispatch } from 'react-redux';

import JsonData1 from '../layout/data/data_en.json';
import JsonData2 from '../layout/data/data_fr.json';
import JsonData3 from '../layout/data/data_it.json';
import JsonData4 from '../layout/data/data_pt.json';
import JsonData5 from '../layout/data/data_es.json';

import { makeStyles, withStyles } from "@material-ui/core/styles";

import Snackbar from '@material-ui/core/Snackbar';
import SnackBar from 'my-react-snackbar';

var prev = "4";

const useStyles = makeStyles({
  underline: {
    "&&&:before": {
      borderBottom: "none"
    },
    "&&:after": {
      borderBottom: "none"
    }
  },
  customStyle: {
    height: "1rem!important"
  }
});

const Grid = withStyles({
  root: {
    padding: '5px 20px!important'
  }
})(MuiGrid);


function CreateArticle1(props) {

  const classes = useStyles();

  const history = useHistory();
  const { match, auth } = props;
  let { id } = match.params;

  const [SaveData, setSaveData] = useState(false);
  const Now_date = moment(new Date()).format('YYYY-MM-DD\T\hh:mm');


  const [leftImage, setLeftImage] = useState("");
  const [rightImage, setRightImage] = useState("");
  const [Status, setStatus] = useState();
  const name = useRef();
  const email = useRef();
  const contact = useRef();
  const profession = useRef();
  const reasonConsultation = useRef();
  const takeScan = useRef();
  const haveDisease = useRef();
  const newInfo = useRef();
  const [birthdate, setBirthdate] = useState(moment(new Date()).format('YYYY-MM-DD\T\hh:mm'));

  const [gender, setGender] = useState(true);
  const [fields, setFields] = useState([{ value: Now_date }]);

  const [landingPageData, setLandingPageData] = useState(JsonData4);
  const { translateFlag } = useSelector(state => state.translator);
  const [renderFlag, setRenderFlag] = useState(true);
  const [existing_patient, setExisting_patient] = useState(false);
  const [Buy_space, setBuy_space] = useState(false);
  const [imageError, setImageError] = useState(false);


  const getlandingPageData = (flag) => {
    switch (flag) {
      case "1":
        prev = "1";
        return setLandingPageData(JsonData1)
      case "2":
        prev = "2";
        return setLandingPageData(JsonData2)
      case "3":
        prev = "3";
        return setLandingPageData(JsonData3)
      case "4":
        prev = "4";
        return setLandingPageData(JsonData4)
      case "5":
        prev = "5";
        return setLandingPageData(JsonData5)
      default:
        return null;
    }
  }

  useEffect(() => {
    console.log("test is ", translateFlag)
    if (prev !== translateFlag) {
      getlandingPageData(translateFlag)
      console.log("dashboard updated", translateFlag)
    }
    else {
      if (renderFlag) {
        getlandingPageData(translateFlag);
        setRenderFlag(false)
      }
    }
  })


  const Save_article = (e) => {
    e.preventDefault();
    setSaveData(true);
    Axios({
      method: "POST",
      url: "/api/patients/create-patient",
      data: {
        doctor: auth.user.id,
        name: name.current.value,
        email: email.current.value,
        contact: contact.current.value,
        profession: profession.current.value,
        gender: gender ? "male" : "female",
        birthdate: birthdate.replace(/T/, ' '),
        reasonConsultation: reasonConsultation.current.value,
        takeScan: takeScan.current.value,
        haveDisease: haveDisease.current.value,
        newInfo: newInfo.current.value,
        leftEye: leftImage,
        rightEye: rightImage,
        consultantDate: fields

      }
    }).then(res => {
      history.push("/dashboard")
    }).catch(err => {
      if (err.response.status === 402) {
        setBuy_space(true);
        return
      }
      if (err.response.status === 400) {
        setImageError(true);
        return
      }
    })
  }

  const Add_leftImage = (count) => {
    setLeftImage(String(count))
  }

  const Add_rightImage = (count) => {
    setRightImage(String(count))
  }


  // useEffect(()=>{
  //   if(Imagepath){
  //     console.log(Imagepath)
  //   }
  // })


  const birthDate_onChange = (e, x) => {
    setBirthdate(e.target.value)
    console.log(birthdate.replace(/T/, ' '))
    console.log(auth.user.id)
  }

  const consultantDate_onChange = (e, idx) => {
    console.log(idx)
    let newArr = [...fields];
    newArr[idx] = e.target.value;
    setFields(newArr)
    console.log(newArr)
  }

  function handleChange(i, event) {
    const values = [...fields];
    values[i].value = event.target.value;
    setFields(values);
  }

  function handleAdd() {
    const values = [...fields];
    values.push({ value: Now_date });
    setFields(values);
  }

  function handleRemove(i) {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
  }
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setExisting_patient(false);
    setBuy_space(false);
  };
  return (
    <div className="CreateDepartment1Container">
      
        <SnackBar
          open={Buy_space}
          message={landingPageData ? landingPageData.CreatePatient.spaceAlert : "loading"}
          position='bottom-center'
          type='warning'
          yesLabel='Ok'
          onYes={() => {}}
        />
        <SnackBar
          open={imageError}
          message={landingPageData ? landingPageData.CreatePatient.addImageAlert : "loading"}
          position='bottom-center'
          type='warning'
          yesLabel='Ok'
          onYes={() => {setImageError(false)}}
        />
      <form onSubmit={Save_article}>
        <Box mb={5}><Typography variant="h4">{landingPageData ? landingPageData.CreatePatient.title : "loading"}</Typography></Box>
        <Grid container spacing={6}>

          <Grid item sm={6} xs={12} md={6}>
            <Box><Typography variant="h6">{landingPageData ? landingPageData.CreatePatient.name : "loading"}</Typography></Box>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              label={landingPageData ? landingPageData.CreatePatient.name : "loading"}
              inputRef={name}
              error={Status === "Please input your name of department"}
              autoComplete="off"
              type="text"
              style={{ marginTop: '5px' }}
              onChange={() => {
                if (Status === "Please input your name of department") {
                  setStatus(null);
                }
              }}
              helperText={(() => {
                if (Status === "Please input your name of department") {
                  return "email already exist"
                }
                return null;
              })()}
              FormHelperTextProps={{ error: true }}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={6}>
            <Box><Typography variant="h6">{landingPageData ? landingPageData.CreatePatient.email : "loading"}</Typography></Box>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={landingPageData ? landingPageData.CreatePatient.email : "loading"}
              inputRef={email}
              error={Status === "Please input your name of department"}
              autoComplete="off"
              type="email"
              style={{ marginTop: '5px' }}
              onChange={() => {
                if (Status === "Please input your name of department") {
                  setStatus(null);
                }
              }}
              helperText={(() => {
                if (Status === "Please input your name of department") {
                  return "email already exist"
                }
                return null;
              })()}
              FormHelperTextProps={{ error: true }}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={6} >
            <Box><Typography variant="h6">{landingPageData ? landingPageData.CreatePatient.contact : "loading"}</Typography></Box>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              label={landingPageData ? landingPageData.CreatePatient.contact : "loading"}
              inputRef={contact}
              error={Status === "Please input your name of department"}
              autoComplete="off"
              type="text"
              style={{ marginTop: '5px' }}
              onChange={() => {
                if (Status === "Please input your name of department") {
                  setStatus(null);
                }
              }}
              helperText={(() => {
                if (Status === "Please input your name of department") {
                  return "email already exist"
                }
                return null;
              })()}
              FormHelperTextProps={{ error: true }}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={6}>
            <Box><Typography variant="h6">{landingPageData ? landingPageData.CreatePatient.profession : "loading"}</Typography></Box>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={landingPageData ? landingPageData.CreatePatient.profession : "loading"}
              inputRef={profession}
              error={Status === "Please input your name of department"}
              autoComplete="off"
              type="text"
              style={{ marginTop: '5px' }}
              onChange={() => {
                if (Status === "Please input your name of department") {
                  setStatus(null);
                }
              }}
              helperText={(() => {
                if (Status === "Please input your name of department") {
                  return "email already exist"
                }
                return null;
              })()}
              FormHelperTextProps={{ error: true }}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={6}>
            <Box><Typography variant="h6">{landingPageData ? landingPageData.CreatePatient.reason : "loading"}</Typography></Box>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={landingPageData ? landingPageData.CreatePatient.reason : "loading"}
              inputRef={reasonConsultation}
              error={Status === "Please input your name of department"}
              autoComplete="off"
              type="text"
              style={{ marginTop: '5px' }}
              onChange={() => {
                if (Status === "Please input your name of department") {
                  setStatus(null);
                }
              }}
              helperText={(() => {
                if (Status === "Please input your name of department") {
                  return "email already exist"
                }
                return null;
              })()}
              FormHelperTextProps={{ error: true }}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={6}>
            <Box><Typography variant="h6">{landingPageData ? landingPageData.CreatePatient.have : "loading"}</Typography></Box>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={landingPageData ? landingPageData.CreatePatient.have : "loading"}
              inputRef={haveDisease}
              error={Status === "Please input your name of department"}
              autoComplete="off"
              type="text"
              style={{ marginTop: '5px' }}
              onChange={() => {
                if (Status === "Please input your name of department") {
                  setStatus(null);
                }
              }}
              helperText={(() => {
                if (Status === "Please input your name of department") {
                  return "email already exist"
                }
                return null;
              })()}
              FormHelperTextProps={{ error: true }}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={6}>
            <Box><Typography variant="h6">{landingPageData ? landingPageData.CreatePatient.exam : "loading"}</Typography></Box>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={landingPageData ? landingPageData.CreatePatient.exam : "loading"}
              inputRef={takeScan}
              error={Status === "Please input your name of department"}
              autoComplete="off"
              type="text"
              onChange={() => {
                if (Status === "Please input your name of department") {
                  setStatus(null);
                }
              }}
              helperText={(() => {
                if (Status === "Please input your name of department") {
                  return "email already exist"
                }
                return null;
              })()}
              FormHelperTextProps={{ error: true }}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={6}>
            <Box><Typography variant="h6">{landingPageData ? landingPageData.CreatePatient.other : "loading"}</Typography></Box>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={landingPageData ? landingPageData.CreatePatient.other : "loading"}
              inputRef={newInfo}
              error={Status === "Please input your name of department"}
              autoComplete="off"
              type="text"
              onChange={() => {
                if (Status === "Please input your name of department") {
                  setStatus(null);
                }
              }}
              helperText={(() => {
                if (Status === "Please input your name of department") {
                  return "email already exist"
                }
                return null;
              })()}
              FormHelperTextProps={{ error: true }}
            />
          </Grid>
          <Grid item sm={6} xs={12} md={6} style={{ display: 'inline-grid', marginTop: '10px' }}>
            <Box><Typography variant="h6">{landingPageData ? landingPageData.CreatePatient.gender : "loading"}</Typography></Box>
            <Box>
              <FormControlLabel
                control={<Checkbox checked={gender} onChange={() => setGender(!gender)} name="checkedG" />}
                label={landingPageData ? landingPageData.CreatePatient.male : "loading"}
              />
            </Box>
            <Box>
              <FormControlLabel
                control={<Checkbox checked={!gender} onChange={() => setGender(!gender)} name="checkedG" />}
                label={landingPageData ? landingPageData.CreatePatient.female : "loading"}
              />
            </Box>
          </Grid>
          <Grid item sm={6} xs={12} md={6}>
            <Box mb={1} mt={2}><Typography variant="h6">{landingPageData ? landingPageData.CreatePatient.birthdate : "loading"}</Typography></Box>
            <TextField
              id="datetime-local"
              type="datetime-local"
              value={birthdate}
              InputProps={{ classes }}

              onChange={birthDate_onChange}
              defaultValue={Now_date}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item sm={6} xs={12} md={6}>
            <Box mt={2} mb={3}><Typography variant="h4">{landingPageData ? landingPageData.CreatePatient.rightEye : "loading"}</Typography></Box>
            <ArticleImage
              Update_image={Add_rightImage}
              uploadURL="/api/patients/upload-right-eye"
              size={100} />
          </Grid>

          <Grid item sm={6} xs={12} md={6}>
            <Box mt={2} mb={3}><Typography variant="h4">{landingPageData ? landingPageData.CreatePatient.leftEye : "loading"}</Typography></Box>
            <ArticleImage
              Update_image={Add_leftImage}
              uploadURL="/api/patients/upload-left-eye"
              size={100}
            />

          </Grid>

        </Grid>
        <div style={{ display: 'flex', paddingRight: '15px', justifyContent: 'flex-end' }}>

          <Button startIcon={<SaveIcon />} size="large" style={{ marginTop: "40px", float: "right" }} variant="contained" color="primary" type="submit" >{landingPageData ? landingPageData.CreatePatient.saveButton : "loading"}</Button>
        </div>
      </form>
      <br />
      <br />
    </div>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(CreateArticle1));