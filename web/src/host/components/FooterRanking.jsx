import React from "react";
import { makeStyles } from "@material-ui/core";

export default function FooterRanking() {
    const classes = useStyles();

    return (
        <div>
            <hr
                className={classes.divider}
            />
            <button
                className={classes.button}
            >
                Exit to RightOn Central
            </button>
        </div>
    );
}

const useStyles = makeStyles(() => ({
    divider: {
        border: "none",
        width:"95%",
        height:"1px", 
        background: "rgba(255, 255, 255, 0.25)"
    },
    button: {
        border: "4px solid #159EFA",
        background: "linear-gradient(#159EFA 100%,#19BCFB 100%)",
        borderRadius: "34px",
        width: "90%",
        height: "48px",
        color: "white",
        fontFamily: "Poppins",
        fontWeight: "bold",
        fontSize: "20px",
        //fontWeight: "700",
        lineHeight: "30px",
        boxShadow: "0px 5px 22px 0px #47D9FF4D",
        marginLeft: "5%",
        marginRight: "5%"
    }

}));