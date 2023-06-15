import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import InputTextFieldStyled from "./InputTextFieldStyled";
import Theme from "../Theme";

export default {
  title: "Design System/1_Atoms/InputTextField",
  component: InputTextFieldStyled,
} as ComponentMeta<typeof InputTextFieldStyled>;

const Template: ComponentStory<typeof InputTextFieldStyled> =
  function InputTextFieldStyledTemplate() {
    const theme = useTheme();
    const [gameCodeValue, setGameCodeValue] = useState("####");

    const handleGameCodeChange = (newValue: string) => {
      setGameCodeValue(newValue);
    };

    return (
      <ThemeProvider theme={Theme}>
        <InputTextFieldStyled
          fullWidth
          variant="filled"
          autoComplete="off"
          onChange={(newValue) => {
            handleGameCodeChange(newValue.target.value);
          }}
          onFocus={(newValue) => {
            if (newValue.target.value === "####") {
              handleGameCodeChange("");
            }
          }}
          value={gameCodeValue}
          InputProps={{
            disableUnderline: true,
            inputProps: {
              style: {
                color:
                  gameCodeValue === "####"
                    ? theme.palette.primary.darkGrey
                    : theme.palette.primary.extraDarkGrey,
                paddingTop: "9px",
                textAlign: "center",
                fontSize: `${theme.typography.h2.fontSize}px`,
              },
            },
          }}
        />
      </ThemeProvider>
    );
  };

export const Default = Template.bind({});
Default.args = {};
