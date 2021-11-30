import axios from "axios";
import { useState, useEffect } from "react";
import { baseUrl } from "../core";
import Header from "../components/Header";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import LiveScore from "./LiveScore";

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

function LiveScoreAdmin() {
  const [score, setScore] = useState({
    teamOne: "",
    teamOneFlag: "https://source.unsplash.com/random",
    teamOneStatus: "",
    teamOneScore: "",
    teamOneWicket: "",
    teamOneOver: "",
    teamTwo: "",
    teamTwoFlag: "https://source.unsplash.com/random",
    teamTwoStatus: "",
    teamTwoScore: "",
    teamTwoWicket: "",
    teamTwoOver: "",
    commentry: "",
  });

  const [countries, setCountries] = useState({});

  let [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/v1/getcookie`)
      .then((res) => {
        setIsLogged(true);
        console.log(isLogged);
      })
      .catch((e) => {
        console.log("error: ", e);
        setIsLogged(false);
      });
  }, [isLogged]);
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/v1/score`, { withCredentials: true })
      .then((res) => {
        console.log("res +++: ", res.data);
        setScore(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json"
      )
      .then((res) => {
        console.log("flags +++: ", res.data);
        setCountries(res.data);
      });
  }, []);

  const submit = () => {
    axios
      .post(`${baseUrl}/api/v1/score`, score, { withCredentials: true })
      .then((res) => {
        console.log("res: ", res.data);
      });
  };

  return (
    <>
      <Header />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Typography component="h1" variant="h4" sx={{ my: 3 }}>
          Dashboard Control page
        </Typography>
        <Typography component="h2" variant="h5" sx={{ my: 3 }}>
          Match
        </Typography>
        {!isLogged ? (
          <Typography variant="h6" component="div" sx={{ my: 2, flexGrow: 1 }}>
            Please login to Add/Update Scores
          </Typography>
        ) : (
          <Box component="form" noValidate autoComplete="off" fullWidth>
            <Stack
              spacing={2}
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              justifyContent="end"
              alignItems="center"
              sx={{ my: 5 }}
            >
              <Button variant="contained" onClick={submit}>
                Go Live!
              </Button>
            </Stack>
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
                {/* <Image src='https://source.unsplash.com/random' /> */}
                <TextField
                  label="Team 1"
                  variant="standard"
                  value={score.teamOne}
                  onChange={(e) => {
                    setScore((prev) => {
                      return { ...prev, teamOne: e.target.value };
                    });
                  }}
                  placeholder="Enter Team One"
                />
                <InputLabel id="team-one-label-id">Team 1</InputLabel>
                <Select
                  sx={{ minWidth: 150 }}
                  labelId="team-one-label-id"
                  id="team-one-input"
                  variant="standard"
                  value={score.teamOne}
                  onChange={(e) => {
                    setScore((prev) => {
                      return { ...prev, teamOne: e.target.value };
                    });
                  }}
                  label="Team 1"
                >
                  {countries
                    ? countries.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item.code}>
                            {item.name}
                          </MenuItem>
                        );
                      })
                    : null}
                </Select>
                <TextField
                  label="Status"
                  variant="standard"
                  value={score.teamOneStatus}
                  onChange={(e) => {
                    setScore((prev) => {
                      return { ...prev, teamOneStatus: e.target.value };
                    });
                  }}
                  placeholder="Status Of Team"
                />
                <Box component="div">
                  <TextField
                    label="Score"
                    variant="standard"
                    type="number"
                    value={score.teamOneScore}
                    sx={{ mx: 1 }}
                    onChange={(e) => {
                      setScore((prev) => {
                        return { ...prev, teamOneScore: e.target.value };
                      });
                    }}
                    placeholder="What's The Score"
                  />
                  <TextField
                    label="Wicket(s)"
                    variant="standard"
                    type="number"
                    value={score.teamOneWicket}
                    sx={{ mx: 1 }}
                    onChange={(e) => {
                      setScore((prev) => {
                        return { ...prev, teamOneWicket: e.target.value };
                      });
                    }}
                    placeholder="How Many Wickets"
                  />
                </Box>
                <TextField
                  label="Over(s)"
                  variant="standard"
                  type="number"
                  value={score.teamOneOver}
                  onChange={(e) => {
                    setScore((prev) => {
                      return { ...prev, teamOneOver: e.target.value };
                    });
                  }}
                  placeholder="How Many Overs"
                />
              </Stack>
              <Stack
                spacing={2}
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                {/* <Image src='https://source.unsplash.com/random' /> */}
                {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar> */}
                <TextField
                  label="Team 2"
                  variant="standard"
                  value={score.teamTwo}
                  onChange={(e) => {
                    setScore((prev) => {
                      return { ...prev, teamTwo: e.target.value };
                    });
                  }}
                  placeholder="Enter Team Two"
                />
                <InputLabel id="team-two-label-id">Team 2</InputLabel>
                <Select
                  sx={{ minWidth: 150 }}
                  labelId="team-two-label-id"
                  id="team-two-input"
                  variant="standard"
                  value={score.teamTwo}
                  onChange={(e) => {
                    setScore((prev) => {
                      return { ...prev, teamTwo: e.target.value };
                    });
                  }}
                  label="Team 1"
                >
                  {countries
                    ? countries.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item.code}>
                            {item.name}
                          </MenuItem>
                        );
                      })
                    : null}
                </Select>
                <TextField
                  label="Status"
                  variant="standard"
                  value={score.teamTwoStatus}
                  onChange={(e) => {
                    setScore((prev) => {
                      return { ...prev, teamTwoStatus: e.target.value };
                    });
                  }}
                  placeholder="Status Of Team"
                />
                <Box component="div">
                  <TextField
                    label="Score"
                    variant="standard"
                    type="number"
                    value={score.teamTwoScore}
                    sx={{ mx: 1 }}
                    onChange={(e) => {
                      setScore((prev) => {
                        return { ...prev, teamTwoScore: e.target.value };
                      });
                    }}
                    placeholder="What's The Score"
                  />
                  <TextField
                    label="Wicket(s)"
                    variant="standard"
                    type="number"
                    value={score.teamTwoWicket}
                    sx={{ mx: 1 }}
                    onChange={(e) => {
                      setScore((prev) => {
                        return { ...prev, teamTwoWicket: e.target.value };
                      });
                    }}
                    placeholder="How Many Wickets"
                  />
                </Box>
                <TextField
                  label="Over(s)"
                  variant="standard"
                  type="number"
                  value={score.teamTwoOver}
                  onChange={(e) => {
                    setScore((prev) => {
                      return { ...prev, teamTwoOver: e.target.value };
                    });
                  }}
                  placeholder="How Many Overs"
                />
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
                <TextField
                  label="Commentry"
                  variant="standard"
                  value={score.comentry}
                  onChange={(e) => {
                    setScore((prev) => {
                      return { ...prev, comentry: e.target.value };
                    });
                  }}
                  placeholder="who is batting"
                />
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
            {/* <Stack
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography component="h1" variant="h4" sx={{ my: 3 }}>
              Preview
            </Typography>
            <LiveScore />
          </Stack> */}
          </Box>
        )}

        <Copyright sx={{ my: 5 }} />
      </ThemeProvider>
    </>
  );
}

export default LiveScoreAdmin;
