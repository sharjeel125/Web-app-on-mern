// import { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import * as yup from "yup";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../core";

import { GlobalContext } from "../context/Context";
import { useContext } from "react";

const validationSchema = yup.object({
  title: yup.string("Enter your email").required("Email is required"),
});

const Posts = () => {
  let { state } = useContext(GlobalContext);

  const [todo, settodo] = useState([]);
  const [itemChange, setItemChange] = useState(true);
  let [isLogged, setIsLogged] = useState(false);
  axios
    .get(`${baseUrl}/api/v1/getcookie`)
    .then((res) => {
      setIsLogged(true);
    })
    .catch((e) => {
      console.log("error: ", e);
      setIsLogged(false);
    });

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/v1/post`, { withCredentials: true })
      .then((res) => {
        console.log("res: ", res.data);
        settodo(res.data);
      })
      .catch((e) => {
        console.log("error: ", e);
      });
  }, [itemChange]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: function (values) {
      console.log("values: ", values);
      axios
        .post(
          `${baseUrl}/api/v1/post`,
          {
            title: values.title,
            description: values.description,
            firstName: state?.user?.firstName,
            access_token: state.user.access_token,
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log("res: ", res.data);
          setItemChange(!itemChange);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    },
    validationSchema: validationSchema,
  });

  const deletePost = (id) => {
    axios
      .delete(`${baseUrl}/api/v1/post`, {
        data: {
          id: id.target.parentNode.id,
          access_token: state.user.access_token,
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log("res: ", res.data);
        setItemChange(!itemChange);
      })
      .catch((e) => {
        console.log("error: ", e);
      });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, m: 2 }}>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Posts
        </Typography>
        {isLogged ? (
          <Typography variant="h6" component="div" sx={{ my: 2, flexGrow: 1 }}>
            Please login to Add/Remove Posts
          </Typography>
        ) : (
          <Box component="div">
            <Box
              component="form"
              noValidate
              onSubmit={formik.handleSubmit}
              sx={{ mt: 1 }}
            >
              <Paper style={{ margin: 16, padding: 16 }} elevation={3}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid xs={5} md={10} item style={{ paddingRight: 16 }}>
                    <TextField
                      fullWidth
                      placeholder="Title"
                      color="primary"
                      id="outlined-basic"
                      label="Title"
                      variant="filled"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.title && Boolean(formik.errors.title)
                      }
                      helperText={formik.touched.title && formik.errors.title}
                    />
                  </Grid>
                  <Grid xs={5} md={10} item style={{ paddingRight: 16 }}>
                    <TextField
                      fullWidth
                      color="primary"
                      id="outlined-basic"
                      placeholder="Description"
                      label="Description"
                      variant="filled"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.description &&
                        Boolean(formik.errors.description)
                      }
                      helperText={
                        formik.touched.description && formik.errors.description
                      }
                    />
                  </Grid>
                  <Grid xs={2} md={2} item>
                    <Button
                      fullWidth
                      color="success"
                      variant="contained"
                      type="submit"
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
            <Paper style={{ margin: 16, padding: 16 }} elevation={3}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Recently Added:
              </Typography>
              <List spacing={3}>
                {todo.map((eachTodo) => {
                  return (
                    <Paper
                      style={{ margin: 10 }}
                      elevation={3}
                      id={eachTodo._id}
                      key={eachTodo._id}
                    >
                      <ListItem
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(eachTodo) => deletePost(eachTodo)}
                            id={eachTodo._id}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={eachTodo.title}
                          secondary={
                            eachTodo.description + " By " + eachTodo.firstName
                          }
                        />
                      </ListItem>
                    </Paper>
                  );
                })}
              </List>
            </Paper>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Posts;
