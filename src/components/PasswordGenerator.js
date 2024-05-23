import { useState, useEffect } from "react";
import { generatePassword } from "../utils/PasswordGenerator";
import { Alert, Container, Grid } from "@mui/material";
import passwordGif from "../assets/password.gif";
import { Typography, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import Checkbox from "@mui/material/Checkbox";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Snackbar from "@mui/material/Snackbar";

const PasswordGenerator = () => {
  const [includeCharacters, setIncludeCharacters] = useState({
    Numbers: true,
    Alphabets: true,
    "Special Characters": true,
  });
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState("");
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const includes = ["Numbers", "Alphabets", "Special Characters"];
  const [snacksData, setSnacksData] = useState({
    key: null,
    text: null,
    severity: "success",
  });

  useEffect(() => {
    const storedPasswords = JSON.parse(localStorage.getItem("passwordHistory"));
    if (storedPasswords) {
      setPasswordHistory(storedPasswords);
    }
  }, []);

  const setIncludes = (checked, include) => {
    setIncludeCharacters({
      ...includeCharacters,
      [include]: checked,
    });
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(length, includeCharacters);
    if (newPassword) {
      setPassword(newPassword);
      const newHistory = [newPassword, ...passwordHistory.slice(0, 4)];
      setPasswordHistory(newHistory);
      localStorage.setItem("passwordHistory", JSON.stringify(newHistory));
    }
  };

  const handleCopyToClipboard = (value) => {
    if (value) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(value)
          .then(() => {
            setSnacksData({
              key: value,
              text: "copied to clipboard!",
              severity: "success",
            });
            setOpen(true);
          })
          .catch((err) => {
            setSnacksData({
              key: null,
              text: err?.message || "Something went wrong",
              severity: "error",
            });
            setOpen(true);
          });
      } else {
        setSnacksData({
          key: null,
          text: "Clipboard API is not available",
          severity: "error",
        });
        setOpen(true);
      }
    }
  };

  const onChangePasswordLength = (value) => {
    setLength(value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <img src={passwordGif} height={100} alt="Password Gif" />
          <Typography variant="h4">Password Generator</Typography>
        </Grid>
        <Grid justifyContent="center" alignItems="center" item xs={12}>
          <OutlinedInput
            id="password"
            size="small"
            value={password}
            readOnly
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="generate password"
                  onClick={handleGeneratePassword}
                  edge="end"
                >
                  <RefreshIcon />
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            sx={{ ml: 2 }}
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={() => handleCopyToClipboard(password)}
          >
            Copy
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">Password length : {length}</Typography>
          <Slider
            max={30}
            min={5}
            value={length}
            onChange={onChangePasswordLength}
            className="slider-style"
          />
        </Grid>
        <Grid item xs={12}>
          <List dense={true}>
            {includes.map((include, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    checked={includeCharacters[include]}
                    onChange={(e) => setIncludes(e.target.checked, include)}
                  />
                }
              >
                <ListItemText primary={include} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12}>
          {passwordHistory?.length ? (
            <Typography variant="body1">Last 5 Passwords</Typography>
          ) : (
            <></>
          )}
          <List dense={true}>
            {passwordHistory.map((pwd, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleCopyToClipboard(pwd)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={pwd} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <Snackbar
        key={snacksData.key}
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snacksData.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snacksData.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PasswordGenerator;
