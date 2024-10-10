import React, { useState } from 'react';
import { Checkbox, Typography } from '@mui/material';
import { GradeTarget } from '@righton/networking';
import { ScreenSize } from '../../lib/CentralModels';
import { 
  SelectContainer,
  SelectGrade,
  SelectLabel,
  SelectArrowContainer,
  SelectMenu,
  SelectMenuItem,
  SelectButton,
  SelectButtonBox
} from '../../lib/styledcomponents/SelectGrade';
import SelectArrow from '../../images/SelectArrow.svg';

interface SelectGradesMenuProps {
  screenSize: ScreenSize;
  handleChooseGrades: (grades: GradeTarget[]) => void;
}

export default function SelectGradesMenu ({
  screenSize,
  handleChooseGrades,
}: SelectGradesMenuProps ){
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [selectedGrades, setSelectedGrades] = useState<GradeTarget[]>([]);
  const gradeMap = {
    '8th Grade': GradeTarget.GRADEEIGHT,
    '7th Grade': GradeTarget.GRADESEVEN,
    '6th Grade': GradeTarget.GRADESIX,
    '5th Grade': GradeTarget.GRADEFIVE,
    '4th Grade': GradeTarget.GRADEFOUR,
    '3rd Grade': GradeTarget.GRADETHREE,
    '2nd Grade': GradeTarget.GRADETWO,
    '1st Grade': GradeTarget.GRADEONE,
    'Kindergarten': GradeTarget.KINDERGARTEN,
  };
  const selectedGradeMap = {
    '8': GradeTarget.GRADEEIGHT,
    '7': GradeTarget.GRADESEVEN,
    '6': GradeTarget.GRADESIX,
    '5': GradeTarget.GRADEFIVE,
    '4': GradeTarget.GRADEFOUR,
    '3': GradeTarget.GRADETHREE,
    '2': GradeTarget.GRADETWO,
    '1': GradeTarget.GRADEONE,
    'Kindergarten': GradeTarget.KINDERGARTEN,
  }
  // updates copy of array that will be sent to parent component on click of choose button
  const handleGradesChange = (grade: string) => {
    if (!selectedGrades.includes(gradeMap[grade as keyof typeof gradeMap])) {
      setSelectedGrades((prev: GradeTarget[]) => [...prev, gradeMap[grade as keyof typeof gradeMap]]);
    } else {
      setSelectedGrades((prev: GradeTarget[]) => prev.filter((g) => g !== gradeMap[grade as keyof typeof gradeMap] as GradeTarget));
    }
  };
  const getSelectLabel = () => {
    if (selectedGrades.length === 0) {
      return 'Choose Grade';
    } 
    if (selectedGrades.length === 1) {
      if (selectedGrades[0] === GradeTarget.KINDERGARTEN) {
        return 'Kindergarten';
      }
      return `Grade ${Object.keys(selectedGradeMap).find((g) => selectedGradeMap[g as keyof typeof selectedGradeMap] === selectedGrades[0])}`;
    }
    if (selectedGrades.length >= 2) {
      const gradesForLabel = selectedGrades.slice(0,2);
      const labels = gradesForLabel.map((g) => Object.keys(selectedGradeMap).find((grade) => selectedGradeMap[grade as keyof typeof selectedGradeMap] === g));
      const parsedLabels = labels.map((label) => label === 'Kindergarten' ? 'Kdg.' : label);
      if (selectedGrades.length === 2)
        return `Grades ${parsedLabels.join(' & ')}`;
      return `Grades ${labels.join(', ')}...`;  
    }
    return `${selectedGrades.length} Grades Selected`;
  }
  return (
    <SelectContainer>
      <SelectGrade screenSize={screenSize ?? ScreenSize.SMALL} onClick={(prev) => setIsSelectOpen(!isSelectOpen)}>
        { screenSize !== ScreenSize.SMALL &&
          <SelectLabel>{getSelectLabel()}</SelectLabel>
        }
        <SelectArrowContainer isSelectOpen={isSelectOpen}>
          <img src={SelectArrow} alt="Select Arrow" />
        </SelectArrowContainer>
      </SelectGrade>
          <SelectMenu isSelectOpen={isSelectOpen}>
            {Object.keys(gradeMap).map((grade) => (
              <SelectMenuItem onClick={() => handleGradesChange(grade)}>
                <Checkbox checked={(selectedGrades).includes(gradeMap[grade as keyof typeof gradeMap])} color="default"/>
                  <Typography style={{fontFamily: 'Poppins', fontSize: '16px', fontWeight: 500}}>{grade}</Typography>
              </SelectMenuItem>
            ))}
            <SelectButtonBox>
              <SelectButton 
                onClick={() => {
                  setIsSelectOpen(false)
                  handleChooseGrades(selectedGrades)
                }}
              >
                Choose
              </SelectButton>
            </SelectButtonBox>
          </SelectMenu>
      </SelectContainer>
  );
}