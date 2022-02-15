import React, { useState } from 'react';
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link, useHistory } from "react-router-dom";
import { Grid } from '@material-ui/core';
import RightOnLogo from "./RightOnLogo.png";

const Confirmation: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const history = useHistory();

  const handleSubmit = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await Auth.confirmSignUp(email, String(code));
      alert("Success");
      history.push("/signin");
    } catch (error) {
      alert("Error");
    }
    setLoading(false);
  };

  return (
    <Grid container direction="column"
    alignItems="center"
    justifyContent="center">
      <img src={RightOnLogo} style={{
        marginTop: "3%",
        width: "20%",
        marginBottom: "3%",
        maxHeight: "2%",
      }} alt="Right On" />
      <Grid item xs={6}>
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "120%"
      }}
      onSubmit={handleSubmit}
    >
      <h1 style={{ fontSize: "22px", color: "grey" }}>
        {" "}
        Verify Your Account
      </h1>
      <Field variant="outlined" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      <Field variant="outlined" label="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} />
      <ButtonGrid item direction="row" justifyContent="space-between" spacing={4}>
      <SignUpLink to="/signup">Sign Up</SignUpLink>
      <LogInLink to="#" onClick={(e) => {handleSubmit(e)}}>Verify Account</LogInLink>
      </ButtonGrid>
    </form>
    </Grid>
    </Grid>
  );
};

export default Confirmation;

const Field = styled(TextField)({
  margin: "10px 0",
  borderRadius: "20px"
});

const SignUpLink = styled(Link)({
  backgroundColor: "#FC1047",
  textDecoration: "none",
  color: "white",
  borderRadius: "34px",
  padding: "5%",
  fontWeight: "bold"
});

const LogInLink = styled(Link)({
  backgroundColor: "#159EFA",
  textDecoration: "none",
  color: "white",
  borderRadius: "34px",
  padding: "5%",
  fontWeight: "bold",
});

const ButtonGrid = styled(Grid) ({
  marginTop: "10%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
})

