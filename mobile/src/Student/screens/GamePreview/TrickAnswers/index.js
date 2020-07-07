import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import sharedStyles from '../sharedStyles'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts, colors } from '../../../../utils/theme'
import Button from '../../../components/Button'
import RoundTextInput from '../../../components/RoundTextInput'
import { FlatList } from 'react-native-gesture-handler'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'


const TrickAnswers = () => {
    const [answers, setAnswers] = useState([])
    const [selectedAnswers, setSelectedAnswers] = useState({})

    const onAddTrickAnswers = () => {
        const newAnswers = answers
        newAnswers.push({ id: answers.length, text: '', isSelected: false })
        setAnswers(newAnswers)
    }

    const onToggleIcon = (answer) => {
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

    const onAnswerChanged = (answer, newText) => {
        answers[answer.id].text = newText
    }

    return (
        <View style={[sharedStyles.cardContainer, styles.container]}>
            <Text style={sharedStyles.text}>The correct answer is</Text>
            <TextInput
                style={styles.answerTextInput}
                placeholder="?"
            />
            <Text style={sharedStyles.text}>For a bonus [[+10]], guess the correct answer before hints are revealed!</Text>
            <Text style={[sharedStyles.text, styles.textTrickAnswers]}>Enter at least 3 trick answers:</Text>
            <KeyboardAwareFlatList
                style={styles.answers}
                data={answers}
                keyExtractor={item => `${item.id}`}
                renderItem={({ item }) =>
                    <RoundTextInput
                        icon={item.isSelected ? require('../img/checkmark_checked.png') : require('../img/checkmark_unchecked.png')}
                        height={43}
                        borderColor={item.isSelected ? '#8DCD53' : '#D9DFE5'}
                        onTappedIcon={onToggleIcon}
                        data={item}
                        onChangeText={onAnswerChanged}
                    />
                }
            />
            <View style={styles.addTrickAnswerContainer}>
                <Button
                    title="Add Trick Answer"
                    buttonStyle={styles.addTrickAnswer}
                    onPress={onAddTrickAnswers}
                    titleStyle={styles.addTrickAnswerTitle}
                />
            </View>
        </View>
    )
}

export default TrickAnswers

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    answerTextInput: {
        backgroundColor: '#D7EFC3',
        borderRadius: 8,
        width: moderateScale(140),
        marginTop: verticalScale(8),
        textAlign: 'center',
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xMedium,
        marginBottom: verticalScale(8),
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
