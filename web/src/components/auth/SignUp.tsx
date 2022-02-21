import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link, useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
import RightOnLogo from "./RightOnLogo.png";

const Signup: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      await Auth.signUp({
        username: email,
        password: confirmPassword,
        attributes: {
          email,
          name,
        },
      });
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
          width: "20%",
          marginBottom: "3%",
          maxHeight: "2%",
        }}
        alt="Right On"
      />
      <Grid item xs={12} md={12}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "120%",
            marginLeft: "-10%",
          }}
          onSubmit={handleSignUp}
        >
          <h1 style={{ fontSize: "22px", color: "gray" }}>
            {" "}
            New Account Registration
          </h1>
          <FieldGrid
            item
            direction="row"
            justifyContent="space-between"
            xs={12}
          >
            <Field
              variant="outlined"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Field
              variant="outlined"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </FieldGrid>
          <FieldGrid
            item
            direction="row"
            justifyContent="space-between"
            xs={12}
          >
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
          </FieldGrid>
          <ButtonGrid
            item
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <LoginLink to="/login">Log In</LoginLink>
            <SignUpLink
              to="#"
              onClick={(e) => {
                handleSignUp(e);
              }}
            >
              Sign Up
            </SignUpLink>
          </ButtonGrid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Signup;

const Field = styled(TextField)({
  margin: "10px 0",
  borderRadius: "20px",
  width: "45%",
});

const SignUpLink = styled(Link)({
  backgroundColor: "#FC1047",
  textDecoration: "none",
  color: "white",
  borderRadius: "34px",
  padding: "5%",
  fontWeight: "bold",
});

const LoginLink = styled(Link)({
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
  marginBottom: "50px",
});

const FieldGrid = styled(Grid)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
});
