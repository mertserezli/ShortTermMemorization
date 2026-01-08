import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const screenWidth = window.innerWidth;
let hasSwiped = false;

export default function SwipeableCard({ show, onShow, onFeedback, children }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  const rightLabelOpacity = useTransform(x, [50, screenWidth / 3], [0, 1]);
  const leftLabelOpacity = useTransform(x, [-screenWidth / 3, -50], [1, 0]);

  const cardRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);

  if (!isMobile) return <>{children}</>;

  return (
    <motion.div
      ref={cardRef}
      style={{
        x,
        rotate,
        opacity,
        touchAction: 'none',
        margin: '0 auto',
        height: '80vh',
      }}
      animate={{ scale }}
      drag={show ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={(event, info) => {
        if (show) {
          hasSwiped = true;
          if (info.offset.x > screenWidth / 3) {
            onFeedback(true);
          } else if (info.offset.x < -screenWidth / 3) {
            onFeedback(false);
          }
        }
      }}
      onTapStart={(event, info) => {
        if (!show && cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          const tapX = info.point.x;
          const tapY = info.point.y;

          const isInside =
            tapX >= rect.left &&
            tapX <= rect.right &&
            tapY >= rect.top &&
            tapY <= rect.bottom;

          if (isInside) {
            setScale(0.95);
          }
        }
      }}
      onTapCancel={() => setScale(1)}
      onTap={(event, info) => {
        setScale(1);

        if (!show && cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          const tapX = info.point.x;
          const tapY = info.point.y;

          const isInside =
            tapX >= rect.left &&
            tapX <= rect.right &&
            tapY >= rect.top &&
            tapY <= rect.bottom;

          if (isInside) {
            onShow();
          }
        }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'green',
          fontSize: '2rem',
          fontWeight: 'bold',
          opacity: rightLabelOpacity,
        }}
      >
        ✅ {t('good')}
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: 'red',
          fontSize: '2rem',
          fontWeight: 'bold',
          opacity: leftLabelOpacity,
        }}
      >
        ❌ {t('again')}
      </motion.div>

      {children}
      {show && !hasSwiped && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pointerEvents: 'none', // don't block interaction
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          <motion.div
            animate={{ x: [-10, 0, -10] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ⬅️
          </motion.div>

          <span>Swipe</span>

          <motion.div
            animate={{ x: [10, 0, 10] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ➡️
          </motion.div>
        </Box>
      )}
    </motion.div>
  );
}
