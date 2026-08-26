import React, { useState } from 'react';
import {
  Checkbox,
  Typography,
  Collapse,
  useTheme,
  ClickAwayListener,
} from '@mui/material';
import { GradeTarget } from '@righton/networking';
import { ScreenSize } from '../../lib/CentralModels';
import {
  GRADE_FILTER_OPTIONS,
  GRADE_SORT_ORDER,
  shortGradeLabel,
} from '../../lib/gradeOptions';
import {
  SelectContainer,
  SelectGrade,
  SelectLabel,
  SelectArrowContainer,
  SelectMenu,
  SelectMenuItem,
  SelectButtonBox,
} from '../../lib/styledcomponents/SelectGrade';
import SelectArrow from '../../images/SelectArrow.svg';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';

/**
 * TEMPORARY -- front-page launcher only. See
 * ~/.claude/plans/alright-next-bit-of-inherited-bachman.md
 *
 * A copy of searchbar/SelectGradesMenu that keeps its selection in LOCAL state
 * instead of dispatching SET_SELECTED_GRADES. The front page hands its grades to
 * Browse through the URL, and writing to central here would collide with the
 * seed Browse performs on mount. Delete this folder to remove the feature.
 */

interface LauncherGradesMenuProps {
  screenSize: ScreenSize;
  selectedGrades: GradeTarget[];
  onGradesChange: (grades: GradeTarget[]) => void;
  onCommit: (grades: GradeTarget[]) => void;
}

export default function LauncherGradesMenu({
  screenSize,
  selectedGrades,
  onGradesChange,
  onCommit,
}: LauncherGradesMenuProps) {
  const theme = useTheme();
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const handleGradesChange = (grade: GradeTarget) => {
    if (!selectedGrades.includes(grade)) {
      onGradesChange([...selectedGrades, grade]);
    } else {
      onGradesChange(selectedGrades.filter((g) => g !== grade));
    }
  };

  const getSelectLabel = () => {
    if (selectedGrades.length === 0) {
      return 'Choose Grade';
    }
    if (selectedGrades.length === 1) {
      return `Grade ${shortGradeLabel(selectedGrades[0])}`;
    }
    if (selectedGrades.length >= 2) {
      // canonical ascending order, not localeCompare -- said once here so it
      // stays right if the supported set changes
      const labels = [...selectedGrades]
        .sort(
          (a, b) => GRADE_SORT_ORDER.indexOf(a) - GRADE_SORT_ORDER.indexOf(b),
        )
        .map(shortGradeLabel)
        .slice(0, 2);
      if (selectedGrades.length === 2) return `Grades ${labels.join(' & ')}`;
      return `Grades ${labels.join(', ')}...`;
    }
    return `${selectedGrades.length} Grades Selected`;
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (isSelectOpen) {
          setIsSelectOpen(false);
          onCommit(selectedGrades);
        }
      }}
    >
      <SelectContainer>
        <SelectGrade
          screenSize={screenSize ?? ScreenSize.SMALL}
          onClick={() => setIsSelectOpen(!isSelectOpen)}
        >
          {screenSize !== ScreenSize.SMALL && (
            <SelectLabel>{getSelectLabel()}</SelectLabel>
          )}
          <SelectArrowContainer isSelectOpen={isSelectOpen}>
            <img src={SelectArrow} alt="Select Arrow" />
          </SelectArrowContainer>
        </SelectGrade>
        <Collapse in={isSelectOpen} timeout={1000}>
          <SelectMenu isSelectOpen={isSelectOpen} screenSize={screenSize}>
            {GRADE_FILTER_OPTIONS.map((option) => (
              <SelectMenuItem
                onClick={() => handleGradesChange(option.value)}
                key={option.value}
              >
                <Checkbox
                  checked={selectedGrades.includes(option.value)}
                  color="default"
                  style={{ padding: 0 }}
                />
                <Typography
                  style={{
                    fontFamily: 'Poppins',
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 500,
                    color: `${theme.palette.primary.extraDarkBlue}`,
                  }}
                >
                  {option.long}
                </Typography>
              </SelectMenuItem>
            ))}
            <SelectButtonBox>
              <CentralButton
                buttonType={ButtonType.CHOOSE}
                isEnabled
                onClick={() => {
                  setIsSelectOpen(false);
                  onCommit(selectedGrades);
                }}
              />
            </SelectButtonBox>
          </SelectMenu>
        </Collapse>
      </SelectContainer>
    </ClickAwayListener>
  );
}
