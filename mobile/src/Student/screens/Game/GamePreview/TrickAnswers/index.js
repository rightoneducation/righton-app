import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Platform } from 'react-native'
import sharedStyles from '../../Components/sharedStyles'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts, colors } from '../../../../../utils/theme'
import RoundTextIcon from '../../../../components/RoundTextIcon'
import uuid from 'react-native-uuid'
import { KeyboardAwareFlatList } from '@codler/react-native-keyboard-aware-scroll-view'

const TrickAnswers = ({ onAnsweredCorrectly, isFacilitator }) => {
    const Status = {
        none: 'none',
        hasAnsweredCorrectly: 'answered',
        hasAnsweredIncorrectly: 'incorrectAnswer',
    }
    const [estimatedAnswer, setEstimatedAnswer] = useState('')
    const [showTrickAnswers, setShowTrickAnswers] = useState(false)
    const [trickAnswers, setTrickAnswers] = useState([])
    const [status, setStatus] = useState(Status.none)
    const [answer, setAnswer] = useState(undefined)

    const createAnswer = (text) => {
        return {
            id: uuid.v4(),
            text: text,
            isSelected: false
        }
    }

    const onAnswerSubmitted = (event) => {
        const text = event.nativeEvent.text
        const newAnswer = createAnswer(text)

        setEstimatedAnswer('')

        if (newAnswer.text == '1080') {
            setAnswer(newAnswer)
            setStatus(Status.hasAnsweredCorrectly)
            if (onAnsweredCorrectly !== undefined) {
                onAnsweredCorrectly()
            }
            setTrickAnswers(trickAnswers)
            startTrickAnswersTimer()
            return
        }

        setTrickAnswers([...trickAnswers, newAnswer])

        if (status == Status.none) {
            setStatus(Status.hasAnsweredIncorrectly)
            startTrickAnswersTimer()
        }
    }

    const toggleAnswer = (answerId) => {
        if (!isFacilitator) {
            return
        }
        const answers = trickAnswers.filter(answer => answer.isSelected)
        const newAnswerIndex = trickAnswers.findIndex(answer => answer.id == answerId)
        if (trickAnswers[newAnswerIndex].isSelected) {
            trickAnswers[newAnswerIndex].isSelected = false
        } else if (answers.length < 3 && trickAnswers[newAnswerIndex].text !== '') {
            trickAnswers[newAnswerIndex].isSelected = !trickAnswers[newAnswerIndex].isSelected
        }

        setTrickAnswers(trickAnswers)
    }

    const onTrickyAnswerChanged = (answerId, newText) => {
        if (status != Status.hasAnsweredCorrectly) {
            return
        }
        const index = trickAnswers.findIndex(answer => answer.id == answerId)
        trickAnswers[index].text = newText
        if (index == trickAnswers.length - 1) {
            setTrickAnswers([...trickAnswers, createAnswer('')])
        } else {
            setTrickAnswers(trickAnswers)
        }
    }

    const startTrickAnswersTimer = () => {
        setTimeout(() => {
            setShowTrickAnswers(true)
        }, 500)
    }

    const HeaderComponent = () => {
        return (
            status == Status.hasAnsweredCorrectly &&
            <>
                <Text style={sharedStyles.text}>
                    Correct Answer
                    </Text>
                <TextInput
                    style={styles.answerTextInput}
                    value={answer === undefined ? '' : answer.text}
                    editable={false}
                    placeholderTextColor='#CECECE'
                />
            </>
        )
    }

    return (
        <View style={[sharedStyles.cardContainer, styles.container]}>
            <View style={
                [
                    styles.answersContainer,
                    { opacity: status == Status.none ? 0 : 1 }
                ]
            }>
                <KeyboardAwareFlatList
                    style={styles.answers}
                    data={trickAnswers}
                    extraData={[trickAnswers, status, answer, estimatedAnswer, showTrickAnswers]}
                    keyExtractor={item => item.id.toString()}
                    ListHeaderComponent={HeaderComponent}
                    renderItem={({ item, index }) => (
                        <>
                            {
                                index == 0 &&
                                <Text style={[sharedStyles.text, styles.trickAnswerText]}>
                                    Our Trick Answers
                                </Text>
                            }
                            <RoundTextIcon
                                icon={item.isSelected ? require('../../img/checkmark_checked.png') : require('../../img/gray_circle.png')}
                                text={item.text}
                                height={43}
                                borderColor={item.isSelected ? '#8DCD53' : '#D9DFE5'}
                                onPress={toggleAnswer}
                                showIcon={isFacilitator}
                                readonly={true}
                                data={item.id}
                                onTextChanged={onTrickyAnswerChanged}
                            />
                        </>
                    )
                    }
                />
            </View>
            <View style={styles.answerInputContainer}>
                {
                    isFacilitator && status == Status.hasAnsweredCorrectly && !showTrickAnswers &&
                    <Text style={sharedStyles.text}>
                        Someone on your team got the correct answer!
                    </Text>
                }
                {
                    !isFacilitator && status == Status.hasAnsweredCorrectly && !showTrickAnswers &&
                    <Text style={sharedStyles.text}>
                        Nice job, that’s right!
                    </Text>
                }
                {
                    status == Status.hasAnsweredCorrectly && !showTrickAnswers &&
                    <Text
                        style={sharedStyles.text}
                    >
                        This unlocks the Hints for your team.
                    </Text>

                }
                {
                    !isFacilitator && status == Status.hasAnsweredIncorrectly && !showTrickAnswers &&
                    <Text style={sharedStyles.text}>
                        Nice try! That’s not the correct answer, but it sounds like a great trick answer! We’ve added it to your list of trick answers!
                    </Text>
                }
                {
                    status == Status.hasAnsweredCorrectly && showTrickAnswers &&
                    <Text Text style={[
                        sharedStyles.text,
                        { marginTop: 10 }
                    ]}>
                        Now come up with other answers that might trick your class!
                    </Text>
                }
                {
                    (status == Status.none ||
                        (status == Status.hasAnsweredIncorrectly && showTrickAnswers)) &&
                    <Text style={sharedStyles.text}>
                        What do you think the correct answer is?
                    </Text>
                }
                <TextInput
                    style={
                        [
                            styles.answerTextInput,
                            {
                                backgroundColor: 'white',
                            }
                        ]
                    }
                    value={estimatedAnswer}
                    onChangeText={text => setEstimatedAnswer(text)}
                    onSubmitEditing={onAnswerSubmitted}
                    editable={true}
                    placeholder='Enter answer here'
                    placeholderTextColor='#CECECE'
                />
            </View>
        </View>
    )
}

export default TrickAnswers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: -12
    },
    answersContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    answerInputContainer: {
        bottom: 0,
        justifyContent: 'space-around',
        alignContent: 'stretch',
        alignSelf: 'stretch'
    },
    answerTextInput: {
        borderRadius: 8,
        marginTop: verticalScale(8),
        textAlign: 'center',
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.small,
        marginBottom: verticalScale(8),
        borderColor: '#B1BACB',
        borderWidth: 1,
        alignSelf: 'stretch',
        ...Platform.select({
            ios: {
                height: 43
            },
        }),
        backgroundColor: '#D7EFC3',
    },
    trickAnswerInput: {
        borderWidth: 2,
        borderRadius: 22,
        marginBottom: 10,
        paddingLeft: 20,
        height: 43,
    },
    answers: {
        marginTop: verticalScale(15),
        alignSelf: 'stretch'
    },
    trickAnswerText: {
        marginTop: verticalScale(24),
        marginBottom: verticalScale(8),
    }
})
