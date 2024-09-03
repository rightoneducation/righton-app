import React, {useCallback} from 'react';
import { Box, Typography, CircularProgress, Slider } from '@mui/material';
import { APIClients, Environment, AppType, IGameTemplate, FilterTarget } from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash/debounce';
import { set } from 'lodash';

enum SortType {
  listGameTemplates,
  listGameTemplatesByDate,
  listGameTemplatesByGrade,
  listGameTemplatesByQuestionCount
}

enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export default function Search(){
  const [searchTerms, setSearchTerms] = React.useState<string | null>(null);
  const [searchResults, setSearchResults] = React.useState<IGameTemplate[]>([]);
  const [sortType, setSortType] = React.useState<SortType>(SortType.listGameTemplates);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(SortDirection.ASC);
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [filterTargets, setFilterTargets] = React.useState<FilterTarget[]>([]);
  const [debounceInterval, setDebounceInterval] = React.useState<number>(1000);
  const [count, setCount] = React.useState<number>(0);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(prev => event.target.value);
    debouncedSearch(event.target.value, sortDirection, filterTargets);
  };
  const handleCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as FilterTarget;;
    if (event.target.checked){
      setFilterTargets(prev => [...prev, value]);
    } else {
      setFilterTargets(prev => prev.filter((target) => target !== value));
    }
  };
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switch(event.target.value){
      case 'Newest':
        setSortType(SortType.listGameTemplatesByDate);
        setSortDirection(SortDirection.DESC);
        break;
      case 'Oldest':
        setSortType(SortType.listGameTemplatesByDate);
        setSortDirection(SortDirection.ASC);
        break;
      case 'Grade Level, Ascending':
        setSortType(SortType.listGameTemplatesByGrade);
        setSortDirection(SortDirection.ASC);
        break;
      case 'Grade Level, Descending':
        setSortType(SortType.listGameTemplatesByGrade);
        setSortDirection(SortDirection.DESC);
        break;
      case 'Question Count, Ascending':
        setSortType(SortType.listGameTemplatesByQuestionCount);
        setSortDirection(SortDirection.ASC);
        break;
      case 'Question Count, Descending':
        setSortType(SortType.listGameTemplatesByQuestionCount);
        setSortDirection(SortDirection.DESC);
        break;
      default:
        setSortType(SortType.listGameTemplates);
        setSortDirection(SortDirection.ASC);
        break;
    }
  }
  const handleSearch = (search: string, sortDirection: SortDirection, filterTargets: FilterTarget[]) => {
    setCount(prev => prev + 1);
    setIsSearching(true);
    switch(sortType){
      case SortType.listGameTemplatesByDate:
        apiClients.gameTemplate.listGameTemplatesByDate(null, null, sortDirection, search, filterTargets).then((response) => {
          setIsSearching(false);
          if (response){
            console.log('Search Terms:');
            console.log(search);
            console.log('Response:');
            console.log(response);
            setSearchResults(response.gameTemplates);
          }
        });
        break;
      case SortType.listGameTemplatesByGrade:
        apiClients.gameTemplate.listGameTemplatesByGrade(null, null, sortDirection, search, filterTargets).then((response) => {
          setIsSearching(false);
          if (response){
            console.log('Search Terms:');
            console.log(search);
            console.log('Response:');
            console.log(response);
            setSearchResults(response.gameTemplates);
          }
        });
        break;
      case SortType.listGameTemplatesByQuestionCount:
        apiClients.gameTemplate.listGameTemplatesByQuestionTemplatesCount(null, null, sortDirection, search, filterTargets).then((response) => {
          setIsSearching(false);
          if (response){
            console.log('Search Terms:');
            console.log(search);
            console.log('Response:');
            console.log(response);
            setSearchResults(response.gameTemplates);
          }
        });
        break;
      case SortType.listGameTemplates:
      default:
        apiClients.gameTemplate.listGameTemplates(null, null, null, search, filterTargets).then((response) => {
          setIsSearching(false);
          if (response){
            console.log('Search Terms:');
            console.log(search);
            console.log('Response:');
            console.log(response);
            setSearchResults(response.gameTemplates);
          }
        });
        break;
    }
  };

  const debouncedSearch = useCallback(
    debounce((search: string, sortDirection: SortDirection, filterTargets: FilterTarget[]) => {
      handleSearch(search, sortDirection, filterTargets);
    }, debounceInterval),
    [debounceInterval] 
  );

  const apiClients = new APIClients(Environment.Developing, AppType.HOST);
  return (
    <Box style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
      <Typography style={{ fontFamily: 'Poppins',  fontWeight: '600', textAlign: 'left', fontSize: '15px', lineHeight: '30px'}}>
      Search Prototype
      </Typography>
      <Box style={{display: 'flex', gap: '20px', paddingLeft: '20px'}}>
        <Box style={{display: 'flex', flexDirection: 'column'}}>
          <Typography style={{ fontFamily: 'Poppins',  fontWeight: '600', textAlign: 'left', fontSize: '15px', lineHeight: '30px'}}>
            Search (Filter)
          </Typography>
          <Box style={{display: 'flex', gap: '20px'}}>
            <input 
              type='search'
              placeholder={`Enter search terms here...`}
              onChange={handleInputChange}
              value={searchTerms || ''}
              style={{width: '400px'}}
            />
          </Box>
          <Box style={{display: 'flex', gap: '10px', paddingTop: '10px'}}>
            <input type="checkbox" value={FilterTarget.TITLE} name="title" onChange={handleCheckBox}/> 
            <label htmlFor="title"> Title </label>
            <input type="checkbox" value={FilterTarget.DESCRIPTION} name="description" onChange={handleCheckBox}/> 
            <label htmlFor="description"> Description </label>
            <input type="checkbox" value={FilterTarget.CCSS} name="ccss" onChange={handleCheckBox}/>
            <label htmlFor="ccss"> CCSS </label>
          </Box>
          <Box style={{display: 'flex', flexDirection: 'column', paddingTop: '10px'}}>
            <Typography style={{ fontFamily: 'Poppins',  fontWeight: '600', textAlign: 'left', fontSize: '12px', lineHeight: '20px', maxWidth: '50%'}}>
              Debounce Interval (ms)
            </Typography>
              <Slider
                aria-label="Debounce Interval"
                value={debounceInterval}
                valueLabelDisplay="auto"
                step={100}
                onChange={(event, value) => setDebounceInterval(value as number)}
                min={100}
                max={3000}
              />
            <Typography style={{ fontFamily: 'Poppins',  fontWeight: '400', textAlign: 'left', fontSize: '12px', lineHeight: '20px', maxWidth: '50%'}}>
              # of API Requests: {count}
            </Typography>
          </Box>
        </Box>
        <Box style={{display: 'flex', flexDirection: 'column'}}>
          <Typography style={{ fontFamily: 'Poppins',  fontWeight: '600', textAlign: 'left', fontSize: '15px', lineHeight: '30px'}}>
            Sort
          </Typography>
          <Box style={{display: 'flex', gap: '10px'}}>
          <select name="Sort" onChange={handleSortChange}>
            <option value=""> </option>
            <option value="Newest"> Newest </option>
            <option value="Oldest"> Oldest </option>
            <option value="Grade Level, Ascending"> Grade Level, Ascending </option>
            <option value="Grade Level, Descending"> Grade Level, Descending </option>
            <option value="Question Count, Ascending"> Question Count, Ascending </option>
            <option value="Question Count, Descending"> Question Count, Descending </option>
          </select>
          </Box>
        </Box>
      </Box>
      <Typography style={{ fontFamily: 'Poppins',  fontWeight: '600', textAlign: 'left', fontSize: '15px', lineHeight: '30px', paddingTop: '20px'}}>
       Results
      </Typography>
        { isSearching && 
          <CircularProgress style={{color:'#000', padding: '20px'}}/>
        }
          {!isSearching && searchResults.length > 0
            ? <ul style={{paddingLeft: '20px'}}>
            {searchResults.map((result, index) => (
              <Box key={uuidv4()}>
                <li>
                  <Typography style={{ fontFamily: 'Poppins',  fontWeight: '600', textAlign: 'left', fontSize: '12px', lineHeight: '20px', maxWidth: '50%'}}>
                    {result.title}
                  </Typography>
                  <Typography style={{ fontFamily: 'Poppins',  fontWeight: '400', textAlign: 'left', fontSize: '12px', lineHeight: '20px', maxWidth: '50%'}}>
                    Description: {result.description}
                  </Typography>
                  <Typography style={{ fontFamily: 'Poppins',  fontWeight: '400', textAlign: 'left', fontSize: '12px', lineHeight: '20px', maxWidth: '50%'}}>
                    CCSS: {result.ccss}
                  </Typography>
                  <Typography style={{ fontFamily: 'Poppins',  fontWeight: '400', textAlign: 'left', fontSize: '12px', lineHeight: '20px', maxWidth: '50%'}}>
                    Number of Questions: {result.questionTemplatesCount}
                  </Typography>
                  <Typography style={{ fontFamily: 'Poppins',  fontWeight: '400', textAlign: 'left', fontSize: '12px', lineHeight: '20px', maxWidth: '50%'}}>
                    Date: {result.updatedAt?.toString()}
                  </Typography>
                </li>
              </Box>
            ))}
          </ul>
        : 
        !isSearching && 
        <Typography style={{ fontFamily: 'Poppins',  fontWeight: '400', textAlign: 'left', fontSize: '12px', lineHeight: '20px', paddingLeft: '20px'}}>
          Results will appear here
          </Typography>
      }
    </Box>
  );
}