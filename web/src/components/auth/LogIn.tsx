import React from "react";
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import RightOnLogo from "./RightOnLogo.png";

const LogIn: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await Auth.signIn(email, password);
      alert("Success!!");
      //history.push("/");
      window.location.href="/";
    } catch (error) {
      alert("Error!!");
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
      }}
      onSubmit={handleSubmit}
    >
      <h1 style={{ fontSize: "22px", color: "grey" }}>
        {" "}
        Log to an existing account
      </h1>
      <Field variant="outlined" label="Email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
      <Field variant="outlined" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <ButtonGrid item direction="row" justifyContent="space-between" spacing={4}>
      <SignUpLink to="/signup">Sign Up</SignUpLink>
      <LogInLink to="#" onClick={(e) => {handleSubmit(e)}}>Log In</LogInLink>
      </ButtonGrid>
    </form>
    </Grid>
    </Grid>
  );
};

export default LogIn;

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

const ButtonGrid = styled(Grid) ({
  marginTop: "10%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
})
