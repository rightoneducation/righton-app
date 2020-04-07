import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const INITIAL_STATE = {
  title: '',
};

export default function FormDialog({ open, onClose, submit }) {
  const [game, setGame] = useState(INITIAL_STATE);
  const onSubmit = (event) => {
    submit(game);
    event.preventDefault();
    setGame(INITIAL_STATE);
  };
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="new-game-popup">
      <form onSubmit={onSubmit}>
        <DialogTitle id="new-game-popup">New game</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="tite"
            label="Title"
            value={game.title}
            onChange={({ currentTarget }) => { setGame({ title: currentTarget.value }); }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Subscribe
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
