import React, { useState, useContext } from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router";

import {auth} from "./Firebase";
import SignIn from "./Signin";
import { AddCardComponent } from "./AddCard";
import { ShowNotifications } from "./NotificationContextProvider";
import ReviewComponent from "./ReviewComponent";
import CardManager from "./CardManager";
import ForgotPassword from "./ForgotPassword";

import { useAuthState } from "react-firebase-hooks/auth";
import { useSwipeable } from "react-swipeable";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StorageIcon from '@mui/icons-material/Storage';
import {Badge, Box, createTheme, Paper, Tabs, Tab, ThemeProvider, useMediaQuery, useTheme, } from "@mui/material";
import HeaderBar from "./HeaderBar";
import CssBaseline from "@mui/material/CssBaseline";
import SignUp from "./SignUp";
import Profile from "./Profile";
import NotFound from "./NotFound";

function App() {
    const theme = createTheme({
      colorSchemes: {
        light: true,
        dark: true,
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path={'/'} element={<Application />} />
            <Route path={'/signin'} element={<SignIn />} />
            <Route path={'/signup'} element={<SignUp />} />
            <Route path={'/forgotpassword'} element={<ForgotPassword />} />
            <Route path={'/profile'} element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    );
}

function Application() {
    const [showNotifications, setShowNotifications] = useState(true);
    const [user, loading, ] = useAuthState(auth);

    return (
      <ShowNotifications.Provider value={{ showNotifications, setShowNotifications }}>
          <div className="App">
              {loading ? <></> : user ? <Memorization /> : <Navigate replace to="/signin" />}
          </div>
      </ShowNotifications.Provider>
    );
}

function ToggleNotifications() {
    const { showNotifications, setShowNotifications } = useContext(ShowNotifications);
    return (
      <button onClick={() => setShowNotifications(!showNotifications)}>
          toggle notifications: {showNotifications ? "on" : "off"}
      </button>
    );
}

function Memorization() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabIndex, setTabIndex] = useState(1);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setTabIndex((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setTabIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true // allows mouse drag on desktop
  });

  return (
    <>
      <HeaderBar showSignOut={true} />
      {isMobile ? (
        <>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab icon={<NoteAddIcon />} label="Add Card" />
            <Tab icon={<VisibilityIcon />} label="Review" />
            <Tab icon={<StorageIcon />} label="My Cards"/>
          </Tabs>

          <div
            {...handlers}
            style={{
             height: "100vh",
             display: "flex",
             flexDirection: "column"
            }}
          >
            {tabIndex === 0 && (
              <Box sx={{ p: 2 }}>
                <AddCardComponent />
              </Box>
            )}
            {tabIndex === 1 && (
              <Box sx={{ p: 2 }}>
                <ReviewComponent />
              </Box>
            )}
            {tabIndex === 2 && (
              <Box sx={{ p: 2 }}>
                <ToggleNotifications />
                <CardManager />
              </Box>
            )}
          </div>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              width: '35%',
            }}
          >
            <ReviewComponent />
          </Paper>
        </Box>
      )}
    </>
  );
}

export default App;