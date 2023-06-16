import { styled } from '@mui/material/styles';

// icons for the avatar select screen
interface AvatarIconStyledProps {
  isSelected: boolean;
}

export default styled('img', {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<AvatarIconStyledProps>(({ isSelected }) => ({
  height: '106px',
  width: 'auto',
  boxShadow: '0px 8px 20px rgba(26, 100, 136, 0.3)',
  borderRadius: '20px',
  borderColor: 'white',
  borderStyle: 'solid',
  borderWidth: isSelected ? '6px' : '0px',
  animation: isSelected ? `scaleAnimation 300ms` : 'none',
  '@keyframes scaleAnimation': {
    '0%': {
      opacity: 0,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 1,
      transform: 'scale(0.95)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1.0)',
    },
  },
}));