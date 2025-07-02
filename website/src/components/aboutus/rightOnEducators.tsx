import React from 'react';
import { Grid, Typography, Box, Divider, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import AndreaRuby from '../../images/AndreaRuby.svg';
import BenWoodford from '../../images/BenWoodfordPhd.svg';
import AyNurNajm from '../../images/Ay-NurNajm.jpg.svg';
import linkedInIcon from '../../images/LinkedIn.svg';
import 'swiper/css';
import 'swiper/css/pagination';

interface IRightOnEducators {
    screenSize: ScreenSize;
}

const educatorData = [
{   img: AndreaRuby,
    name: 'Andrea Ruby', 
    title: 'Math Educator', 
    description: `Andrea has shared her love for teaching
math as a secondary math teacher in
the Philadelphia Public Schools for the
last 15 years. She has designed
curriculum, facilitated professional
development, and managed
partnerships to advance underserved
youth in STEM. A former Fulbright
Scholar, Andrea has an MS degree in
Urban Education, with a focus in
secondary mathematics.`,
cardShade: '#BE3647'
},{ img: AyNurNajm,
    name: 'Ay-Nur Najm', 
    title: 'Math Instructional Coach', 
    description: `Ay-Nur is an independent math
consultant and software developer. She
was previously a math instructional
coach and computer science teacher in
Brooklyn, where she helped establish a
charter school with Uncommon
Schools. She taught in New York City
public and charter schools for a decade
and is passionate about providing
access to high quality instruction to all
kids.`,
cardShade: '#6393B8'
},{ img: BenWoodford,
    name: 'Ben Woodford, PhD', 
    title: 'Math Education Researcher', 
    description: `A classroom teacher and tutor of many
years, Ben completed a doctorate in
mathematics education at Stanford
University. He has developed innovative
curricula and next-generation survey
instruments, and is knowledgeable
about best practices for learning both in
and outside the classroom.`,
cardShade: '#B22E5D'
}
]

export default function RightOnEducators({ screenSize }: IRightOnEducators) {

    return(
       <StyledFlexBox width="100%" direction="row" align="center" justify="center" sx={{ position: 'relative' }} >
       {screenSize === ScreenSize.LARGE && <Typography 
        component={Button}
        sx={{ 
            height: '110px', 
            width: '110px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: "#494949",
            color: '#fff',
            borderRadius: '50%',
            position: 'absolute',
            left: -50,
            top: 300

            }} fontSize="24px">&lt;</Typography>}
        {educatorData.map(({ name, title, description, cardShade, img},i) => (
            <StyledFlexBox width="410px" key={name} sx={{ padding: '20px'}}>

                <StyledFlexBox width="370px" height="690px" sx={{ background: cardShade,  borderRadius: '24px' }}>

                {/* image */}
                <StyledFlexBox align="center" sx={{ paddingTop: '30px', background: cardShade, borderRadius: '24px' }}>
                    <Box component="img" src={img} width="240px" height="240px" sx={{ borderRadius: '50%' }} />
                </StyledFlexBox>

                {/* name, title & description */}
                <StyledFlexBox sx={{ padding: '18px 22px 24px 26px', background: cardShade, width: '100%', borderRadius: '24px' }}>
                    <StyledFlexBox direction="row" justify="space-between" align="center" sx={{ width: '100%'}}>
                        <StyledFlexBox  direction="column" sx={{ width: '100%'}}>
                        <Typography color="#fff" fontFamily="Roboto" fontSize="24px" lineHeight={1.3} fontWeight={600}>{name}</Typography>
                        <Typography color="#fff" fontFamily="Roboto" fontSize="20px" lineHeight={1.3} fontWeight={400}>{title}</Typography>
                        </StyledFlexBox>
                        <Box component="img" src={linkedInIcon} alt="linkedIn" />
                    </StyledFlexBox>
                        <Divider flexItem sx={{ width: '100%', background: '#fff', marginBottom: '6px' }}/>
                        <Typography color="#fff" fontFamily="Roboto" fontSize="18px" lineHeight={1.3} fontWeight={400}>{description}</Typography>
                </StyledFlexBox>
                </StyledFlexBox>
            </StyledFlexBox>
        ))}
         {screenSize === ScreenSize.LARGE && <Typography
         component={Button} 
         sx={{ 
            height: '110px', 
            width: '110px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: "#494949",
            color: '#fff',
             borderRadius: '50%',
            position: 'absolute',
            right: -50,
            top: 300 
            }} fontSize="24px">&gt;</Typography>}
       </StyledFlexBox>
    )
}