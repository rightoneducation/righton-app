import React, { useRef } from 'react';
import { Grid, Typography, Box, Divider, Button } from '@mui/material';
import { Swiper, SwiperSlide, useSwiper, SwiperRef } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import AndreaRuby from '../../images/AndreaRuby.svg';
import BenWoodford from '../../images/BenWoodfordPhd.svg';
import AyNurNajm from '../../images/Ay-NurNajm.jpg.svg';
import linkedInIcon from '../../images/LinkedIn.svg';
import BummiImg from '../../images/profile_bummi.jpg';
import EsmeImg from '../../images/profile_Esme.jpg';
import PaulImg from '../../images/profile_paul.jpg';
import PaytonImg from '../../images/profile_payton.jpg';
import YonglinImg from '../../images/profile_yonglin.png';

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
cardShade: '#BE3647',
gradient: 'linear-gradient(to bottom, rgba(254,74,97,1),rgba(190,54,71,1))',
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
cardShade: '#6393B8',
gradient: 'linear-gradient(to bottom, rgba(149,208,254,1),rgba(99,147,185,1))',
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
cardShade: '#B22E5D',
gradient: 'linear-gradient(to bottom, rgba(226,97,143,1), rgba(178,46,93,1))'
},
 {
      id: 3,
      name: 'Bunmi Esho',
      img: BummiImg,
      title: 'STEM Advocacy Executive',
      description: 'Founder of Ori Consultancy, Bunmi has held several STEM leadership roles, including Vice President of Programs at Endless OS Foundation and California Executive Director of Techbridge Girls. She has over 20 years of experience in education and the nonprofit sector, and considers herself an eternal STEM advocate.',
      gradadient: 'linear-gradient(#4b65dd, #3a4b9b)',
      cardShade: '#3a4b9b',
      linkedIn: 'https://www.linkedin.com/in/bunmiesho/'
    },
     {
      id: 4,
      name: 'Esmeralda Ortiz, EdD',
      img: EsmeImg,
      title: 'Youth Development Leader',
      description: "A Vice President at the Boys & Girls Clubs of the Peninsula, Esme leads high school and post-secondary success programs across all BGCP sites. Over the past ten years, she has developed and led partnerships with public high schools to engage more students, helping them achieve both academic and leadership goals. A first-generation college graduate, Esme seeks to increase the representation and success of first-generation students in higher education.",
      gradient: 'linear-gradient(#fd4960, #be3647)',
      cardShade: '#be3647',
      linkedIn: 'https://www.linkedin.com/in/esmeralda-ortiz-0400b476/'
    },
     {
      id: 5,
      name: 'Paul Chin, EdD',
      img: PaulImg,
      title: 'Professor of Clinical Practice',
      description: "A Professor of Clinical Practice at the Relay Graduate School of Education, Paul is a staunch advocate of educational equity who has dedicated his career to teaching and leading in underserved communities. Paul began his work in education as a middle school math teacher in Los Angeles & Newark before transitioning to school leadership roles in Indianapolis & Brooklyn. After 12 years of teaching and leading in schools, Paul joined the faculty at Relay and recently completed a doctoral program at Teachers College, Columbia University.",
      gradient: "linear-gradient(#92cdfb, #6393b8)",
      cardShade: '#6393b8',
      linkedIn: 'https://www.linkedin.com/in/prof-paul-chin/'
    },
    {
      id: 6,
      name: 'Payton Richardson',
      img: PaytonImg,
      title: 'Data, Research & Policy Director',
      description: "Payton is a mixed-methods education researcher and policy professional with expertise in analyzing K-12 data and performance frameworks. At Eastside Pathways, Payton formulates data strategies and provides ongoing analysis for a collective impact partnership of over 60 public, private, and community-based organizations to support every child on their journey from cradle to career. With a newly growing family, Payton is especially passionate about providing equity across the education landscape.",
      gradient: "linear-gradient(#e2618f, #b22e5d)",
      cardShade: '#b22e5d',
      linkedIn: 'https://www.linkedin.com/in/williampaytonrichardson/'
    }, 
    {
      id: 7,
      name: 'Yong Lin',
      img: YonglinImg,
      title: 'UX Designer',
      description: "A seasoned UX designer with over a decade of experience, Yong Lin brings expertise in creating products at the intersection of design and technology. Drawing from a diverse background, he has successfully led a team to develop a nation-wide education platform for the Singapore government. Combining an empathetic approach to design and teamwork, he is passionate about making a positive impact in the future of education. ",
      gradient: 'linear-gradient(#4b65dd, #3a4b9b)',
      cardShade: '#3a4b9b',
      linkedIn: 'https://www.linkedin.com/in/yonglinui/'
    }
]

