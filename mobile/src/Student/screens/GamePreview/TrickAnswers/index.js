import React from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import sharedStyles from '../sharedStyles'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts, colors } from '../../../../utils/theme'
import Button from '../../../components/Button'
import RoundTextInput from '../../../components/RoundTextInput'



const TrickAnswers = () => {

    const onAddTrickAnswers = () => {

    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={[sharedStyles.cardContainer, styles.container]}>
                <Text style={sharedStyles.text}>The correct answer is</Text>
                <TextInput
                    style={styles.answerTextInput}
                    placeholder="?"
                />
                <Text style={sharedStyles.text}>For a bonus [[+10]], guess the correct answer before hints are revealed!</Text>
                <Text style={[sharedStyles.text, styles.textTrickAnswers]}>Enter at least 3 trick answers:</Text>
                <View style={styles.answers}>
                    <RoundTextInput icon={require('../img/checkmark_unchecked.png')} height={43} borderColor={'#D9DFE5'} />
                    <RoundTextInput icon={require('../img/checkmark_unchecked.png')} height={43} borderColor={'#D9DFE5'} />
                    <RoundTextInput icon={require('../img/checkmark_unchecked.png')} height={43} borderColor={'#D9DFE5'} />
                    <RoundTextInput icon={require('../img/checkmark_unchecked.png')} height={43} borderColor={'#D9DFE5'} />
                </View>
                <View>
                    <Button
                        title="Add Trick Answer"
                        buttonStyle={styles.addTrickAnswer}
                        onPress={onAddTrickAnswers}
                        titleStyle={styles.addTrickAnswerTitle}
                    />
                </View>
            </View>
        </ScrollView>
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
        fontSize: fonts.medium,
        marginBottom: verticalScale(8),
    },
    textTrickAnswers: {
        marginTop: verticalScale(24)
    },
    addTrickAnswer: {
        backgroundColor: colors.buttonSecondary,
        height: 43,
        marginTop: verticalScale(10),
        marginLeft: scale(24),
        marginRight: scale(24),
    },
    addTrickAnswerTitle: {
        fontFamily: fontFamilies.karlaBold,
        fontWeight: 'bold',
        fontSize: fonts.xMedium,
    },
    answers: {
        marginTop: verticalScale(15),
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignSelf: 'stretch'
    }
})
