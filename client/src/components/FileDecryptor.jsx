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

const FileDecryptor = () => {
  const navigate = useNavigate();
  const { setKey, qrText, key } = useContext(keyContext);

  const [aesKeySize, setAesKeySize] = useState(128);
  const [cipherString, setCipherString] = useState("");
  const [decryptedImageSize, setDecryptedImageSize] = useState("");
  const [decryptedImagePreview, setDecryptedImagePreview] = useState("");

  useEffect(() => {
    if (qrText) {
      setKey(createAESKey(qrText, aesKeySize));
    }
  }, [qrText, aesKeySize]);

  const decrypt = () => {
    if (cipherString && key) {
      // remove "data:image/png;base64," from start
      const cipherStringWithoutPrefix = cipherString.slice(22);
      const decryptedString = CryptoJS.AES.decrypt(
        cipherStringWithoutPrefix,
        key
      ).toString(CryptoJS.enc.Utf8);

      return decryptedString;
    }
  };

  const handleDecrypt = (encryptedImageString) => {
    const decryptedImageString = decrypt(encryptedImageString, key);

    setDecryptedImagePreview("data:image/png;base64," + decryptedImageString);
    setDecryptedImageSize(
      FileSize(new TextEncoder().encode(decryptedImageString).length)
    );
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
      {key && (
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            onChange={(event) => {
              setCipherString(event.target.value);
            }}
          />
        </Grid>
      )}
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
                navigate("/get-key");
              }}
            >
              Şifreleme Anahtarını Al
            </Button>
          </Grid>
        )}
      </>

      <Button
        variant="contained"
        color="primary"
        onClick={handleDecrypt}
        disabled={!key || !cipherString}
        sx={{ marginBottom: "10px", mt: 5 }}
      >
        Şifreyi Çöz
      </Button>
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
    </Grid>
  );
};

export default FileDecryptor;
