import React, { useContext, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { keyContext } from "../context/keyContext";
import { Card, CardContent, Typography, Grid, Alert, Box } from "@mui/material";
import BG from "../assets/img/background.jpg";
import { useNavigate } from "react-router-dom";

const QRScanner = ({ redirect }) => {
  const navigate = useNavigate();
  const { setQrText } = useContext(keyContext);
  const [error, setError] = React.useState(null);

  const handleScan = (result) => {
    if (result && result[0]) {
      setQrText(result[0].rawValue);
      setError(null);
      navigate(redirect);
    }
  };

  const handleError = (error) => {
    console.error("Error scanning code:", error);
    setError("Kod taranırken bir hata oluştu. Lütfen tekrar deneyin.");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Grid
        container
        sx={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Card
            sx={{
              boxShadow: 5,
              borderRadius: 2,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                QR veya Barkod Tara
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Lütfen anahtarınızı oluşturmak için kodu kameranıza gösterin.
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  height: { xs: "300px", sm: "350px", md: "400px" },
                  maxWidth: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{ facingMode: "environment" }}
                  formats={[
                    "qr_code",
                    "code_128",
                    "code_39",
                    "ean_13",
                    "ean_8",
                    "upc_a",
                    "upc_e",
                    "codabar",
                    "data_matrix",
                    "pdf417",
                  ]} // List of supported barcode formats
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QRScanner;
