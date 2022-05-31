import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Game } from '../API';

export default function CCSS(game: Game) {
  if (game.grade === 'Mashup') return <Typography style={{fontWeight: 700, color: '#9139F8'}} >Mashup</Typography>;
  if (game.grade === 'Misc' && game.domain === 'Misc') return <Typography style={{fontWeight: 700, color: '#9139F8'}} >Misc.</Typography>;
  if (game.grade === 'Misc') return <Typography style={{fontWeight: 700, color: '#9139F8'}} >{`${game.domain}`}</Typography>;
  if (game.grade && game.domain) {
    let cluster = game.cluster ? '.' + game.cluster  : '';
    let standard = game.standard ? '.' + game.standard : '';
    let domain = game.domain ? '.' + game.domain : '';
    return (
      <Typography style={{fontWeight: 700, color: '#9139F8'}}>
        {`${game.grade}${domain}${cluster}${standard}`}
      </Typography>
    );
  }; 
  return null;
}