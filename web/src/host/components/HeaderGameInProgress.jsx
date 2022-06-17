import { makeStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";
import { Pagination } from '@material-ui/lab';
import Timer from "./Timer";

const questionNumber = 2

const useStyles = makeStyles(() => ({
    div: {
        paddingLeft: '10px',
        paddingTop: '10px',
        background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
    },
    title: {
        fontWeight: 700,
        fontSize: '36px',
        lineHeight: '54px',
        color: 'white',
    },
    phases: {
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '24px',
        color: 'white',
    },
    roundedItem: {
        background: 'red'
    },
    ul: {
        "& .MuiPaginationItem-page.Mui-selected": {
            backgroundColor: "white",
            color: 'rgba(56, 68, 102, 1)',
            border: 'white solid 3px',
            borderRadius: '3px',
        },
         "& .MuiPaginationItem-root": {
            color: "rgba(255,255,255, 0.5)",
            border: 'rgba(255,255,255, 0.5) solid 3px',
            borderRadius: '3px',
            paddingLeft: '15px',
            paddingRight: '15px',
            opacity:'1',
            cursor: "default",
            pointerEvents: "none"
        },
    }
}));

export default function Header() {
    const classes = useStyles();

    return(
        <div className={classes.div}>
            <Pagination
                hideNextButton
                hidePrevButton
                variant='outlined'
                shape='rounded'
                classes={{ ul: classes.ul }}
                count={5}
                page={questionNumber}
            />

            <Typography className={classes.title}>
                Question {questionNumber} of 5 {/* Replace with current question number and total questions info from query */}
            </Typography>

            <Typography className={classes.phases}>
                Phase 1 of 2 {/* Replace with phase info from query */}
            </Typography>

		    <Timer timer={60}/>
        </div>
	);
}