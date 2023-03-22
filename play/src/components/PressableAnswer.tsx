import React from "react";
import { makeStyles, Button, Theme } from "@material-ui/core";
import { fontFamilies, fonts } from "../../../utils/theme";

type AnswerProps = {
    icon: string,
    text: string,
    height: number,
    borderColor: string,
    backgroundColor: string,
    marginHorizontal: number,
    onPress: (data: any) => void,
    data: any,
    showIcon?: boolean,
    readonly?: boolean,
    onTextChanged?: (text: string) => void,
    style?: any,
    disabled?: boolean,
}

const RoundTextIcon = ({
  icon,
  text,
  height,
  borderColor,
  backgroundColor,
  marginHorizontal,
  onPress,
  data,
  showIcon,
  readonly,
  onTextChanged,
  style = {},
  disabled,
} : AnswerProps ) => {
  const classes = useStyles();
  
  return (
    <Button
      onClick={() => onPress(data)}
      className={classes.buttonStyleSubmitted}
      disabled={disabled}
    >
      <span
        style={{
          color: "#384466",
          fontFamily: fontFamilies.karlaRegular,
          fontSize: `${fonts.xxMedium}px`,
          marginRight: `${5}px`,
          marginLeft: `${5}px`,
          flex: 1,
        }}
      >
        {text}
      </span>
      {showIcon === undefined || !showIcon ? null : (
        <img
          src={icon}
          style={{
            padding: `${10}px`,
            width: "16px",
            height: "16px",
          }}
        />
      )}
    </Button>
  );
};

export default RoundTextIcon;

const useStyles = makeStyles((theme: Theme) => ({
  buttonStyleSubmitted:{
    display: "flex",
    height: `${height}px`,
    borderColor: borderColor,
    backgroundColor: backgroundColor,
    margin: `5px ${marginHorizontal}px`,
    alignItems: "center",
    borderRadius: "22px",
    borderWidth: "2px",
    paddingLeft: `${10}px`,
    paddingRight: `${10}px`,
    alignSelf: "stretch",
  },
}));