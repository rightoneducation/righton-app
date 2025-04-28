import React from 'react';
import { styled, Box, Typography } from '@mui/material';
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

interface OwnerCardProps {
    screenSize: ScreenSize;
}

export default function OwnerCard(
    {screenSize}: OwnerCardProps
) {
  return (
    screenSize === ScreenSize.LARGE ? (
        <LeftProfileContainer>
        <LeftProfileTopContainer>
            <LeftNameText>
                Ms. Clark
            </LeftNameText>
            <img src={profilePic} alt="Right On Logo" style={{ width: '165px', height: '165px' }} />
            <AtUserNameContainerAndAccount>
                <AtUserNameContainer >
                    <AtUserNameText>
                        @clarkinator27
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
        <LeftBottomContainer>
            <LeftBottomGamesQuestionContainer>
                <LeftBottomGamesContainer>
                    <LeftBottomGamesText>
                        Games Made
                    </LeftBottomGamesText>
                    <LeftBottomGamesNumber>
                        16
                    </LeftBottomGamesNumber>
                </LeftBottomGamesContainer>
                <LeftBottomGamesContainer>
                    <LeftBottomGamesText>
                        Question Made
                    </LeftBottomGamesText>
                    <LeftBottomGamesNumber>
                        120
                    </LeftBottomGamesNumber>
                </LeftBottomGamesContainer>
            </LeftBottomGamesQuestionContainer>
            <LeftBottomGamesContainer>
                    <LeftBottomGamesText>
                        Games Used
                    </LeftBottomGamesText>
                    <LeftBottomGamesNumber>
                        16
                    </LeftBottomGamesNumber>
            </LeftBottomGamesContainer>
        </LeftBottomContainer>
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
                                16
                            </LeftBottomGamesNumber>
                        </LeftBottomGamesContainer>
                        <LeftBottomGamesContainer>
                            <LeftBottomGamesText>
                                Questions Made
                            </LeftBottomGamesText>
                            <LeftBottomGamesNumber>
                                120
                            </LeftBottomGamesNumber>
                        </LeftBottomGamesContainer>
                        <LeftBottomGamesContainer>
                            <LeftBottomGamesText>
                                Games Used
                            </LeftBottomGamesText>
                            <LeftBottomGamesNumber>
                                16
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