import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  styled,
  Select,
  ClickAwayListener,
} from '@mui/material';
import {
  GradeTarget,
  SortType,
  SortDirection,
  EditType,
} from '@righton/networking';
import { ScreenSize } from '../../lib/CentralModels';
import {
  SortContainer,
  SortButton,
  SortLabel,
  SortArrowContainer,
  SortMenu,
  SortMenuItem,
} from '../../lib/styledcomponents/SortSearch';
import EditToolTip from '../tooltips/EditToolTip';
import SelectArrow from '../../images/SelectArrow.svg';
import clone from '../../images/buttonIconCloneBlue.svg';
import edit from '../../images/buttonIconEditBlue.svg';
import deleteIcon from '../../images/buttonIconDeleteBlue.svg';

const SelectedIcon = styled('img')(({ theme }) => ({
  filter:
    'invert(100%) sepia(8%) saturate(0%) hue-rotate(198deg) brightness(112%) contrast(101%)',
}));

interface EditMenuProps {
  screenSize: ScreenSize;
  isEditEnabled: boolean;
  handleCloneButtonClick: () => void;
  handleEditButtonClick: () => void;
  handleDeleteButtonClick: () => void;
}

export default function EditMenu({
  screenSize,
  isEditEnabled,
  handleCloneButtonClick,
  handleEditButtonClick,
  handleDeleteButtonClick,
}: EditMenuProps) {
  const theme = useTheme();
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [selectedEdit, setSelectedEdit] = useState<{
    field: EditType | null;
    direction: SortDirection;
  }>({ field: null, direction: SortDirection.ASC });
  const editTypeMap = {
    Clone: EditType.CLONE,
    Edit: EditType.EDIT,
    Delete: EditType.DELETE,
  };

  const editIconMap: { [editType in EditType]: string } = {
    [EditType.CLONE]: clone,
    [EditType.EDIT]: edit,
    [EditType.DELETE]: deleteIcon,
  };

  const editHandlerMap: { [editType in EditType]: () => void } = {
    [EditType.CLONE]: handleCloneButtonClick,
    [EditType.EDIT]: handleEditButtonClick,
    [EditType.DELETE]: handleDeleteButtonClick,
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (isEditOpen) {
          setIsEditOpen(false);
        }
      }}
    >
      <SortContainer>
        <SortButton
          screenSize={screenSize ?? ScreenSize.SMALL}
          onClick={(prev) => setIsEditOpen(!isEditOpen)}
        >
          {screenSize !== ScreenSize.SMALL && <SortLabel>Modify</SortLabel>}
          <SortArrowContainer isSortOpen={isEditOpen}>
            <img src={SelectArrow} alt="Select Arrow" />
          </SortArrowContainer>
        </SortButton>
        {/* Submenu */}
        {isEditOpen && (
          <SortMenu isSortOpen={isEditOpen} style={{ gap: '8px' }}>
            {(Object.keys(editTypeMap) as Array<keyof typeof editTypeMap>).map(
              (editLabel, i) => {
                const editValue = editTypeMap[editLabel]; // this is the EditType enum value
                return i === 0 ? (
                  <SortMenuItem
                    key={editLabel}
                    isSelected={selectedEdit.field === editValue}
                    onClick={handleCloneButtonClick}
                  >
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <Typography
                        fontSize="16px"
                        color={
                          selectedEdit.field === editValue
                            ? 'white'
                            : `${theme.palette.primary.sortText}`
                        }
                        style={{ fontWeight: 600 }}
                      >
                        {editLabel}
                      </Typography>
                      <img src={editIconMap[editValue]} alt="Clone Icon" />
                    </Box>
                  </SortMenuItem>
                ) : (
                  <SortMenuItem
                    key={editLabel}
                    isSelected={selectedEdit.field === editValue}
                  >
                    <EditToolTip isEditEnabled={isEditEnabled} isOnQuestionTab>
                      <Box component="span" display="inline-flex">
                        <Button
                          disabled={!isEditEnabled}
                          onClick={editHandlerMap[editValue]}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            textTransform: 'none',
                            padding: 0,
                          }}
                        >
                          <Typography
                            fontSize="16px"
                            color={
                              selectedEdit.field === editValue
                                ? 'white'
                                : `${theme.palette.primary.sortText}`
                            }
                            style={{ fontWeight: isEditEnabled ? 600 : 400 }}
                          >
                            {editLabel}
                          </Typography>
                          <img
                            src={editIconMap[editValue]}
                            alt={`${editLabel} Icon`}
                          />
                        </Button>
                      </Box>
                    </EditToolTip>
                  </SortMenuItem>
                );
              },
            )}
          </SortMenu>
        )}
      </SortContainer>
    </ClickAwayListener>
  );
}
