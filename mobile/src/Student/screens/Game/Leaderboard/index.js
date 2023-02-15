import { ModelHelper } from '@righton/networking'
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { scale, verticalScale } from "react-native-size-matters"
import TeamFooter from "../../../../components/TeamFooter"
import { fontFamilies, fonts } from "../../../../utils/theme"
import TeamItem from "./Components/TeamItem"

const Leaderboard = ({
    gameSession,
    team,
    teamAvatar,
}) => {
    const sortedTeamsByScore = gameSession.teams.sort((a, b) => b.score - a.score)

    const teamName = team.name ? team.name : "Team Name"
    const totalScore = ModelHelper.calculateBasicModeTotalScoreForQuestion(
        gameSession,
        gameSession.questions[gameSession.currentQuestionIndex],
        team
    )

    return (
        <SafeAreaView style={styles.mainContainer}>
         {console.log("Leaderboard")}
            <ScrollView
                contentContainerStyle={{
                    justifyContent: "space-between",
                }}
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
                    data={sortedTeamsByScore}
                    keyExtractor={(item) => `${item.id}`}
                    style={styles.teamContainer}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => {
                        return <View style={{ height: 10 }} />
                    }}
                    renderItem={({ item, index }) => (
                        <TeamItem
                            teamName={item.name}
                            teamNo={index + 1}
                            score={ModelHelper.calculateBasicModeTotalScoreForQuestion(
                                gameSession,
                                gameSession.questions[gameSession.currentQuestionIndex],
                                item
                            )}
                        />
                    )}
                />
            </>
            <View style={styles.footerView}>
                <TeamFooter
                    icon={teamAvatar.smallSrc}
                    name={teamName}
                    totalScore={totalScore ? totalScore : 0}
                />
            </View>
        </SafeAreaView>
    )
}

export default Leaderboard

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
