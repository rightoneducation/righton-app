import { isNullOrUndefined, ModelHelper } from '@righton/networking'
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import TeamFooter from '../../../components/TeamFooter'
import { colors, fontFamilies, fonts, fontWeights } from '../../../utils/theme'
import Answer, { AnswerMode } from './Answer'

const PhaseResult = ({ phaseNo, gameSession, score, team, totalScore, smallAvatar }) => {
    smallAvatar = smallAvatar ? smallAvatar : require("../SelectTeam/img/MonsterIcon1.png")

    teamName = team?.name ? team?.name : "Team Name"
    score = score ? score : 10
    totalScore = team?.score ? team?.score : 0
    const currentQuestion = gameSession.questions[gameSession.currentQuestion]
    const teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(team, curQuestion.id)
    const teamAnswer = (!isNullOrUndefined(teamAnswers) && teamAnswers.length == 0) ? teamAnswers[0] : Number.MIN_VALUE
    const correctAnswer = ModelHelper.correctAnswer(curQuestion)
    const selectedTrickAnswer = ModelHelper.getSelectedTrickAnswer(team, curQuestion.id)

    const alphabets = ["A", "B", "C", "D"]
    const getAnswerMode = (choiceText) => {
        switch (phaseNo) {
            case 1:
                if (correctAnswer.text === choiceText) {
                    return AnswerMode.RightAnswer
                }
                return AnswerMode.ShowEmptyRightIcon
            case 2:
                if (correctAnswer.text === choiceText) {
                    return AnswerMode.Disabled
                } else if (selectedTrickAnswer.text === choiceText) {
                    return AnswerMode.PopularTrickAnswer
                }
        }
    }

    const calculatePercentage = (answer) => {
        if (isNullOrUndefined(answer)) {
            return 0
        }
        return ModelHelper.calculateBasicModeWrongAnswerScore(gs, answer, currentQuestion.id)
    }

    const getIsUserChoice = (answer) => {
        if (phaseNo === 1) {
            return teamAnswer.text === answer.text
        } else if (!isNullOrUndefined(selectedTrickAnswer)) {
            return selectedTrickAnswer.text === answer.text
        }
        return false
    }

    return (
        <SafeAreaView style={styles.container}>
            {gs !== null && <>
                <ImageBackground
                    source={require("./img/background.png")}
                    style={styles.headerContainer}
                >
                    <Text style={styles.headerText}>
                        {`Phase ${phaseNo ? phaseNo : "1"}\nResults`}
                    </Text>
                </ImageBackground>
                <View style={styles.resultContainer}>
                    <FlatList
                        data={currentQuestion.choices}
                        keyExtractor={(item) => `${item.text}`}
                        style={styles.answersContainer}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => {
                            return <View style={{ height: 10 }} />
                        }}
                        renderItem={({ item, index }) => (
                            <Answer
                                icon={smallAvatar}
                                text={`${alphabets[index]}. ${item.text}`}
                                mode={getAnswerMode(item.text)}
                                isUserChoice={getIsUserChoice(item)}
                                percentage={`%${calculatePercentage(item)}`}
                            />
                        )}
                    >
                    </FlatList>
                </View>
                <View style={styles.footerView}>
                    <TeamFooter
                        icon={smallAvatar}
                        name={teamName}
                        score={score}
                        totalScore={totalScore ? totalScore : 0}
                    />
                </View>
            </>}
        </SafeAreaView>
    )
}

export default PhaseResult

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: verticalScale(225),
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        fontSize: fonts.semiLarge,
        fontFamily: fontFamilies.karlaBold,
        fontWeight: fontWeights.extraBold,
        color: colors.white,
    },
    footerView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        marginBottom: verticalScale(18),
    },
    resultContainer: {
        flex: 1,
    },
    answersContainer: {
        marginHorizontal: 53,
        shadowOpacity: 1,
        elevation: 5,
        shadowColor: '#030002',
        shadowOpacity: 0.25,
        shadowRadius: 5,
        borderRadius: 24,
        padding: 12,
        backgroundColor: colors.white,
        flexGrow: 0,
    }
})