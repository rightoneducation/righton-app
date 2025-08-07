import React, { useState} from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CMSBodyText, CMSMonsterAvatar, CMSArticleType } from '@righton/networking';
import { ScreenSize } from '../../lib/WebsiteModels';
import { 
  cmsMonsterAvatar0, 
  cmsMonsterAvatar1, 
  cmsMonsterAvatar2, 
  cmsMonsterAvatar3, 
  cmsMonsterAvatar4, 
  cmsMonsterAvatar5
} from '../../images';
import shareLinkedIn from '../../images/shareLinkedIn.svg';
import shareTwitter from '../../images/shareTwitter.svg';
import shareFacebook from '../../images/shareFacebook.svg';
import shareLink from '../../images/shareLink.svg';
import shareMobile from '../../images/shareMobile.svg';

const HeaderContainer = styled(Box)(({ theme }) => ({
  width: '100%', 
  display: 'flex', 
  alignItems: 'space-between',
}));

interface ArticleHeaderProps {
  screenSize: ScreenSize;
  articleId: string;
  selectedArticle: CMSArticleType;
  handleShareClicked: () => void;
  handleMobileShareClicked: () => void;
}

export function ArticleHeader ({ // eslint-disable-line
  screenSize,
  articleId,
  selectedArticle,
  handleShareClicked,
  handleMobileShareClicked,
 }: ArticleHeaderProps) { 
  const monsterAvatarMap: { [key: number]: string } = {
    0: cmsMonsterAvatar0,
    1: cmsMonsterAvatar1,
    2: cmsMonsterAvatar2,
    3: cmsMonsterAvatar3,
    4: cmsMonsterAvatar4,
    5: cmsMonsterAvatar5,
  };

  const avatarSrc = monsterAvatarMap[selectedArticle.monsterSelect] || cmsMonsterAvatar0;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.rightoneducation.com/share/${articleId}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.rightoneducation.com/share/${articleId}`)}&text=${encodeURIComponent(selectedArticle.title)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.rightoneducation.com/share/${articleId}`)}`;
  const shareLinkUrl = `https://www.rightoneducation.com/library/${articleId}`;

  return (
    <HeaderContainer>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Box style={{ display: 'flex', gap: '12px' }}>
          <CMSMonsterAvatar src={avatarSrc} alt="Monster Avatar" />
          <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CMSBodyText>{selectedArticle.author}</CMSBodyText> 
            <Box style={{ display: 'flex', gap: '8px' }}>
              <CMSBodyText>{selectedArticle.date}</CMSBodyText> 
              <CMSBodyText>•</CMSBodyText>
              <CMSBodyText>{selectedArticle.readingTimeMinutes} min read</CMSBodyText> 
            </Box>
          </Box> 
        </Box>
        {screenSize === ScreenSize.LARGE ? 
        <Box style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Box  
            onClick={() => {
              window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
            }}
            style={{ cursor: 'pointer' }}
          >
            <img src={shareLinkedIn} alt="Share on LinkedIn" style={{ width: '32px', height: '32px' }}/>
          </Box>
          <Box  
            onClick={() => {
              window.open(twitterUrl, '_blank', 'noopener,noreferrer');
            }}
            style={{ cursor: 'pointer' }}
          >
            <img src={shareTwitter} alt="Share on Twitter" style={{ width: '32px', height: '32px' }}/>
          </Box>

          <Box 
            onClick={() => {
              window.open(facebookUrl, '_blank', 'noopener,noreferrer');
            }}
            style={{cursor: 'pointer'}}
          >
            <img src={shareFacebook} alt="Share on Facebook" style={{ width: '32px', height: '32px' }}/>
          </Box>
          <Box 
            onClick={() => {
              handleShareClicked();
              navigator.clipboard.writeText(shareLinkUrl);
            }}
            style={{cursor: 'pointer'}}
          >
            <img src={shareLink} alt="Share Link" style={{ width: '32px', height: '32px' }}/>
          </Box>
        </Box>
        : <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box  
            onClick={() => {
              handleMobileShareClicked();
            }}
            style={{ cursor: 'pointer' }}
          >
            <img src={shareMobile} alt="Share" style={{ width: '32px', height: '32px' }}/>
          </Box>
        </Box>
}
      </Box>
    </HeaderContainer>
  )
}