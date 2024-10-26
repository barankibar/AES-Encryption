import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Grid,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import KeyIcon from "@mui/icons-material/Key";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { keyContext } from "../../../context/keyContext";
import { createAESKey } from "../../../utils/aesUtils";
import { FileSize } from "../../../utils/fileUtils";
import CryptoJS from "crypto-js";

export default function Console() {
  const navigate = useNavigate();
  const [aesKeySize, setAesKeySize] = useState(128); // 128, 192, or 256
  const { setKey, qrText, key } = useContext(keyContext);
  const [success, setSuccess] = useState(false);
  const [originalImagePreview, setOriginalImagePreview] = useState(null);
  const [originalImageSize, setOriginalImageSize] = useState(null);
  const [encryptedImageText, setEncryptedImageText] = useState(null);
  const [encryptedTextSize, setEncryptedTextSize] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (qrText) {
      setKey(createAESKey(qrText, aesKeySize));
    }
  }, [qrText, aesKeySize]);

  const encrypt = (plainText, password) => {
    return CryptoJS.AES.encrypt(
      plainText,
      password,
      "{ mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }"
    ).toString();
  };

  const handleEncrypt = (file) => {
    const reader = new FileReader();
    reader.onload = function () {
      let originalImageString = reader.result
        .replace("data:", "")
        .replace(/^.+,/, "");
      setOriginalImagePreview("data:image/png;base64," + originalImageString);
      setOriginalImageSize(
        FileSize(new TextEncoder().encode(originalImageString).length)
      );

      // Encrypt
      const encryptedImageString = encrypt(originalImageString, key);
      setEncryptedImageText("data:image/png;base64," + encryptedImageString);
      setEncryptedTextSize(
        FileSize(new TextEncoder().encode(encryptedImageString).length)
      );
      setSuccess(true);
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event) => {
    const [file] = event.target.files;
    if (file) {
      setFileSelected(true);
      setOriginalImagePreview(URL.createObjectURL(file));
      setSelectedFile(file);
      setSuccess(false);
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
      {!success && key && (
        <Grid item xs={12}>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />
          <label htmlFor="file">
            <Button
              component="span"
              variant="contained"
              color="success"
              size="small"
              sx={{ margin: 1 }}
              startIcon={<UploadFileIcon />}
            >
              Şifrelenecek Dosyayı Seç
            </Button>
          </label>
        </Grid>
      )}
      {!success && (
        <Grid item sx={{ mt: 2 }}>
          <ButtonGroup
            variant="contained"
            color="primary"
            size="small"
            aria-label="AES key size selection"
          >
            {[128, 192, 256].map((size) => (
              <Button
                key={size}
                onClick={() => setAesKeySize(size)}
                sx={{
                  color: aesKeySize === size ? "#fff" : "#000",
                  border: "none",
                }}
                variant={aesKeySize === size ? "contained" : "outlined"}
              >
                AES {size}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
      )}
      {!success && (
        <>
          {key ? (
            <Paper
              elevation={3}
              sx={{
                mt: 2,
                padding: 2,
                width: "80%",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Simetrik Anahtar:
              </Typography>
              <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                {key}
              </Typography>
            </Paper>
          ) : (
            <Grid item>
              <Button
                variant="contained"
                size="small"
                sx={{ margin: 1, backgroundColor: "#4caf50", color: "#fff" }}
                startIcon={<KeyIcon />}
                onClick={() => navigate("/create-key")}
              >
                Simetrik Anahtar Oluştur
              </Button>
            </Grid>
          )}
        </>
      )}

      {key && fileSelected && (
        <Button
          variant="contained"
          size="small"
          sx={{ marginTop: 2, color: "#fff" }}
          startIcon={<LockIcon />}
          onClick={() => handleEncrypt(selectedFile)}
        >
          Şifrele
        </Button>
      )}

      {success && (
        <>
          <Box
            sx={{
              mt: 2,
              padding: 2,
              width: "80%",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Şifrelenmiş İçerik:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                wordWrap: "break-word",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {encryptedImageText}
            </Typography>
          </Box>

          <Paper
            elevation={3}
            sx={{
              mt: 2,
              padding: 2,
              width: "80%",
              textAlign: "center",
              backgroundColor: "#f7f7f7",
              borderRadius: "8px",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Orijinal ve Şifrelenmiş Dosya Boyutları
            </Typography>
            <Typography variant="body2">
              Orijinal Boyut: {originalImageSize}
            </Typography>
            <Typography variant="body2">
              Şifrelenmiş Boyut: {encryptedTextSize}
            </Typography>
          </Paper>
        </>
      )}

      {fileSelected && !success && (
        <Box
          sx={{
            mt: 2,
            width: "200px",
            height: "200px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
          }}
        >
          <img
            src={originalImagePreview}
            alt="Orijinal Dosya"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>
      )}
    </Grid>
  );
}
