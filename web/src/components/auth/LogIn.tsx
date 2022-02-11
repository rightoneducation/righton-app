import React from "react";
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

const LogIn: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const history = useHistory();


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
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onSubmit={handleSubmit}
    >
      <h1 style={{ fontSize: "22px", fontWeight: 800 }}>
        {" "}
        Sign in to an existing account
      </h1>
      <Field label="Email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
      <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button
        variant="contained"
        color="primary"
        size="large"
        type="submit"
        disabled={loading}
      >
        {loading && <CircularProgress size={20} style={{ marginRight: 20 }} />}
        Login to Your Account
      </Button>
      <DLink to="/signup">make a new account &rarr;</DLink>
    </form>
  );
};

export default LogIn;