import axios from "axios";
import { useState, useEffect } from "react";
import { baseUrl } from "../core";
import Header from "../components/Header";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import io from "socket.io-client";

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

function LiveScore() {
  const [score, setScore] = useState({});

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/v1/score`, { withCredentials: true })
      .then((res) => {
        console.log("res +++: ", res.data);
        setScore(res.data);
      });
  }, []);

  useEffect(() => {
    const socket = io(baseUrl); // to connect with locally running Socker.io server

    socket.on("connect", function () {
      console.log("connected to server");
    });
    socket.on("disconnect", function (message) {
      console.log("disconnected from server: ", message);
    });
    socket.on("SCORE", function (data) {
      console.log(data);
      setScore(data);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <Header />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Typography component="h1" variant="h4" sx={{ my: 3,mx: 3 }}>
          Live Score
        </Typography>
        <Typography component="h2" variant="h5" sx={{ my: 3,mx: 3 }}>
          Match
        </Typography>
        <Stack
          spacing={2}
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="space-around"
          alignItems="center"
        >
          <Stack
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h2" variant="h5" sx={{ my: 3 }}>
              {score?.teamOne}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              ({score.teamOneStatus})
            </Typography>
            <Typography variant="h4" component="div">
              {score?.teamOneScore} / {score?.teamOneWicket}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              ({score.teamOneOver} overs)
            </Typography>
          </Stack>
          <Stack
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h2" variant="h5" sx={{ my: 3 }}>
              {score?.teamTwo}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              ({score.teamTwoStatus})
            </Typography>
            <Typography variant="h4" component="div">
              {score?.teamTwoScore} / {score?.teamTwoWicket}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              ({score.teamTwoOver} overs)
            </Typography>
          </Stack>
        </Stack>
        <Stack
          spacing={2}
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="space-around"
          alignItems="center"
          sx={{ my: 5 }}
        >
          <Typography variant="h5" component="div">
            comentry: {score?.comentry || "Hassan Ali just droped the catch"}
          </Typography>
        </Stack>
        <Stack
          spacing={2}
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="space-around"
          alignItems="center"
          sx={{ my: 5 }}
        >
          <Typography variant="h5" component="div">
            Live from Stadium
          </Typography>
        </Stack>
        <Copyright sx={{ my: 5 }} />
      </ThemeProvider>
    </>
  );
}

export default LiveScore;
