import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CCSSField from './CCSSField';

export default function EditGameDialogue({ game, open, onClose, submit }) {
  const [updatedGameDetails, setUpdatedGameDetails] = useState({ ...game });
  const history = useNavigate();
  const location = useLocation();
  const onSubmit = (event) => {
    submit(updatedGameDetails);
    event.preventDefault();
    history(location.pathname.replace('/edit', ''));
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-game-popup"
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={onSubmit}>
        <DialogTitle id="edit-game-popup">Edit game</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="tite"
            label="Title"
            value={updatedGameDetails.title}
            onChange={({ currentTarget }) => {
              setUpdatedGameDetails({
                ...updatedGameDetails,
                title: currentTarget.value,
              });
            }}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            id="tite"
            label="Description"
            value={updatedGameDetails.description}
            onChange={({ currentTarget }) => {
              setUpdatedGameDetails({
                ...updatedGameDetails,
                description: currentTarget.value,
              });
            }}
            fullWidth
            multiline
            minRows={2}
          />
          <CCSSField
            grade={updatedGameDetails.grade}
            domain={updatedGameDetails.domain}
            cluster={updatedGameDetails.cluster}
            standard={updatedGameDetails.standard}
            updateGame={(field, value) =>
              setUpdatedGameDetails({ ...updatedGameDetails, [field]: value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Typography variant="caption">Game ID: {game.GameID}</Typography>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
