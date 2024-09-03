import react, {useState, useEffect} from 'react';
import {FormControl, InputLabel, MenuItem} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {IQuestionToSave} from '../lib/Models';
import {returnQuestions} from '../lib/API';
import { version, prevVersions } from '../lib/Constants';
import QualityChart from '../components/QualityChart';
import { set } from 'lodash';

interface VersionedQuestions {
  [key: string]: IQuestionToSave[];
};

export default function Eval(){
  const [summaryData, setSummaryData] = useState<{version: string, numberOfQuestions: number, numberOfDismissedExplanations: number, quality: number}[]>([]);
  const [selectedVersionData, setSelectedVersionData] = useState<{version: string, numberOfQuestions: number, numberOfDismissedExplanations: number, quality: number} | null>(null);
  const [queryVersion, setQueryVersion] = useState<string>('');
  const [questionsByVersion, setQuestionsByVersion] = useState<VersionedQuestions>({});
  const versions: string[] = [...prevVersions, version];
  const handleChange = async (event: SelectChangeEvent) => {
    const selectedVersion = event.target.value;
    const versionData = summaryData.find((data) => data.version === selectedVersion);
    // const questions: any[] = questionsByVersion[selectedVersion];
    // const wrongAnswers = questions.map((question) => {
    //   return JSON.parse(question.wrongAnswers);
    // });
    // const dismissedExplanations = wrongAnswers.map((answer) => { if (answer.dismissedExplanations.prompt) return answer.dismissedExplanations.prompt });
    // console.log(dismissedExplanations);
    setSelectedVersionData(versionData ?? null);
    setQueryVersion(selectedVersion);
  }
  useEffect (() => {
    returnQuestions().then((returnedQuestions) => {      
      const groupedQuestionsByVersion = 
        returnedQuestions.reduce((acc: any, curr: any) => {
          if (!acc[curr.version]) {
            acc[curr.version] = [];
          }
          acc[curr.version].push(curr);
          return acc;
        }, []);
      setQuestionsByVersion(groupedQuestionsByVersion);
      const groupedQuestionsByVersionArray = Object.keys(groupedQuestionsByVersion).map((key) => {
        const totalQuestionsByVersion = groupedQuestionsByVersion[key].length;
        const totalDismissedExplanations = groupedQuestionsByVersion[key].reduce((acc: number, curr: any) => {
          const wrongAnswers = JSON.parse(curr.wrongAnswers);
          if (Array.isArray(wrongAnswers)) {
            return wrongAnswers.reduce((acc: number, curr: any) => {
              return acc + curr.dismissedExplanations.length;
            }, 0);
          } else {
            return 0;
          }
        }, 0);

        const quality = groupedQuestionsByVersion[key].reduce((acc: number, curr: any) => {
          const wrongAnswers = JSON.parse(curr.wrongAnswers);
          if (Array.isArray(wrongAnswers)) {
            const qualityArray = wrongAnswers.map((answer: any) => {
              return 1/(1+answer.dismissedExplanations.length);
            });
            return qualityArray.reduce((acc: number, curr: number) => acc + curr, 0)/qualityArray.length;
          } else {
            return 0;
          }
        }, 0);
        return {version: key, numberOfQuestions: totalQuestionsByVersion, numberOfDismissedExplanations: totalDismissedExplanations, quality: quality};
      });
    console.log(groupedQuestionsByVersionArray);
    groupedQuestionsByVersionArray.sort((a, b) => {
      return a.version.localeCompare(b.version);
    });
    setSummaryData(groupedQuestionsByVersionArray);
    });
  },[]);

  return (
    <div style={{padding: '20px'}}>
      <h1>Evaluation</h1>
      <QualityChart data={summaryData}/>
      <p>Quality: {selectedVersionData?.quality ? Math.round(selectedVersionData?.quality * 100)/100 : null}</p> 
      <p style={{fontStyle: 'italic'}}> Quality here is the average of 1 / (1+number of dismissed explanations) in a given version</p>      
      <FormControl>
        <InputLabel id="dropdown-label">Version</InputLabel>
        <Select
          labelId="dropdown-label"
          value={queryVersion}
          label="Version"
          onChange={handleChange}
          style={{width: '200px'}}
        >
          {versions.map((version) => {
            return  <MenuItem key={version} value={version}>{version}</MenuItem>
          })}
        </Select>
        </FormControl>
        <>
          <p>Number of Questions: {selectedVersionData?.numberOfQuestions}</p>
          <p>Number of Rejected Explanations: {selectedVersionData?.numberOfDismissedExplanations}</p>
        </>

    </div>
  )
}