export default function RightOnEducators({ screenSize }: IRightOnEducators) {
const swiperRef = useRef<SwiperRef>(null)

  return (
    <Box width="100%"
    sx={{
    '& .swiper-pagination-bullet': {
      width: '6px',
      height: '6px',
      backgroundColor: '#afafaf',
    },
    '& .swiper-pagination-bullet-active': {
      backgroundColor: '#494949',
    },
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    boxSizing: 'border-box'
    }}
    >
      {screenSize === ScreenSize.LARGE && (
        <Typography
          component={Button}
          onClick={() => swiperRef.current?.swiper?.slidePrev()}
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
            top: 300,
            zIndex: 10,
          }}
          fontSize="24px"
        >
          &lt;
        </Typography>
      )}
      
      <Swiper
      style={{ 
        paddingBottom: '48px',
         maxWidth: screenSize === ScreenSize.LARGE ? '1200px' : '100%',
    margin: '0 auto',
       }}
        modules={[Pagination]}
        pagination={{ clickable: true }}
        ref={swiperRef}
        centeredSlides
        centeredSlidesBounds
        loop
        initialSlide={Math.floor(educatorData.length / 2)}
        spaceBetween={10}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          700: {
            slidesPerView: 1.9,
          },
          1024: {
            slidesPerView: 3,
          }
        }}
      >
        {educatorData.map(({ name, title, description, cardShade, gradient, img }, i) => (
          <SwiperSlide
            key={name}
            style={{
              width: screenSize === ScreenSize.LARGE ? "370px":"100%",
              display: 'flex',
              justifyContent: 'center',
              
            }}
          >
                
                {/* card base */}
              <StyledFlexBox width={ screenSize === ScreenSize.LARGE ? "370px":"100%"} height="690px" sx={{ background: cardShade, borderRadius: '24px' }}>

                {/* Teacher image  */}
                <StyledFlexBox align="center" sx={{ paddingTop: '30px', background: gradient, borderRadius: '24px' }}>
                  <Box component="img" src={img} width="240px" height="240px" sx={{ borderRadius: '50%' }} />
                </StyledFlexBox>

                {/* name, professional title & linkedin */}
                <StyledFlexBox sx={{ padding: '18px 22px 24px 26px', background: cardShade, width: '100%', borderRadius: '24px' }}>
                  <StyledFlexBox direction="row" justify="space-between" align="center" sx={{ width: '100%' }}>
                    <StyledFlexBox direction="column" sx={{ width: '100%' }}>
                      <Typography color="#fff" fontFamily="Roboto" fontSize="24px" lineHeight={1.3} fontWeight={600}>{name}</Typography>
                      <Typography color="#fff" fontFamily="Roboto" fontSize="20px" lineHeight={1.3} fontWeight={400}>{title}</Typography>
                    </StyledFlexBox>
                    <Box component="img" src={linkedInIcon} alt="linkedIn" />
                  </StyledFlexBox>

                  {/* Educator description */}
                  <Divider flexItem sx={{ width: '100%', background: '#fff', marginBottom: '6px' }} />
                  <Typography color="#fff" fontFamily="Roboto" fontSize="18px" lineHeight={1.3} fontWeight={400}>{description}</Typography>
                </StyledFlexBox>
              </StyledFlexBox>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Right Arrow */}
      {screenSize === ScreenSize.LARGE && (
        <Typography
          component={Button}
          onClick={() => swiperRef.current?.swiper.slideNext()}
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
            top: 300,
            zIndex: 10,
          }}
          fontSize="24px"
        >
          &gt;
        </Typography>
      )}
      <Box className="swiper-pagination-container" display="flex" justifyContent="center" mt={2} />
    </Box>
  );
}
