import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Game } from '../API';

export default function CCSS(game: Game) {
  if (game.grade === 'General') return <Typography style={{fontWeight: 700, color: '#9139F8'}} >{game.grade}</Typography>;
  if (game.grade && game.domain && game.cluster && game.standard) {
    return (
      <Typography style={{fontWeight: 700, color: '#9139F8'}}>
        {`${game.grade}.${game.domain}.${game.cluster}.${game.standard}`}
      </Typography>
    );
  }; 
  return null;
}