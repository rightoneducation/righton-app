import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import IntroButtonStyled from "../lib/styledcomponents/IntroButtonStyled";
import { StorageKey, ErrorType } from "../lib/PlayModels";

interface ErrorModalProps {
  isModalOpen: boolean;
  errorType: ErrorType;
  errorText?: string;
  retry?: number;
  handleRetry: () => void;
}

export default function ErrorModal({
  isModalOpen,
  errorType,
  errorText,
  retry,
  handleRetry,
}: ErrorModalProps) {
  const theme = useTheme();
  const isExtraSmallDevice = useMediaQuery(theme.breakpoints.down("xs"));
  const { t } = useTranslation();
  const navigate = useNavigate();

  const upperTextMap = {
    [ErrorType.CONNECT]: t("error.connect.title1"),
    [ErrorType.ANSWER]: t("error.game.answer"),
    [ErrorType.SCORE]: t("error.game.score"),
  };

  const lowerText = [
    <Typography variant="h4" sx={{ textAlign: "center", fontStyle: "italic" }}>
      {errorText}
    </Typography>,
  ];
  const lowerButton = [
    <IntroButtonStyled
      onClick={() => {
        window.localStorage.removeItem(StorageKey);
        navigate("/");
      }}
      style={{
        boxShadow: "0px 5px 22px rgba(71, 217, 255, 0.3)",
      }}
    >
      {t("error.connect.button2")}
    </IntroButtonStyled>,
  ];

  return (
    <Modal
      isOpen={isModalOpen}
      contentLabel="Rejoin Modal"
      style={{
        content: {
          position: "absolute",
          width: isExtraSmallDevice
            ? `calc(100% - (2 * ${theme.sizing.extraLargePadding}px))`
            : `calc(${theme.breakpoints.values.xs}px - (2 * ${theme.sizing.extraLargePadding}px))`,
          minWidth: "200px",
          minHeight: "100px",
          inset: "auto",
          margin: "20px",
          borderRadius: "24px",
          backgroundColor: theme.palette.primary.main,
          boxShadow: `0px 20px 20px rgba(0, 0, 0, 0.25)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
        overlay: {
          height: "100%",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
      shouldCloseOnOverlayClick={false}
      appElement={document.getElementById("root") || undefined}
    >
      <Stack
        spacing={2}
        sx={{ paddingBottom: `${theme.sizing.mediumPadding}px` }}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          {upperTextMap[errorType]}
        </Typography>
        {errorType === ErrorType.CONNECT && lowerText}
      </Stack>
      <Stack spacing={2} style={{ alignItems: "center" }}>
        <IntroButtonStyled
          onClick={() => {
            handleRetry();
          }}
          style={{
            background: `${theme.palette.primary.highlightGradient}`,
            boxShadow: "0px 5px 22px rgba(71, 217, 255, 0.3)",
          }}
        >
          {errorType === ErrorType.CONNECT
            ? `${t("error.connect.button1")} ${
                retry && retry > 0 ? `(${retry})` : ""
              }`
            : t("error.connect.button1")}
        </IntroButtonStyled>
        {errorType === ErrorType.CONNECT && lowerButton}
      </Stack>
    </Modal>
  );
}
