import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { CMSArticleType } from '@righton/networking';
import CloseIcon from '../../images/shareModalClose.svg';
import ShareMobileModalCard from './ShareMobileModalCard';
import shareLinkedIn from '../../images/shareLinkedIn.svg';
import shareTwitter from '../../images/shareTwitter.svg';
import shareFacebook from '../../images/shareFacebook.svg';
import shareLink from '../../images/shareLink.svg';

interface ShareMobileModalProps {
  articleId: string;
  selectedArticle: CMSArticleType | null;
  handleCloseShareModalClick: () => void;
}

export function ShareMobileModal ({ // eslint-disable-line
  articleId,
  selectedArticle,
  handleCloseShareModalClick,
}: ShareMobileModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.rightoneducation.com/share/${articleId}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.rightoneducation.com/share/${articleId}`)}&text=${encodeURIComponent(selectedArticle?.title ?? '')}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.rightoneducation.com/share/${articleId}`)}`;
  const shareLinkUrl = `https://www.rightoneducation.com/library/${articleId}`;

  const handleCopyLinkClicked = () => {
    navigator.clipboard.writeText(shareLinkUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <Box
      style={{
        width: '100%',
        minHeight: '335px',
        padding: '24px',
        borderRadius: '8px',
        backgroundColor: '#142B6F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '12px',
        boxSizing: 'border-box',
      }}
    >
      <Box
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleCloseShareModalClick}
      >
        <img src={CloseIcon} alt="Close Modal" />
      </Box>
      <Typography
        style={{
          width: '100%',
          textAlign: 'center',
          color: '#fff',
          fontSize: '24px',
          lineHeight: '24px',
          fontWeight: '600',
          fontFamily: 'Poppins',
        }}
      >
        Check this out!
      </Typography>
      {selectedArticle && (
        <ShareMobileModalCard selectedArticle={selectedArticle} />
      )}
      <Box
        style={{
          width: '100%',
          border: '0.5px solid #FFF',
          boxSizing: 'border-box',
        }}
      />
      <Typography
        style={{
          width: '100%',
          textAlign: 'left',
          color: '#fff',
          fontSize: '20px',
          lineHeight: '20px',
          fontWeight: '400',
          fontFamily: 'Poppins',
        }}
      >
        Send to:
      </Typography>
      <Box
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <Box
          onClick={() => {
            window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            minWidth: '52px',
            cursor: 'pointer',
          }}
        >
          <img
            src={shareLinkedIn}
            alt="LinkedIn"
            style={{ width: '42px', height: '42px' }}
          />
          <Typography
            style={{
              color: '#fff',
              fontSize: '12px',
              lineHeight: '12px',
              fontWeight: '400',
              fontFamily: 'Rubik',
            }}
          >
            LinkedIn
          </Typography>
        </Box>
        <Box
          onClick={() => {
            window.open(facebookUrl, '_blank', 'noopener,noreferrer');
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            width: '52px',
            cursor: 'pointer',
          }}
        >
          <img
            src={shareFacebook}
            alt="Facebook"
            style={{ width: '42px', height: '42px' }}
          />
          <Typography
            style={{
              color: '#fff',
              fontSize: '12px',
              lineHeight: '12px',
              fontWeight: '400',
              fontFamily: 'Rubik',
            }}
          >
            Facebook
          </Typography>
        </Box>
        <Box
          onClick={() => {
            window.open(twitterUrl, '_blank', 'noopener,noreferrer');
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            minWidth: '52px',
            cursor: 'pointer',
          }}
        >
          <img
            src={shareTwitter}
            alt="Twitter"
            style={{ width: '42px', height: '42px' }}
          />
          <Typography
            style={{
              color: '#fff',
              fontSize: '12px',
              lineHeight: '12px',
              fontWeight: '400',
              fontFamily: 'Rubik',
            }}
          >
            Twitter
          </Typography>
        </Box>
        
        <Box
          onClick={handleCopyLinkClicked}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            width: '52px',
            cursor: 'pointer',
          }}
        >
          <img
            src={shareLink}
            alt="Link"
            style={{ width: '42px', height: '42px' }}
          />
          <Typography
            style={{
              color: '#fff',
              fontSize: '12px',
              lineHeight: '12px',
              fontWeight: '400',
              fontFamily: 'Rubik',
              transition: 'all 0.3s ease-in-out',
              transform: isCopied ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {isCopied ? 'Copied!' : 'Copy link'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}