import React, { useState } from 'react';
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import {confirmSignUp} from "@aws-amplify/auth";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link, useHistory } from "react-router-dom";
import { Grid, Typography } from '@material-ui/core';
import RightOnLogo from "./RightOnLogo.png";

const Confirmation: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const history = useHistory();
  const [displayText, setDisplayText] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await confirmSignUp({username: email, confirmationCode: String(code)});
      setDisplayText(true);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Grid container direction="column"
      alignItems="center"
      justifyContent="center">
      <img src={RightOnLogo} style={{
          marginTop: "3%",
          width: '15%',
          minWidth: '200px',
          marginBottom: "3%",
      }} alt="Right On" />
      <Grid item xs={6}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: '5vw',
            paddingRight: '5vw'
          }}
          onSubmit={handleSubmit}
        >
          <h1 style={{ fontSize: "22px", color: "grey", textAlign: "center"}}>
            {" "}
            Step 2: Verify Your Email
          </h1>
          <Field variant="outlined" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          <Field variant="outlined" label="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} />
          <ButtonGrid item direction="row" justifyContent="space-between" spacing={4}>
            <LogInLink to="#" onClick={(e) => { handleSubmit(e) }}>Verify</LogInLink>
            <SignUpLink to="/login">Log In</SignUpLink>
          </ButtonGrid>
        </form>
      </Grid>
      <ErrorType> {displayText ? 'Email verified! You will receive a message from RightOn when your account is granted administrative privelges. You will then be able to log in.' : 'You will receive a code shortly. Enter it above to confirm the email address associated with this account.' } </ErrorType> 
    </Grid>
  );
};

export default Confirmation;

const Field = styled(TextField)({
  margin: "10px 0",
  borderRadius: "20px",
  width: "100%",
});

const SignUpLink = styled(Link)({
  backgroundColor: "#159EFA",
  textDecoration: "none",
  color: "white",
  borderRadius: "34px",
  minWidth: "70px",
  textAlign: "center",
  padding: "1vw",
  whiteSpace: "nowrap",
  fontWeight: "bold",
});

const LogInLink = styled(Link)({
  backgroundColor: "#FC1047",
  textDecoration: "none",
  color: "white",
  borderRadius: "34px",
  minWidth: "70px",
  textAlign: "center",
  padding: "1vw",
  whiteSpace: "nowrap",
  fontWeight: "bold",
});

const ButtonGrid = styled(Grid)({
  display: "flex",
  flexDirection: "row",
  justifyContent:"center",
  alignItems: "flex-start",
  width: '10vw',
  marginBottom: '2vw',
  marginTop: "2vw",
  gap: '10%',
});

const ErrorType = styled(Typography)({
  fontStyle: 'italic',
  textAlign: 'center',
  color: 'grey',
  paddingLeft: '5vw',
  paddingRight: '5vw'
});