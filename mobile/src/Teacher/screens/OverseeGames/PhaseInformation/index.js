import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import { colors, fontFamilies, fonts } from "../../../../utils/theme";
import * as Progress from "react-native-progress";
import TeamCards from "./components/TeamCards";
import Footer from "../components/Footer";
import RootComponent from '../components/RootComponent';

const PhaseInformation = ({ navigation }) => {
  const [countdown, setCountdown] = useState(300);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (countdown == 0) {
      return;
    }
    var refreshIntervalId = setInterval(() => {
      setCountdown(countdown - 1);
      setProgress(countdown / 300);
    }, 1000);
    return () => {
      clearInterval(refreshIntervalId);
    };
  });

  const [teamInfo, setTeamInfo] = useState([
    { answers: 0, picked: 0 },
    { answers: 1, picked: 1 },
    { answers: 5, picked: 0 },
    { answers: 4, picked: 3 },
    { answers: 1, picked: 1 },
    { answers: 5, picked: 0 },
    { answers: 4, picked: 3 },
    { answers: 0, picked: 3 },
  ]);

  return (
      <RootComponent heading="Phase 1" subheading="Submission Phase">
				<View style={styles.timerContainer}>
					<Progress.Bar
						style={styles.timerProgressBar}
						progress={progress}
						color={colors.white}
						unfilledColor={"rgba(255,255,255,0.2)"}
						width={Dimensions.get("window").width - scale(90)}
					/>
					<Text style={styles.timerText}>
						{Math.floor(countdown / 60)}:
						{("0" + Math.floor(countdown % 60)).slice(-2)}
					</Text>
				</View>
				<TeamCards style={styles.cardsContainer} teamInfo={teamInfo} />
				<Footer
          style={styles.footer}
          noPicked={2}
          teams={teamInfo.length}
          navigation={navigation}
          questionNum={1}
          nextPage={"Questions"}
          buttonLabel={"Skip to next phase"}
          textColor={colors.lightblue}
				/>
      </RootComponent>
  );
};

export default PhaseInformation;

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: scale(20),
  },
  timerProgressBar: {
    marginRight: 9,
    marginTop: 5,
    borderWidth: 0,
  },
  timerText: {
    color: "white",
    opacity: 0.8,
    fontSize: fonts.xSmall,
    fontFamily: fontFamilies.latoBold,
    fontWeight: "bold",
  },
  cardsContainer: {
    flex: 1,
  },
  footer: {
    marginTop: scale(10),
  },
});
