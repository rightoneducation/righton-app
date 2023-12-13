import React from 'react';
import { makeStyles, Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';

export default function GamesFooter({
  listGameTemplatePrevTokens,
  listGameTemplateNextToken,
  handlePrevPage,
  handleNextPage
}) {
  const classes = useStyles();
  return (
    <Box className={classes.footer}>
      <Button
        disabled={listGameTemplatePrevTokens.length === 1}
        className={classes.pageButton}
        onClick={() => handlePrevPage()}
      >
        Previous Page
      </Button>
      <Button
        disabled={!listGameTemplateNextToken}
        className={classes.pageButton}
        onClick={() => handleNextPage()}
      >
        Next Page
      </Button>
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'sticky',
    bottom: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '64px',
    background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
    gap: 16,
  },
  pageButton: {
    border: '4px solid #159EFA',
    background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
    borderRadius: '24px',
    width: '160px',
    height: '32px',
    color: 'white',
    fontSize: '18px',
    bottom: '0',
    fontWeight: '700',
    lineHeight: '30px',
    textTransform: 'none',
    boxShadow: '0px 5px 22px 0px #47D9FF4D',
    '&:disabled': {
      background: 'transparent',
      border: '2px solid #159EFA',
      borderRadius: '24px',
      width: '160px',
      height: '32px',
      color: '#159EFA',
      fontSize: '18px',
      fontWeight: '700',
      lineHeight: '30px',
      opacity: '25%',
      cursor: 'not-allowed',
    },
  }
}));
