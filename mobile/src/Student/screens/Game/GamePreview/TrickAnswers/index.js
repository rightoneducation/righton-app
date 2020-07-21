import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import sharedStyles from '../../Components/sharedStyles'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts, colors } from '../../../../../utils/theme'
import Button from '../../../../components/Button'
import RoundTextIcon from '../../../../components/RoundTextIcon'
import { FlatList, State } from 'react-native-gesture-handler'
import { KeyboardAwareFlatList } from '@codler/react-native-keyboard-aware-scroll-view'


const TrickAnswers = () => {
    const Status = {
        none: 'none',
        hasAnsweredCorrectly: 'answered',
        hasAnsweredIncorrectly: 'incorrectAnswer',
        alreadyAddedAnswer: 'alreadyAddedAnswer'
    }
    const [answers, setAnswers] = useState([])
    const [answer, setAnswer] = useState('')
    const [lastAnswer, setLastAnswer] = useState('')
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [status, setStatus] = useState(Status.none)
    const [currentAnswer, setCurrentAnswer] = useState('')


    const onAddTrickAnswers = () => {
        if (lastAnswer == '') {
            return
        }
        const newAnswers = answers
        newAnswers.push({
            id: answers.length,
            text: lastAnswer,
            isSelected: answers.length < 3
        })
        setAnswers(newAnswers)
        setCurrentAnswer('')
        setLastAnswer('')
        if (status == Status.hasAnsweredCorrectly) {
            setStatus(Status.alreadyAddedAnswer)
        }
    }

    const onAnwerClicked = (answer) => {
        const newSelectedAnswers = selectedAnswers
        if (answer.isSelected) {
            delete newSelectedAnswers[answer.id]
        } else {
            if (Object.keys(newSelectedAnswers).length < 3) {
                newSelectedAnswers[answer.id] = answer
            } else {
                return
            }
        }
        answer.isSelected = !answer.isSelected
        setSelectedAnswers(newSelectedAnswers)
        const newAnswers = answers
        answers[answer.id] = answer
        setAnswers(newAnswers)
    }

    const onTrickyAnswerChanged = (answer, newText) => {
        answers[answer.id].text = newText
    }

    const onRealAnswerChanged = (event) => {
        const text = event.nativeEvent.text
        setLastAnswer(text)
        if (text == '1080') {
            setAnswer(text)
            if (status == Status.alreadyAddedAnswer) {
                return
            }
            setStatus(Status.hasAnsweredCorrectly)
        } else if (status != Status.alreadyAddedAnswer) {
            setStatus(Status.hasAnsweredIncorrectly)
        }
    }

    return (
        <View style={[sharedStyles.cardContainer, styles.container]}>
            <Text style={sharedStyles.text}>What do you think the correct answer is?</Text>
            <TextInput
                style={[styles.answerTextInput, {
                    backgroundColor: status == Status.hasAnsweredCorrectly ? '#D7EFC3' : 'white',
                }]}
                value={currentAnswer}
                onChangeText={text => setCurrentAnswer(text)}
                onSubmitEditing={onRealAnswerChanged}
            />
            <View style={{ opacity: status == Status.none ? 0 : 1, flex: 1, alignSelf: 'stretch' }}>
                {
                    status != Status.alreadyAddedAnswer &&
                    <Text style={sharedStyles.text}>
                        {
                            status == Status.hasAnsweredCorrectly ?
                                'Nice job, that’s right! Now can you think of other answers that might trick your class?' :
                                'Nice try! That’s not the correct answer, but it sounds like a great trick answer!'
                        }
                    </Text>
                }
                <KeyboardAwareFlatList
                    style={styles.answers}
                    data={answers}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({ item }) =>
                        <RoundTextIcon
                            icon={item.isSelected ? require('../../img/checkmark_checked.png') : require('../../img/gray_circle.png')}
                            text={item.text}
                            height={43}
                            borderColor={item.isSelected ? '#8DCD53' : '#D9DFE5'}
                            onPress={onAnwerClicked}
                            data={item}
                            onChangeText={onTrickyAnswerChanged}
                        />
                    }
                />
                <View style={styles.addTrickAnswerContainer}>
                    <Button
                        title="Add Trick Answer"
                        buttonStyle={styles.addTrickAnswer}
                        onPress={onAddTrickAnswers}
                        titleStyle={[styles.addTrickAnswerTitle, { color: lastAnswer == '' ? '#B1BACB' : 'white' }]}
                        disabled={lastAnswer == ''}
                    />
                </View>
            </View>
        </View>
    )
}

export default TrickAnswers

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        // flex: 1,
        // flexDirection: 'column',
        justifyContent: 'space-between',
    },
    answerTextInput: {
        borderRadius: 8,
        marginTop: verticalScale(8),
        textAlign: 'center',
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xMedium,
        marginBottom: verticalScale(8),
        borderColor: '#B1BACB',
        borderWidth: 1,
        alignSelf: 'stretch',
    },
    textTrickAnswers: {
        marginTop: verticalScale(24)
    },
    addTrickAnswerContainer: {
        flex: 1,
        flexDirection: 'column',
        marginTop: verticalScale(10),
        justifyContent: 'space-between',
        alignSelf: 'stretch',
    },
    addTrickAnswer: {
        backgroundColor: colors.buttonSecondary,
        height: 43,
    },
    addTrickAnswerTitle: {
        fontFamily: fontFamilies.karlaBold,
        fontWeight: 'bold',
        fontSize: fonts.xxMedium,
    },
    answers: {
        marginTop: verticalScale(15),
        alignSelf: 'stretch'
    }
})
