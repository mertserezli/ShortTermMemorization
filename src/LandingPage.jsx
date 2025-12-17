import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router';

import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import DownloadIcon from '@mui/icons-material/Download';

import HeaderBar from './HeaderBar';

export default function LandingPage() {
  return (
    <>
      {/* Navbar */}
      <HeaderBar showSignOut={false} />

      {/* Hero */}
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'
              : 'linear-gradient(135deg, #e3f2fd, #ffffff)',
        }}
      >
        <Container sx={{ py: 10 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Memorize Fast.
                <br />
                Forget Nothing (Today).
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ marginBottom: '16px' }}
              >
                Short Term Memo is a lightweight memorization tool built for
                rapid recall using aggressive spaced repetition intervals.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  component={RouterLink}
                  to="/signin"
                  variant="contained"
                  size="large"
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="https://github.com/mertserezli/ShortTermMemorization"
                >
                  GitHub
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Timeline />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container sx={{ py: 8 }}>
          <Typography variant="h4" fontWeight={600} textAlign="center" mb={6}>
            Why Short Term Memo?
          </Typography>
          <Grid container spacing={4}>
            <Feature
              icon={<FlashOnIcon fontSize="large" />}
              title="Rapid Spaced Repetition"
              description="Designed for short-term memory consolidation with fast, aggressive intervals."
            />
            <Feature
              icon={<MemoryIcon fontSize="large" />}
              title="Rich Flashcards"
              description="Create cards with text, images, and audio for maximum retention."
            />
            <Feature
              icon={<NotificationsActiveIcon fontSize="large" />}
              title="Smart Notifications"
              description="Get notified exactly when your memory needs reinforcement."
            />
            <Feature
              icon={<DownloadIcon fontSize="large" />}
              title="Export Anywhere"
              description="Export decks to Anki or SuperMemo."
            />
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          py: 10,
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'background.paper' : 'grey.100',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            color="text.primary"
          >
            Memorize smarter, not longer
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Perfect for exams, interviews and language cramming.
          </Typography>

          <Button
            component={RouterLink}
            to="/app"
            variant="contained"
            size="large"
          >
            Launch App
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4 }}>
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Typography color="text.secondary">
            © {new Date().getFullYear()} Short Term Memo
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button href="https://github.com/mertserezli/ShortTermMemorization">
              GitHub
            </Button>
            <Button component={RouterLink} to="/app">
              App
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

const intervals = [
  { label: '5s', weight: 1 },
  { label: '25s', weight: 2 },
  { label: '2m', weight: 3 },
  { label: '10m', weight: 4 },
  { label: '1h', weight: 6 },
  { label: '5h', weight: 8 },
  { label: '1d', weight: 10 },
];

// base unit in milliseconds
const BASE_TIME = 500;

function Timeline() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeIndex, setActiveIndex] = useState(0);

  const itemRefs = useRef([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % intervals.length);
    }, intervals[activeIndex].weight * BASE_TIME);

    return () => clearTimeout(timeout);
  }, [activeIndex]);

  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeIndex]);

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        Spaced repetition timeline
      </Typography>

      <Box
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        <Stack
          direction="row"
          spacing={isMobile ? 1.25 : 2}
          sx={{ minWidth: 'max-content', px: 1 }}
        >
          {intervals.map((item, index) => {
            const active = index === activeIndex;

            return (
              <Box
                key={item.label}
                ref={(el) => (itemRefs.current[index] = el)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  transition: 'all 250ms ease',
                  bgcolor: active
                    ? theme.palette.primary.main
                    : theme.palette.action.hover,
                  color: active
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  boxShadow: active ? theme.shadows[2] : 'none',
                  opacity: active ? 1 : 0.65,
                }}
              >
                {item.label}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}

Feature.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
function Feature({ icon, title, description }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card
        sx={{
          height: '100%',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        elevation={3}
      >
        <CardContent>
          <Box sx={{ mb: 2 }}>{icon}</Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Typography color="text.secondary">{description}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
