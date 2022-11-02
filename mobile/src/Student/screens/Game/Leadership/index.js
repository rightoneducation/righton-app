import React from "react"
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    FlatList,
    ScrollView,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { scale, verticalScale } from "react-native-size-matters"
import { fontFamilies, fonts } from "../../../../utils/theme"
import TeamItem from "./Components/TeamItem"
import TeamFooter from "../../../../components/TeamFooter"

const DEFAULT_AVATAR = require("../../SelectTeam/img/MonsterIcon1.png")

const Leadership = ({
    gameSession,
    team,
    teamMember,
    monsterNumber,
    smallAvatar = DEFAULT_AVATAR,
}) => {
    const teams = gameSession.teams

    const highToLow = teams.sort((a, b) => b.score - a.score)

    const teamNumber = highToLow.map((team, index) => {
        team.teamNo = index + 1
        return team
    })
    const teamNames = teamNumber.map((team) => {
        return team.name
    })

    const teamName = team?.name ? team?.name : "Team Name"
    const totalScore = team?.score ? team?.score : 0

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView
                contentContainerStyle={{ marginBottom: verticalScale(22) }}
            >
                <LinearGradient
                    colors={["rgba(62, 0, 172, 1)", "rgba(98, 0, 204, 1)"]}
                    style={styles.headerContainer}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.headerText}>Leaderboard</Text>
                </LinearGradient>
            </ScrollView>
            <>
                <FlatList
                    data={teamNumber}
                    keyExtractor={(item) => `${item.teamNo}`}
                    style={styles.teamContainer}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => {
                        return <View style={{ height: 10 }} />
                    }}
                    renderItem={({ item }) => (
                        <TeamItem
                            teamNames={teamNames}
                            teamNo={item.teamNo}
                            score={item.score}
                            showPoints={item.showPoints}
                        />
                    )}
                />
            </>
            <View style={styles.footerView}>
                <TeamFooter
                    icon={smallAvatar}
                    name={teamName}
                    totalScore={totalScore ? totalScore : 0}
                />
            </View>
        </SafeAreaView>
    )
}

export default Leadership

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "rgba(247,249,250,1)",
    },
    headerContainer: {
        shadowColor: "rgba(0, 141, 239, 0.3)",
        paddingLeft: scale(30),
        paddingRight: scale(30),
        paddingTop: scale(50),
        paddingBottom: scale(50),
    },
    headerText: {
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.large,
        fontWeight: "bold",
        fontStyle: "normal",
        color: "white",
        lineHeight: 32,
        textAlign: "center",
    },
    rowLine: {
        flexDirection: "row",
        alignContent: "center",
        paddingBottom: 5,
    },
    textContainer: {
        marginLeft: 26,
        marginRight: 26,
        alignContent: "center",
        alignItems: "center",
        marginTop: verticalScale(17),
    },
    textSharedStyle: {
        color: "#384466",
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xMedium,
    },
    teamContainer: {
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 25,
        marginTop: verticalScale(-75),
    },
    questionContainer: {
        marginBottom: 10,
    },
    answersContainer: {
        backgroundColor: "white",
        borderRadius: 24,
        marginTop: 24,
    },
    footerView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        marginBottom: verticalScale(18),
    },
})
