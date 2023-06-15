import React from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import Modal from "react-modal";
import BodyCardContainerStyled from "../lib/styledcomponents/BodyCardContainerStyled";
import IntroButtonStyled from "../lib/styledcomponents/IntroButtonStyled";
import { StorageKey } from "../lib/PlayModels";

interface RejoinModalProps {
  handleRejoinSession: () => void;
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
}

export default function RejoinModal({
  handleRejoinSession,
  isModalVisible,
  setIsModalVisible,
}: RejoinModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isModalVisible}
      contentLabel="Rejoin Modal"
      style={{
        content: {
          position: "absolute",
          maxWidth: theme.breakpoints.values.xs,
          inset: "auto",
          margin: "20px",
          borderRadius: "24px",
          backgroundColor: theme.palette.primary.main,
          boxShadow: `0px 20px 20px rgba(0, 0, 0, 0.25)`,
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
      onRequestClose={() => setIsModalVisible(false)}
      shouldCloseOnOverlayClick
      appElement={document.getElementById("root") || undefined}
    >
      <BodyCardContainerStyled spacing={2}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          {t("joingame.rejoinmodal.title1")}
        </Typography>
        <Typography variant="h4">{t("joingame.rejoinmodal.title2")}</Typography>
        <IntroButtonStyled
          onClick={() => {
            handleRejoinSession();
            setIsModalVisible(false);
          }}
          style={{
            background: `${theme.palette.primary.highlightGradient}`,
            boxShadow: "0px 5px 22px rgba(71, 217, 255, 0.3)",
          }}
        >
          {t("joingame.rejoinmodal.button1")}
        </IntroButtonStyled>
        <IntroButtonStyled
          onClick={() => {
            window.localStorage.removeItem(StorageKey);
            setIsModalVisible(false);
          }}
        >
          {t("joingame.rejoinmodal.button2")}
        </IntroButtonStyled>
      </BodyCardContainerStyled>
    </Modal>
  );
}
