import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import KeyIcon from "@mui/icons-material/Key";
import { useNavigate } from "react-router-dom";

export default function Console() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFile({
          name: selectedFile.name,
          content: event.target.result,
          size: selectedFile.size,
          type: selectedFile.type,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Grid
      container
      sx={{
        maxWidth: "100%",
        mt: 2,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        fontFamily: "Roboto, sans-serif",
        fontWeight: 400,
        flexDirection: "column",
      }}
    >
      <>
        <Grid item xs={12}>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <label htmlFor="file">
            <Button
              component="span"
              variant="contained"
              color="success"
              sx={{ margin: 1 }}
              startIcon={<UploadFileIcon />}
            >
              Şifrelenecek Dosyayı Seç
            </Button>
          </label>
        </Grid>
      </>

      <Grid
        container
        item
        xs={12}
        justifyContent="center"
        sx={{
          mt: 2,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid item>
          <Button
            variant="contained"
            sx={{ margin: 1, backgroundColor: "#4caf50", color: "#fff" }}
            startIcon={<KeyIcon />}
            onClick={() => {
              navigate("/create-key");
            }}
          >
            Simetrik Anahtar Oluştur
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
