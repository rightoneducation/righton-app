import React from "react";
import { Modal, Slide, Box } from "@mui/material";
import { GradeTarget, IGameTemplate, IQuestionTemplate, PublicPrivateType, SortType, SortDirection } from "@righton/networking";
import { TabContainer } from "../../lib/styledcomponents/QuestionTabsStyledComponents";
import { LibraryTabEnum, ScreenSize, GameQuestionType } from "../../lib/CentralModels";
import LibraryTabsGames from "./LibraryTabsGames";

interface LibraryTabsModalContainerProps {
  publicPrivateType: PublicPrivateType;
  isTabsOpen: boolean,
  handleCloseGamesTabs: () => void,
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  fetchElements: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
  ) => void;
  handleGameView: (
    element: IGameTemplate,
  ) => void;
}

export default function LibraryTabsModalContainerGames({
  publicPrivateType,
  isTabsOpen,
  handleCloseGamesTabs,
  screenSize,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  fetchElements,
  handleGameView,
}: LibraryTabsModalContainerProps) {
  return (
  <Modal
    disableAutoFocus
    open={isTabsOpen}
    onClose={handleCloseGamesTabs}
    closeAfterTransition
    disableScrollLock
  >
    <Slide
      direction="up"
      in={isTabsOpen}
      timeout={1000}
      mountOnEnter
      unmountOnExit
    >
        <TabContainer
          style={{
            width: '100%',
            paddingTop: '113px',
            paddingLeft: screenSize === ScreenSize.SMALL ? '0px' : '146px',
            paddingRight: screenSize === ScreenSize.SMALL ? '0px' : '146px',
            boxSizing: 'border-box',
          }}
        >
          <LibraryTabsGames
            publicPrivateType={publicPrivateType}
            screenSize={screenSize}
            setIsTabsOpen={setIsTabsOpen}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            fetchElements={fetchElements}
            handleView={handleGameView}
            handleCloseGamesTabs={handleCloseGamesTabs}
          />
        </TabContainer>
      </Slide>
  </Modal>
);
}