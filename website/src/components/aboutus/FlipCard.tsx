import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

export default function FlipCard({ front, back }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Box
      onClick={() => setFlipped(!flipped)}
      sx={{
        width: '250px',
        height: '400px',
        perspective: '1000px',
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          // whileHover={{ rotateX: -3, rotateY: flipped ? 180 : 3 }}
          transition={{ duration: 0.6 }}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
            }}
          >
            {front}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {back}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
