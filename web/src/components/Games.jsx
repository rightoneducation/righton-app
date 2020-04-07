import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import games from '../data/Games.json';

function Games() {
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  return (
    <Box p={1}>
      <Box className="Sidebar">
        <Box className="Game-actions">
          <Button variant="contained" color="primary">
            Add game
          </Button>
        </Box>
        {games.map(({ GameID, title }) => (
          <Card key={GameID}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {title}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Edit</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default Games;
