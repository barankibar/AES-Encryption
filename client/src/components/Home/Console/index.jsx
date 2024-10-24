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
import {
  createAESKey,
  encryptFile,
} from "../../../utils/aesUtils";

export default function Console() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [encryptedContent, setEncryptedContent] = useState(null);
  const [aesKeySize, setAesKeySize] = useState(128); // 128, 192, or 256
  const { setKey, qrText, key } = useContext(keyContext);

  useEffect(() => {
    if (qrText) {
      setKey(createAESKey(qrText, aesKeySize));
    }
  }, [qrText, aesKeySize]);

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

  const handleEncrypt = () => {
    if (file && key) {
      const encrypted = encryptFile(file.content, key);
      setEncryptedContent(encrypted);
    }
  };

  const downloadFile = (data, filename, type) => {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
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
      {!encryptedContent && key && (
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
      {!encryptedContent && (
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
      {!encryptedContent && (
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
                onClick={() => {
                  navigate("/create-key");
                }}
              >
                Simetrik Anahtar Oluştur
              </Button>
            </Grid>
          )}
        </>
      )}

      {!encryptedContent ? (
        <>
          {file && key && (
            <Button
              variant="contained"
              size="small"
              sx={{ marginTop: 2, color: "#fff" }}
              startIcon={<LockIcon />}
              onClick={handleEncrypt}
            >
              Şifrele
            </Button>
          )}
        </>
      ) : (
        <Button
          variant="contained"
          size="small"
          sx={{ mt: 2, color: "#fff" }}
          onClick={() => navigate("/decrypt")}
        >
          Şifre Çöz
        </Button>
      )}

      {encryptedContent && (
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
          <img src={encryptedContent} />
          <hr />
          <Typography
            variant="body2"
            sx={{
              wordWrap: "break-word",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {encryptedContent}
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 2, backgroundColor: "#03a9f4", color: "#fff" }}
            onClick={() =>
              downloadFile(
                encryptedContent,
                `encrypted_${file.name}`,
                "application/octet-stream"
              )
            }
          >
            Şifrelenmiş Dosyayı İndir
          </Button>
        </Box>
      )}

      {file && !encryptedContent && (
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
          {file.type.startsWith("image/") && (
            <img
              src={file.content}
              alt={file.name}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
          {file.type.startsWith("video/") && (
            <video
              controls
              src={file.content}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
        </Box>
      )}
    </Grid>
  );
}
