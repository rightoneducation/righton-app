import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { CustomTooltip } from '../../lib/styledcomponents/ToolTipStyledComponents';

interface EditToolTipProps {
  isEditEnabled: boolean; // Optional prop to control edit state
  children: React.ReactElement;
}

export default function EditToolTip({
  isEditEnabled,
  children
}: EditToolTipProps) {
  const theme = useTheme();

  switch (isEditEnabled) {
    case true:
      return children; // if edit enabled, bypass tooltip
    case false:
    default:
      return (
          <CustomTooltip
            title={
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                  You must be the owner to do this.
                </Typography>
              </Box>
            }
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: `${theme.palette.primary.extraDarkBlue}`,
                  color: '#FFFFFF !important', // Ensures text remains white
                  fontSize: '14px',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  maxWidth: '250px', 
                  boxSizing: 'border-box',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                  '& .MuiTooltip-arrow': {
                    color: `${theme.palette.primary.extraDarkBlue}`,
                  },
                },
              },
            }}
            arrow
            placement="bottom"
          >
            {children}
          </CustomTooltip>
      )
    }
}