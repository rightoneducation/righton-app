import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import RightOnLogo from "../../images/RightOnLogo.png";

const Signup: React.FC <{apiClients: any}> = ({apiClients}) =>{
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      return;
    }
    try {
      await apiClients.auth.awsSignUp(username, email, password);
      history.push("/confirmation");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <img
        src={RightOnLogo}
        style={{
          marginTop: "3%",
          width: '15%',
          minWidth: '200px',
          marginBottom: "3%",
          maxHeight: "2%",
        }}
        alt="Right On"
      />
      <Grid item xs={12}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: '5vw',
            paddingRight: '5vw'
          }}
          onSubmit={handleSignUp}
        >
          <h1 style={{ fontSize: "22px", color: "gray", textAlign: "center" }}>
            {" "}
            Step 1: New Account Registration
          </h1>
          <Grid style={{display: "flex", flexDirection:"row", justifyContent: "center", gap:"2%", marginBottom: '0'}}>
            <Field
              variant="outlined"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Field
              variant="outlined"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </Grid>
          <Grid style={{display: "flex", flexDirection:"row", justifyContent: "center", gap:"2%", marginBottom: '0'}}>
            <Field
              variant="outlined"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Field
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Grid>
          <ButtonGrid>
            <SignUpLink
              to="#"
              onClick={(e) => {
                handleSignUp(e);
              }}
            >
              Sign Up
            </SignUpLink>
            <LoginLink to="/login">Log In</LoginLink>
          </ButtonGrid>
        </form>
      </Grid>
      <PassType> Passwords must be at least 8 characters in length and include at least one letter and one number. </PassType>
    </Grid>
  );
};

export default Signup;

const Field = styled(TextField)({
  margin: "10px 0",
  borderRadius: "20px",
});

const SignUpLink = styled(Link)({
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

const LoginLink = styled(Link)({
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

const PassType = styled(Typography)({
  fontStyle: 'italic',
  textAlign: 'center',
  color: 'grey',
  paddingLeft: '5vw',
  paddingRight: '5vw'
});