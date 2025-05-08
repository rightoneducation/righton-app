import React from 'react';
import { styled, Box, Typography } from '@mui/material';
import { IUserProfile, CloudFrontDistributionUrl } from '@righton/networking';
import {
  LeftProfileContainer,
  LeftProfileTopContainer,
  LeftNameText,
  AtUserNameContainerAndAccount,
  AtUserNameContainer,
  AtUserNameText,
  LeftAccountCreatedContainer,
  LeftAccountCreatedInfo,
  LeftDateText,
  LeftBottomContainer,
  LeftBottomGamesContainer,
  LeftBottomGamesText,
  LeftBottomGamesNumber,
  LeftBottomGamesQuestionContainer,
  TopProfileContainer,
  TopSubContainer,
  TopNameText,
  MobileUserNameContainer,
  MobileBottomGamesContainer
} from '../../lib/styledcomponents/OwnerCardStyledComponents';
import profilePic from '../../images/profilePicGreen.png';
import { ScreenSize } from '../../lib/CentralModels';
import { ButtonType } from '../button/ButtonModels';
import CentralButton from "../button/Button";

interface OwnerCardProps {
    screenSize: ScreenSize;
    draftUserProfile: IUserProfile;
    newProfilePic: File | null;
    handleEditPicture: () => void;
}

export default function OwnerCard({
    screenSize,
    draftUserProfile,
    newProfilePic,
    handleEditPicture
}: OwnerCardProps) {

  let imageLink = '';
  if (newProfilePic) {
    const localURL = URL.createObjectURL(newProfilePic);
    imageLink = localURL;
  } else {
    imageLink = `${CloudFrontDistributionUrl}${draftUserProfile.profilePicPath}`;
  }

  const gamesMade = draftUserProfile.gamesMade || 0;
  const questionsMade = draftUserProfile.questionsMade || 0;
  const gamesUsed = draftUserProfile.favoriteGameTemplateIds?.length || 0;

  return (
    screenSize === ScreenSize.LARGE ? (
        <LeftProfileContainer>
        <LeftProfileTopContainer>
            <LeftNameText>
            {`${draftUserProfile.title} ${draftUserProfile.firstName}`}
            </LeftNameText>
            <img src={imageLink} alt="Right On Logo" style={{ width: '165px', height: '165px', borderRadius: '128px', objectFit: 'cover' }} />
            <CentralButton buttonType={ButtonType.EDITPROFILEPICTURE} isEnabled onClick={handleEditPicture}/>
            <AtUserNameContainerAndAccount>
                <AtUserNameContainer >
                    <AtUserNameText>
                        @{draftUserProfile.userName}
                    </AtUserNameText>
                </AtUserNameContainer>
                <LeftAccountCreatedContainer>
                    <LeftAccountCreatedInfo>
                        Account Created
                    </LeftAccountCreatedInfo>
                    <LeftDateText>
                        11/18/2023
                    </LeftDateText>
                </LeftAccountCreatedContainer>
            </AtUserNameContainerAndAccount>
        </LeftProfileTopContainer>
        <Box style={{display: 'flex', flexDirection: 'column', width: '100%', gap: '8px'}}>
        <LeftBottomContainer>
            <LeftBottomGamesQuestionContainer>
                <LeftBottomGamesContainer>
                    <LeftBottomGamesText>
                        Games Made
                    </LeftBottomGamesText>
                    <LeftBottomGamesNumber>
                        {gamesMade}
                    </LeftBottomGamesNumber>
                </LeftBottomGamesContainer>
                <LeftBottomGamesContainer>
                    <LeftBottomGamesText>
                        Question Made
                    </LeftBottomGamesText>
                    <LeftBottomGamesNumber>
                        {questionsMade}
                    </LeftBottomGamesNumber>
                </LeftBottomGamesContainer>
            </LeftBottomGamesQuestionContainer>
        </LeftBottomContainer>
        <LeftBottomGamesContainer>
            <LeftBottomGamesText>
                Games Used
            </LeftBottomGamesText>
            <LeftBottomGamesNumber>
                {gamesUsed}
            </LeftBottomGamesNumber>
          </LeftBottomGamesContainer>
        </Box>
      </LeftProfileContainer>  
    ) : (
        <TopProfileContainer>
            <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <TopNameText>
                    Ms. Clark
                </TopNameText>
            </Box>
            <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <MobileUserNameContainer >
                <img src={profilePic} alt="Right On Logo" style={{ width: '50px', height: '50px' }} />
                <AtUserNameText>
                    @clarkinator27
                </AtUserNameText>
            </MobileUserNameContainer>
            </Box>
            <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '16px'}}>
                <TopSubContainer>
                    <LeftBottomContainer>
                        <LeftBottomGamesContainer>
                            <LeftBottomGamesText>
                                Games Made
                            </LeftBottomGamesText>
                            <LeftBottomGamesNumber>
                                {gamesMade}
                            </LeftBottomGamesNumber>
                        </LeftBottomGamesContainer>
                        <LeftBottomGamesContainer>
                            <LeftBottomGamesText>
                                Questions Made
                            </LeftBottomGamesText>
                            <LeftBottomGamesNumber>
                                {questionsMade}
                            </LeftBottomGamesNumber>
                        </LeftBottomGamesContainer>
                        <LeftBottomGamesContainer>
                            <LeftBottomGamesText>
                                Games Used
                            </LeftBottomGamesText>
                            <LeftBottomGamesNumber>
                                {gamesUsed}
                            </LeftBottomGamesNumber>
                        </LeftBottomGamesContainer>          
                    </LeftBottomContainer>
                </TopSubContainer>
            </Box>
            <TopSubContainer>
                    <LeftAccountCreatedContainer>
                        <LeftAccountCreatedInfo>
                            Account Created
                        </LeftAccountCreatedInfo>
                        <LeftDateText>
                            11/18/2023
                        </LeftDateText>
                    </LeftAccountCreatedContainer>
                </TopSubContainer>
        </TopProfileContainer>
    )
  );
}