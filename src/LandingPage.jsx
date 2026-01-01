import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <>
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
                {t('heroTitle1')}
                <br />
                {t('heroTitle2')}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {t('heroSubtitle')}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  component={RouterLink}
                  to="/signin"
                  variant="contained"
                  size="large"
                >
                  {t('getStarted')}
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
            {t('whyTitle')}
          </Typography>
          <Grid container spacing={4}>
            <Feature
              icon={<FlashOnIcon fontSize="large" />}
              title={t('rapidTitle')}
              description={t('rapidDesc')}
            />
            <Feature
              icon={<MemoryIcon fontSize="large" />}
              title={t('richTitle')}
              description={t('richDesc')}
            />
            <Feature
              icon={<NotificationsActiveIcon fontSize="large" />}
              title={t('smartTitle')}
              description={t('smartDesc')}
            />
            <Feature
              icon={<DownloadIcon fontSize="large" />}
              title={t('exportTitle')}
              description={t('exportDesc')}
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
            {t('ctaTitle')}
          </Typography>
          <Typography color="text.secondary" mb={4}>
            {t('ctaSubtitle')}
          </Typography>
          <Button
            component={RouterLink}
            to="/app"
            variant="contained"
            size="large"
          >
            {t('launchApp')}
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
              {t('footerApp')}
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
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeIndex, setActiveIndex] = useState(0);

  const itemRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % intervals.length);
    }, intervals[activeIndex].weight * BASE_TIME);

    return () => clearTimeout(timeout);
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    const item = itemRefs.current[activeIndex];
    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const offset =
      itemRect.left -
      containerRect.left -
      containerRect.width / 2 +
      itemRect.width / 2;

    container.scrollBy({
      left: offset,
      behavior: 'smooth',
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
        {t('timelineTitle')}
      </Typography>

      <Box
        ref={containerRef}
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
