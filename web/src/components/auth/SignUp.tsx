import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link, useHistory } from "react-router-dom";

const Field = styled(TextField)({
  margin: "10px 0",
});

const DLink = styled(Link)({
  margin: "15px 0",
  textAlign: "right",
});

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
        name
      },
    });
    alert("Success");
    history.push("/confirmation");
  } catch (error) {
    console.error(error);
    alert("Error");
  }
  setLoading(false);
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onSubmit={handleSignUp}
    >
      <h1 style={{ fontSize: "22px", fontWeight: 800 }}>
        {" "}
        New Account Registration
      </h1>
      <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Field label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Field
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        size="large"
        type="submit"
        disabled={loading}
      >
        {loading && <CircularProgress size={20} style={{ marginRight: 20 }} />}
        Sign Up
      </Button> 
      <DLink to="/signin">go to login &rarr;</DLink>
    </form>
  );
};

export default Signup;
