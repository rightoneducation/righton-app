import React from "react";
import { Modal, Slide, Box } from "@mui/material";
import { GradeTarget, IGameTemplate, IQuestionTemplate, PublicPrivateType, SortType, SortDirection } from "@righton/networking";
import { TabContainer } from "../../lib/styledcomponents/QuestionTabsStyledComponents";
import { LibraryTabEnum, ScreenSize, GameQuestionType } from "../../lib/CentralModels";
import LibraryTabsQuestions from "./LibraryTabsQuestions";

interface LibraryTabsModalContainerProps {
  isPublic: boolean;
  isTabsOpen: boolean,
  handleCloseQuestionTabs: () => void,
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
  handleQuestionView: (
    element: IQuestionTemplate,
    elements: IQuestionTemplate[],
  ) => void;
}

export default function LibraryTabsModalContainer({
  isPublic,
  isTabsOpen,
  handleCloseQuestionTabs,
  screenSize,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  fetchElements,
  handleQuestionView,
}: LibraryTabsModalContainerProps) {
  
  return (
  <Modal
    disableAutoFocus
    open={isTabsOpen}
    onClose={handleCloseQuestionTabs}
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
          <LibraryTabsQuestions
            isPublic={isPublic}
            screenSize={screenSize}
            setIsTabsOpen={setIsTabsOpen}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            fetchElements={fetchElements}
            handleView={handleQuestionView}
            handleCloseQuestionTabs={handleCloseQuestionTabs}
          />
        </TabContainer>
      </Slide>
  </Modal>
);
}