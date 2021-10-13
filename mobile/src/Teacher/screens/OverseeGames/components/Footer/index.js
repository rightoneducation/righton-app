import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { scale } from "react-native-size-matters";
import { colors, fontFamilies, fonts } from "../../../../../utils/theme";
import * as Progress from "react-native-progress";

const Footer = ({
  navigation,
  noPicked,
  teams,
  nextPage,
  buttonLabel,
  questionNum,
  isBlue,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Groups that picked 3 trick answers</Text>
      <View style={styles.timerContainer}>
        <Progress.Bar
          style={styles.timerProgressBar}
          progress={(noPicked * 12.5) / 100}
          color={colors.white}
          unfilledColor={"rgba(255,255,255,0.2)"}
          width={Dimensions.get("window").width - scale(90)}
          height={scale(15)}
          borderRadius={0}
        />
        <Text style={styles.timerText}>{teams}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.nextActionContainer,
          isBlue && { backgroundColor: "#159EFA" },
        ]}
        onPress={() => {
          navigation.push(nextPage, { questionNum });
        }}
      >
        <Text style={[styles.actionText, isBlue && { color: "white" }]}>
          {buttonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    padding: scale(12),
  },
  label: {
    fontSize: fonts.xxMedium,
    fontFamily: fontFamilies.poppinsSemiBold,
    color: colors.white,
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: scale(10),
  },
  timerProgressBar: {
    marginRight: 9,
    marginTop: 5,
    borderWidth: 0,
  },
  timerText: {
    color: "white",
    opacity: 0.8,
    fontSize: fonts.medium,
    fontFamily: fontFamilies.latoBold,
    fontWeight: "bold",
  },
  nextActionContainer: {
    borderWidth: 5,
    borderRadius: 20,
    borderColor: "#159EFA",
    padding: scale(6),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: scale(10),
    marginVertical: scale(10),
  },
  actionText: {
    color: "#159EFA",
    fontSize: fonts.medium,
    fontFamily: fontFamilies.poppinsBold,
  },
});
