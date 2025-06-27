import React from 'react';
import { Box, Grid } from '@mui/material';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import SinclairImg from '../../images/sinclair.svg';
import SinclairTitle from '../../images/SinclarTitle.svg'

interface IRightOnTeam {
    screenSize: ScreenSize
}

const teamArr = [
    {img: SinclairImg, name: 'Sinclair Wu', title: 'Product Lead', linkedIn: '#'},
    {img: SinclairImg, name: 'Sinclair Wu', title: 'Product Lead', linkedIn: '#'},
    {img: SinclairImg, name: 'Sinclair Wu', title: 'Product Lead', linkedIn: '#'},
    {img: SinclairImg, name: 'Sinclair Wu', title: 'Product Lead', linkedIn: '#'},
    {img: SinclairImg, name: 'Sinclair Wu', title: 'Product Lead', linkedIn: '#'},
    {img: SinclairImg, name: 'Sinclair Wu', title: 'Product Lead', linkedIn: '#'},
    {img: SinclairImg, name: 'Sinclair Wu', title: 'Product Lead', linkedIn: '#'},
    {img: SinclairImg, name: 'Sinclair Wu', title: 'Product Lead', linkedIn: '#'}
]

export default function RightonTeam({ screenSize }: IRightOnTeam){

    return(
        <Grid container direction={screenSize === ScreenSize.LARGE ? 'row':'column'} spacing={6}>
            {teamArr.map(({ img, name, title},i) => (
                <Grid size={3} key={name} height="372px">
                    <Box width="252px" height="302px" component="img" src={img} alt={`${name}--${i}`} />
                    <Box width="252px" height="70px" component="img" src={SinclairTitle} alt={`${name}--${i}`} />
                </Grid>
            ))}
        </Grid>
    )
}