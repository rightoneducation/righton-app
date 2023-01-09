import React from "react";
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import RightOnLogo from "./auth/RightOnLogo.png";

const ErrorPage: React.FC = () => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={4}
    >
      <img
        src={RightOnLogo}
        style={{
          marginTop: "3%",
          width: "20%",
          marginBottom: "3%",
          maxHeight: "2%",
        }}
        alt="Right On"
      />
      <Grid item xs={6}>
          <ErrorType> You do not have sufficient privileges to access this page. Please login above. </ErrorType>
      </Grid>
    </Grid>
  );
};

export default ErrorPage;

const Field = styled(TextField)({
  margin: "10px 0",
  borderRadius: "20px",
});

const SignUpLink = styled(Link)({
  backgroundColor: "#FC1047",
  textDecoration: "none",
  color: "white",
  borderRadius: "34px",
  padding: "5%",
  fontWeight: "bold",
});

const LogInLink = styled(Link)({
  backgroundColor: "#159EFA",
  textDecoration: "none",
  color: "white",
  borderRadius: "34px",
  padding: "5%",
  fontWeight: "bold",
});

const ButtonGrid = styled(Grid)({
  marginTop: "10%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
});

const ErrorType = styled(Typography)({
  fontStyle: 'italic'
});
