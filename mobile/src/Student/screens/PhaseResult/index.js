import { isNullOrUndefined, ModelHelper } from '@righton/networking'
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import TeamFooter from '../../../components/TeamFooter'
import { colors, fontFamilies, fonts, fontWeights } from '../../../utils/theme'
import Answer, { AnswerMode } from './Answer'

const PhaseResult = ({ phaseNo, gameSession, score, team, totalScore, smallAvatar }) => {
    smallAvatar = smallAvatar ? smallAvatar : require("../SelectTeam/img/MonsterIcon1.png")

    // TODO: Delete these. Leaving these lines here as needed to implement phase 2 results.
    // const [gs, setGS] = useState(null)
    // const [currentQuestion, setCurrentQuestion] = useState(null)
    // const [teamAnswer, setTeamAnswer] = useState(null)
    // const [correctAnswer, setCorrectAnswer] = useState(null)
    // useEffect(() => {
    //     global.apiClient
    //         .getGameSessionByCode(1111)
    //         .then((gameSessionResponse) => {
    //             team = gameSessionResponse.teams[0]
    //             const curQuestion = gameSessionResponse.questions[gameSessionResponse.currentQuestionIndex]
    //             teamName = team?.name ? team?.name : "Team Name"
    //             score = score ? score : 10
    //             totalScore = team?.score ? team?.score : 0
    //             const teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(team, curQuestion.id)
    //             setCorrectAnswer(ModelHelper.getCorrectAnswer(curQuestion))
    //             if (!isNullOrUndefined(teamAnswers) && teamAnswers.length == 1) {
    //                 setTeamAnswer(teamAnswers[0])
    //             } else {
    //                 setTeamAnswer({
    //                     text: Number.MIN_VALUE
    //                 })
    //             }
    //             setCurrentQuestion(gameSessionResponse.questions[gameSessionResponse.currentQuestionIndex])
    //             setGS(gameSessionResponse)
    //         }).catch((error) => {
    //             console.error(error)
    //         })
    // })

    // TODO: Uncomment these before merge. Leaving this for phase 2 work
    // TODO: Following code is not tested with e2e scenario so there might need to be some adjustments
    teamName = team?.name ? team?.name : "Team Name"
    score = score ? score : 10
    totalScore = team?.score ? team?.score : 0
    const currentQuestion = gameSession.questions[gameSession.currentQuestion]
    const teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(team, curQuestion.id)
    const teamAnswer = (!isNullOrUndefined(teamAnswers) && teamAnswers.length == 0) ? teamAnswers[0] : Number.MIN_VALUE
    const correctAnswer = ModelHelper.correctAnswer(curQuestion)
    // const currentPhase = 1 // phaseNo

    const alphabets = ["A", "B", "C", "D"]
    const getAnswerMode = (choiceText) => {
        switch (currentPhase) {
            case 1:
                if (correctAnswer.text === choiceText) {
                    return AnswerMode.RightAnswer
                }
                return AnswerMode.ShowEmptyRightIcon
            case 2:
        }
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
                        ItemSeparatorComponent={() => {
                            return <View style={{ height: 10 }} />
                        }}
                        renderItem={({ item, index }) => (
                            <Answer
                                icon={smallAvatar}
                                text={`${alphabets[index]}. ${item.text}`}
                                mode={getAnswerMode(item.text)}
                                isUserChoice={teamAnswer.text === item.text}
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