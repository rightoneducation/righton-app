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
  SelectContainer,
  SelectGrade,
  SelectLabel,
  SelectArrowContainer,
  SelectMenu,
  SelectMenuItem,
  SelectButtonBox,
} from '../../lib/styledcomponents/SelectGrade';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../../hooks/context/useCentralDataContext';
import SelectArrow from '../../images/SelectArrow.svg';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';

interface SelectGradesMenuProps {
  screenSize: ScreenSize;
  handleChooseGrades: (grades: GradeTarget[]) => void;
}

export default function SelectGradesMenu({
  screenSize,
  handleChooseGrades,
}: SelectGradesMenuProps) {
  const theme = useTheme();
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const { selectedGrades } = centralData;
  const gradeMap = {
    'High School': GradeTarget.HIGHSCHOOL,
    '8th Grade': GradeTarget.GRADEEIGHT,
    '7th Grade': GradeTarget.GRADESEVEN,
    '6th Grade': GradeTarget.GRADESIX,
    '5th Grade': GradeTarget.GRADEFIVE,
    '4th Grade': GradeTarget.GRADEFOUR,
    '3rd Grade': GradeTarget.GRADETHREE,
    '2nd Grade': GradeTarget.GRADETWO,
    '1st Grade': GradeTarget.GRADEONE,
    Kindergarten: GradeTarget.KINDERGARTEN,
  };
  const selectedGradeMap = {
    HS: GradeTarget.HIGHSCHOOL,
    '8': GradeTarget.GRADEEIGHT,
    '7': GradeTarget.GRADESEVEN,
    '6': GradeTarget.GRADESIX,
    '5': GradeTarget.GRADEFIVE,
    '4': GradeTarget.GRADEFOUR,
    '3': GradeTarget.GRADETHREE,
    '2': GradeTarget.GRADETWO,
    '1': GradeTarget.GRADEONE,
    K: GradeTarget.KINDERGARTEN,
  };
  // updates copy of array that will be sent to parent component on click of choose button
  const handleGradesChange = (grade: string) => {
    const selectedGradesCopy = [...selectedGrades];
    if (
      !selectedGradesCopy.includes(gradeMap[grade as keyof typeof gradeMap])
    ) {
      selectedGradesCopy.push(gradeMap[grade as keyof typeof gradeMap]);
      centralDataDispatch({
        type: 'SET_SELECTED_GRADES',
        payload: selectedGradesCopy,
      });
    } else {
      centralDataDispatch({
        type: 'SET_SELECTED_GRADES',
        payload: selectedGradesCopy.filter(
          (g) =>
            g !== (gradeMap[grade as keyof typeof gradeMap] as GradeTarget),
        ),
      });
    }
  };
  const getSelectLabel = () => {
    if (selectedGrades.length === 0) {
      return 'Choose Grade';
    }
    if (selectedGrades.length === 1) {
      if (selectedGrades[0] === GradeTarget.HIGHSCHOOL) {
        return 'Grade HS';
      }
      if (selectedGrades[0] === GradeTarget.KINDERGARTEN) {
        return 'Grade K';
      }
      return `Grade ${Object.keys(selectedGradeMap).find((g) => selectedGradeMap[g as keyof typeof selectedGradeMap] === selectedGrades[0])}`;
    }
    if (selectedGrades.length >= 2) {
      const labels = selectedGrades.map((g) =>
        Object.keys(selectedGradeMap).find(
          (grade) =>
            selectedGradeMap[grade as keyof typeof selectedGradeMap] === g,
        ),
      );
      const sortedLabels = labels
        .sort((a: string | undefined, b: string | undefined) => {
          // move K to the front
          if (a === 'K') return -1;
          if (b === 'K') return 1;
          // then do regular compare
          if (a && b) return a.localeCompare(b);
          return 0;
        })
        .slice(0, 2);
      if (selectedGrades.length === 2)
        return `Grades ${sortedLabels.join(' & ')}`;
      return `Grades ${sortedLabels.join(', ')}...`;
    }
    return `${selectedGrades.length} Grades Selected`;
  };
  return (
    <ClickAwayListener
      onClickAway={() => {
        if (isSelectOpen) {
          setIsSelectOpen(false);
          handleChooseGrades(selectedGrades);
        }
      }}
    >
      <SelectContainer>
        <SelectGrade
          screenSize={screenSize ?? ScreenSize.SMALL}
          onClick={(prev) => setIsSelectOpen(!isSelectOpen)}
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
            {Object.keys(gradeMap).map((grade) => (
              <SelectMenuItem
                onClick={() => handleGradesChange(grade)}
                key={grade}
              >
                <Checkbox
                  checked={selectedGrades.includes(
                    gradeMap[grade as keyof typeof gradeMap],
                  )}
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
                  {grade}
                </Typography>
              </SelectMenuItem>
            ))}
            <SelectButtonBox>
              <CentralButton
                buttonType={ButtonType.CHOOSE}
                isEnabled
                onClick={() => {
                  setIsSelectOpen(false);
                  handleChooseGrades(selectedGrades);
                }}
              />
            </SelectButtonBox>
          </SelectMenu>
        </Collapse>
      </SelectContainer>
    </ClickAwayListener>
  );
}
