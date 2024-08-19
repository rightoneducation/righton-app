import React from 'react';
import Typography from '@material-ui/core/Typography';

interface CCSSTextProps {
  grade: string;
  domain: string;
  cluster: string;
  standard: string;
};

export default function CCSSText({
  grade,
  domain,
  cluster,
  standard
}: CCSSTextProps) {
  if (grade === 'Mashup') return <Typography style={{fontWeight: 700, color: '#9139F8'}} >Mashup</Typography>;
  if (grade === 'Misc' && domain === 'Misc') return <Typography style={{fontWeight: 700, color: '#9139F8'}} >Misc.</Typography>;
  if (grade === 'Misc') return <Typography style={{fontWeight: 700, color: '#9139F8'}} >{`${domain}`}</Typography>;
  if (grade && domain) {
    let clusterCombined: string = cluster ? '.' + cluster  : '';
    let standardCombined: string = standard ? '.' + standard : '';
    let domainCombined: string = domain ? '.' + domain : '';
    return (
      <Typography style={{fontWeight: 700, color: '#9139F8'}}>
        {`${grade}${domainCombined}${clusterCombined}${standardCombined}`}
      </Typography>
    );
  }; 
  return null;
}