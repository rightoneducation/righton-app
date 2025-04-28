import React from 'react';
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
} from '../../lib/styledcomponents/OwnerCardStyledComponents';
import RightOnLogo from '../../images/RightOnUserLogo.svg';
import { ScreenSize } from '../../lib/CentralModels';

interface OwnerCardProps {
    screenSize: ScreenSize;
}

export default function OwnerCard(
    {screenSize}: OwnerCardProps
) {
  return (
    <LeftProfileContainer screenSize={screenSize}>
      <LeftProfileTopContainer>
          <LeftNameText>
              Ms. Clark
          </LeftNameText>
          <img src={RightOnLogo} alt="Right On Logo" style={{ width: '165px', height: '165px' }} />
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
  );
}