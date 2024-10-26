import {
  Grid,
  Button,
  Box,
  Typography,
  Paper,
  ButtonGroup,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { FileSize } from "../utils/fileUtils";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import KeyIcon from "@mui/icons-material/Key";
import { useNavigate } from "react-router-dom";
import { keyContext } from "../context/keyContext";
import { createAESKey } from "../utils/aesUtils";
import CryptoJS from "crypto-js";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import DownloadIcon from "@mui/icons-material/Download";

const FileDecryptor = () => {
  const navigate = useNavigate();
  const { setKey, qrText, key } = useContext(keyContext);

  const [aesKeySize, setAesKeySize] = useState(128);
  const [cipherString, setCipherString] = useState("");
  const [decryptedImageSize, setDecryptedImageSize] = useState("");
  const [decryptedImagePreview, setDecryptedImagePreview] = useState("");
  const [inputMethod, setInputMethod] = useState(null); // "manual" or "file"
  const [decrypted, setDecrypted] = useState(false);
  const [originalImageSize, setOriginalImageSize] = useState(null);

  useEffect(() => {
    if (qrText) {
      setKey(createAESKey(qrText, aesKeySize));
    }
  }, [qrText, aesKeySize]);

  const decrypt = () => {
    if (cipherString && key) {
      const cipherStringWithoutPrefix = cipherString.slice(22);
      const decryptedString = CryptoJS.AES.decrypt(
        cipherStringWithoutPrefix,
        key
      ).toString(CryptoJS.enc.Utf8);

      return decryptedString;
    }
  };

  const handleDecrypt = () => {
    setOriginalImageSize(
      FileSize(new TextEncoder().encode(cipherString).length)
    );

    const decryptedImageString = decrypt();
    if (decryptedImageString) {
      setDecryptedImagePreview("data:image/png;base64," + decryptedImageString);
      setDecryptedImageSize(
        FileSize(new TextEncoder().encode(decryptedImageString).length)
      );
    }
    setDecrypted(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;
        setCipherString(fileContent);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = decryptedImagePreview;
    link.download = "decrypted.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      {key && !decrypted && (
        <>
          {inputMethod === "manual" ? (
            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="Şifreli Metin Girin"
                variant="outlined"
                value={cipherString}
                onChange={(event) => setCipherString(event.target.value)}
                fullWidth
              />
            </Grid>
          ) : (
            <Grid item sx={{ mt: 2 }}>
              <Button
                component="span"
                variant="contained"
                color="success"
                size="small"
                sx={{ margin: 1 }}
                startIcon={<TextFieldsIcon />}
                onClick={() => setInputMethod("manual")}
              >
                Şifrelenmiş İçeriği Gir
              </Button>
            </Grid>
          )}
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
                size="small"
                sx={{ margin: 1 }}
                startIcon={<UploadFileIcon />}
              >
                Şifrelenecek Dosyayı Seç
              </Button>
            </label>
          </Grid>
        </>
      )}
      {!decrypted && (
        <Grid item sx={{ mt: 2 }}>
          <ButtonGroup
            variant="contained"
            color="primary"
            size="small"
            aria-label="AES key size selection"
          >
            <Button
              onClick={() => setAesKeySize(128)}
              sx={{
                color: aesKeySize === 128 ? "#fff" : "#000",
                border: "none",
              }}
              variant={aesKeySize === 128 ? "contained" : "outlined"}
            >
              AES 128
            </Button>
            <Button
              sx={{
                color: aesKeySize === 192 ? "#fff" : "#000",
                border: "none",
              }}
              onClick={() => setAesKeySize(192)}
              variant={aesKeySize === 192 ? "contained" : "outlined"}
            >
              AES 192
            </Button>
            <Button
              onClick={() => setAesKeySize(256)}
              sx={{
                color: aesKeySize === 256 ? "#fff" : "#000",
                border: "none",
              }}
              variant={aesKeySize === 256 ? "contained" : "outlined"}
            >
              AES 256
            </Button>
          </ButtonGroup>
        </Grid>
      )}

      <>
        {key && !decrypted ? (
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
          !decrypted && (
            <Grid item>
              <Button
                variant="contained"
                size="small"
                sx={{ margin: 1, backgroundColor: "#4caf50", color: "#fff" }}
                startIcon={<KeyIcon />}
                onClick={() => navigate("/get-key")}
              >
                Şifreleme Anahtarını Al
              </Button>
            </Grid>
          )
        )}
      </>

      {!decrypted && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleDecrypt}
          disabled={!key || !cipherString}
          sx={{ marginBottom: "10px", mt: 5 }}
        >
          Şifreyi Çöz
        </Button>
      )}

      {decrypted && (
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
            src={decryptedImagePreview}
            alt="Decrypted Image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "inherit",
            }}
          />
        </Box>
      )}

      {decrypted && (
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
            Deşifre Edilmiş Boyut: {decryptedImageSize}
          </Typography>
        </Paper>
      )}

      {decrypted && (
        <Button
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          DEŞİFRE EDİLMİŞ DOSYAYI İNDİR
        </Button>
      )}
    </Grid>
  );
};

export default FileDecryptor;
