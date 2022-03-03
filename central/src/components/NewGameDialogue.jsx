import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CCSSField from './CCSSField';

const INITIAL_STATE = {
  title: '',
  description: '',
};

export default function NewGameDialogue({ open, onClose, submit }) {
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
            onChange={({ currentTarget }) => { setGame({ ...game, title: currentTarget.value }); }}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            id="tite"
            label="Description"
            value={game.description}
            onChange={({ currentTarget }) => { setGame({ ...game, description: currentTarget.value }); }}
            fullWidth
            multiline
            rows={2}
          />
          <CCSSField
            grade={game.grade}
            domain={game.domain}
            cluster={game.cluster}
            standard={game.standard}
            updateGame={(field, value) => setGame({ ...game, [field]: value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
