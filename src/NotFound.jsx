import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function NotFound() {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />

      <Typography variant="h3" gutterBottom>
        404 – Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Go Home
      </Button>
    </Box>
  );
}