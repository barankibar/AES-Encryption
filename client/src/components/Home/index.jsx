import React from "react";
import {
  CssBaseline,
  GlobalStyles,
  Grid,
  Box,
  Container,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import xaasBG from "../../assets/img/background.jpg";
import xaasBGMobile from "../../assets/img/background-mobile.jpg";

// Create a custom theme with green and white colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default function Home({ children }) {
  // Mobil cihazlar için genişlik kontrolü
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            backgroundImage: `url(${isMobile ? xaasBGMobile : xaasBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            margin: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          },
        }}
      />
      <Container>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {/* CONSOLE BOX */}
          <Grid item xs={12} mt={5}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <Paper
                elevation={3}
                sx={{
                  width: isMobile ? "100%" : "500px",
                  maxWidth: "100%",
                  height: "550px",
                  backgroundColor: "#efefef",
                  padding: 1,
                  borderRadius: 2,
                }}
              >
                {children}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
