import React from "react";
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import RightOnLogo from "../../images/RightOnLogo.png";
import { GoogleLogin } from '@react-oauth/google';

const LogIn: React.FC<{apiClients: any, handleUserAuth:(isLoggedIn:boolean)=>void }> = ({apiClients, handleUserAuth}) => {
  const [loading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [adminError, setAdminError] = React.useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClients.auth.awsSignIn(username, password);
      if (await apiClients.auth.verifyAuth()) {
        handleUserAuth(true);
        window.location.href = "/";
      }
      else {
        await apiClients.auth.awsSignOut();
        setAdminError(true);
      }
    } catch (e) {
      console.log(e);
      if (e instanceof Error){
          setAdminError(true);
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async() => {
    await apiClients.auth.awsSignInFederated();
  }

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
        }}
        alt="Right On"
      />
      <Grid item xs={12}>
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
            Sign In to an Existing Acccount
          </h1>
          <Field
            variant="outlined"
            label="Username"
            value={username}
            type="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Field
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ButtonGrid>
            <LogInLink
              to="#"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Log In
            </LogInLink>
            <SignUpLink to="/signup">Sign Up</SignUpLink>
          </ButtonGrid>
        <GoogleLogin
          onSuccess={() => handleGoogleLogin()}
          onError={() => {
            setAdminError(true);
          }}
        />
        </form>
      </Grid>
      {adminError ? <ErrorType> There has been an error. Please verify your username/password and contact the administrator for account verification. </ErrorType> : null}
    </Grid>
  );
};

export default LogIn;

const Field = styled(TextField)({
  margin: "10px 0",
  borderRadius: "20px",
  width: "100%",
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

const LogInLink = styled(Link)({
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

const ErrorType = styled(Typography)({
  fontStyle: 'italic',
  textAlign: 'center',
  color: 'grey',
  paddingLeft: '5vw',
  paddingRight: '5vw'
});
