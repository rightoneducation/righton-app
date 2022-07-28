import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  ccss: {
    marginTop: theme.spacing(2),
  },
  label: {
    fontWeight: 400,
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 110,
    maxWidth: 150,
  },
}));

export default function CCSSField({ grade, domain, cluster, standard, updateGame }) {
  const classes = useStyles();
  const onChangeMaker = (fieldName) => (event) => {
    updateGame(fieldName, event.target.value);
  };
  return (
    <Box className={classes.ccss}>
      <Typography className={classes.label} gutterBottom>
        Enter CCSS:
      </Typography>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="grade-label">Grade</InputLabel>
        <Select
          labelId="grade-label"
          id="grade"
          value={grade}
          onChange={onChangeMaker('grade')}
          label="Grade"
        >
          {GRADES.map(({ label, value }) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="domain-label">Domain</InputLabel>
        <Select
          labelId="domain-label"
          id="domain"
          value={domain}
          onChange={onChangeMaker('domain')}
          label="Domain"
        >
          {DOMAINS.map(({ label, value }) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="cluster-label">Cluster</InputLabel>
        <Select
          labelId="cluster-label"
          id="cluster"
          value={cluster}
          onChange={onChangeMaker('cluster')}
          label="Cluster"
        >
          {CLUSTERS.map(({ label, value }) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="standard-label">Standard</InputLabel>
        <Select
          labelId="standard-label"
          id="standard"
          value={standard}
          onChange={onChangeMaker('standard')}
          label="Standard"
        >
          {STANDARDS.map(({ label, value }) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

const GRADES = [
  {
    label: "6",
    value: 6
  },
  {
    label: "7",
    value: 7
  },
  {
    label: "8",
    value: 8
  },
  {
    label: "General",
    value: 'General'
  },
];

const DOMAINS = [
  {
    label: "RP: Ratios & Proportional Relationships",
    value: "RP",
  },
  {
    label: "NS: Number System",
    value: "NS",
  },
  {
    label: "EE: Expressions & Equations",
    value: "EE",
  },
  {
    label: "G: Geometry",
    value: "G",
  },
  {
    label: "SP: Statistics & Probability",
    value: "SP",
  },
  {
    label: "F: Functions",
    value: "F",
  },
];

const CLUSTERS = [
  {
    label: "A",
    value: "A",
  },
  {
    label: "B",
    value: "B",
  },
  {
    label: "C",
    value: "C",
  },
];

const STANDARDS = [
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  {
    label: "4",
    value: 4,
  },
  {
    label: "5",
    value: 5,
  },
  {
    label: "6",
    value: 6,
  },
  {
    label: "7",
    value: 7,
  },
  {
    label: "8",
    value: 8,
  },
  {
    label: "9",
    value: 9,
  },
];
