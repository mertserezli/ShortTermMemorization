import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { useTranslation } from 'react-i18next';

import { auth } from './Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import SignIn from './Signin';
import { AddCardComponent } from './AddCard';
import ReviewComponent from './ReviewComponent';
import CardManager from './CardManager';
import ForgotPassword from './ForgotPassword';
import HeaderBar from './HeaderBar';
import SignUp from './SignUp';
import Profile from './Profile';
import NotFound from './NotFound';
import LandingPage from './LandingPage';
import { MUIWrapper } from './MUIWrapper.jsx';
import steps from './steps.jsx';

import { useSwipeable } from 'react-swipeable';
import { TourProvider, useTour } from '@reactour/tour';

import CssBaseline from '@mui/material/CssBaseline';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StorageIcon from '@mui/icons-material/Storage';
import { Box, Paper, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';

function App() {
  return (
    <MUIWrapper>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<LandingPage />} />
          <Route path={'/app'} element={<Application />} />
          <Route path={'/signin'} element={<SignIn />} />
          <Route path={'/signup'} element={<SignUp />} />
          <Route path={'/forgotpassword'} element={<ForgotPassword />} />
          <Route path={'/profile'} element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MUIWrapper>
  );
}

function Application() {
  const [user, loading] = useAuthState(auth);
  const theme = useTheme();

  return (
    <div className="App">
      {loading ? (
        <></>
      ) : user ? (
        <TourProvider
          steps={steps}
          styles={{
            popover: (base) => ({
              ...base,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: theme.shape.borderRadius,
            }),
          }}
          disableDotsNavigation
        >
          <Memorization />
        </TourProvider>
      ) : (
        <Navigate replace to="/signin" />
      )}
    </div>
  );
}

function Memorization() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabIndex, setTabIndex] = useState(1);
  const { isOpen: isTourOpen, currentStep: currentTourStep } = useTour();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setTabIndex((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setTabIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  if (
    isTourOpen &&
    1 <= currentTourStep &&
    currentTourStep <= 3 &&
    tabIndex !== 0 &&
    isMobile
  ) {
    setTabIndex(0);
  } else if (
    isTourOpen &&
    currentTourStep === 10 &&
    tabIndex !== 2 &&
    isMobile
  ) {
    setTabIndex(2);
  }
  useEffect(() => {
    if (isTourOpen && currentTourStep === 4 && tabIndex === 0) {
      setTabIndex(1);
    }
  }, [isTourOpen, currentTourStep]);

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
            <Tab
              icon={<NoteAddIcon />}
              label={t('addCard')}
              data-tour="add-card"
            />
            <Tab icon={<VisibilityIcon />} label={t('review')} />
            <Tab icon={<StorageIcon />} label={t('myCards')} />
          </Tabs>

          <div
            {...handlers}
            style={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
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
