// import "./Header.css";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as yup from "yup";
import { baseUrl } from "../core";
import { GlobalContext } from "../context/Context";
import { useContext } from "react";
import Message from "./Message";

const validationSchemaStep1 = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
});

const validationSchemaStep2 = yup.object({
  otp: yup
  .string("Enter your email")
  .required("Email is required"),
  newPassword: yup
  .string("Enter your password")
  .min(8, "Password should be of minimum 8 characters length")
  .required("Password is required"),
  confirmPassword: yup
  .string("Enter your password")
  .min(8, "Password should be of minimum 8 characters length")
  .required("Password is required"),
});
const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href={baseUrl}>
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const theme = createTheme();

const ForgotPassword = () => {
  //   const [redirect, setRedirect] = useState(false);

  let history = useHistory();
  //   let { state, dispatch } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [messageBar, setMessageBar] = useState("");

  const formikStep1 = useFormik({
    validationSchema: validationSchemaStep1,
    initialValues: {
      email: "",
    },
    onSubmit: function (values) {
      setEmail(values.email);
      axios
        .post(`${baseUrl}/api/v1/otp`, {
          email: values.email,
        })
        .then((res) => {
          console.log("res: ", res.data);

          if (res.data.otpSent) {
            setStep(2);
          }
        });
    },
  });
  const formikStep2 = useFormik({
    validationSchema: validationSchemaStep2,
    initialValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: function (values) {
      console.log(values);

      axios
        .post(`${baseUrl}/api/v1/forgot_password`, {
          email: email,
          otp: values.otp,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        })
        .then((res) => {
          console.log("res: ", res.data);
          if (res.data === "password updated") {
            setMessageBar(true);
            
            setTimeout(() => {
              setMessageBar("");
              history.push("/Login");
            }, 1000 );
            
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setMessageBar(false);
            setTimeout(() => {
              setMessageBar("");
            }, 1000);
            return;
          }
        });
    },
  });
  return (
    <>
      <div>
        {messageBar === true ? (
          <Message type="success" message="Password Updated Successfully !" />
        ) : (
          ""
        )}
        {messageBar === false ? (
          <Message type="error" message="OTP is not valid" />
        ) : (
          ""
        )}
      </div>
      <ThemeProvider theme={theme}>
        <Grid
          container
          component="main"
          sx={{ height: "100vh", overflow: "hidden" }}
        >
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(https://source.unsplash.com/random)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Forgot Password
              </Typography>
              {step === 1 ? (
                <Box
                  component="form"
                  noValidate
                  fullWidth
                  onSubmit={formikStep1.handleSubmit}
                  sx={{ mt: 1, width: "100%" }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    color="primary"
                    variant="outlined"
                    value={formikStep1.values.email}
                    onChange={formikStep1.handleChange}
                    error={
                      formikStep1.touched.email &&
                      Boolean(formikStep1.errors.email)
                    }
                    helperText={
                      formikStep1.touched.email && formikStep1.errors.email
                    }
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    color="primary"
                    // disabled={(value.email = "")}
                  >
                    Send Email
                  </Button>
                </Box>
              ) : (
                <Box
                  component="form"
                  noValidate
                  fullWidth
                  onSubmit={formikStep2.handleSubmit}
                  sx={{ mt: 1, width: "100%" }}
                >
                  <TextField
                    fullWidth
                    margin="normal"
                    color="primary"
                    id="outlined-basic"
                    label="Otp"
                    variant="outlined"
                    name="otp"
                    value={formikStep2.values.otp}
                    onChange={formikStep2.handleChange}
                    error={
                      formikStep2.touched.otp && Boolean(formikStep2.errors.otp)
                    }
                    helperText={
                      formikStep2.touched.otp && formikStep2.errors.otp
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    color="primary"
                    id="outlined-basic"
                    label="New Password"
                    variant="outlined"
                    type="password"
                    name="newPassword"
                    value={formikStep2.values.newPassword}
                    onChange={formikStep2.handleChange}
                    error={
                      formikStep2.touched.newPassword &&
                      Boolean(formikStep2.errors.newPassword)
                    }
                    helperText={
                      formikStep2.touched.newPassword &&
                      formikStep2.errors.newPassword
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    color="primary"
                    id="outlined-basic"
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    name="confirmPassword"
                    value={formikStep2.values.confirmPassword}
                    onChange={formikStep2.handleChange}
                    error={
                      formikStep2.touched.confirmPassword &&
                      Boolean(formikStep2.errors.confirmPassword)
                    }
                    helperText={
                      formikStep2.touched.confirmPassword &&
                      formikStep2.errors.confirmPassword
                    }
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    color="primary"
                  >
                    Update Password
                  </Button>
                </Box>
              )}
              <Grid container>
                <Grid item xs>
                  <Link
                    onClick={() => {
                      history.push("/login");
                    }}
                    variant="body2"
                  >
                    Login
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    onClick={() => {
                      history.push("/signup");
                    }}
                    variant="body2"
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default ForgotPassword;
