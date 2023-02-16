import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import { fontFamilies, fonts } from '../../../utils/theme'

const QuestionCard = (props) => {
    const [hintsShown, setHintsShown] = useState(false)

    const showHints = () => {
        setHintsShown(true)
    }

    const hideHints = () => {
        setHintsShown(false)
    }

    return (
        <View style={styles.cardContainer}>
            <Image
                style={styles.questionImage}
                source={{ uri: props.image }}
            />
            <Text style={styles.headerText}>{props.question}</Text>
            <View style={styles.breakLine}></View>

            {
                hintsShown ? props.instructions.map((hint, index) => (
                    <View style={styles.hintDirection}>
                        <Text style={styles.hintNumber}>{index + 1}</Text>
                        <Text style={styles.questionHint}>{hint}</Text>
                    </View>
                )) : null
            }

            <View style={styles.hintButtonBackground}>
                {
                    hintsShown ?
                        <Pressable onPress={hideHints}>
                            <Text style={styles.hintButton}>HIDE HINTS</Text>
                        </Pressable>
                        :
                        <Pressable onPress={showHints}>
                            <View style={styles.hintButtonDirection}>
                                <Text style={styles.hintButton}>SHOW HINTS</Text>
                            </View>
                        </Pressable>
                }
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    questionImage: {
        width: 200,
        height: 200,
        paddingTop: 20,
    },
    breakLine: {
        backgroundColor: '#B1BACB',
        width: 270,
        height: 2,
        marginBottom: 5,
    },
    cardContainer: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        borderRadius: 24,
        paddingTop: 20,
        width: 330,
        shadowColor: 'black',
        shadowOpacity: 5,
        elevation: 10,
        marginBottom: 20,
    },
    headerText: {
        fontFamily: fontFamilies.montserratBold,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#384466',
        textAlign: 'center',
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        paddingBottom: 20,
    },
    questionHint: {
        fontWeight: 'normal',
        fontSize: 16,
        color: '#384466',
        marginRight: 70
    },
    hintNumber: {
        fontFamily: fontFamilies.montserratBold,
        fontWeight: 'bold',
        fontSize: 23,
        color: '#4700B2',
        marginLeft: 25,
        marginRight: 10
    },
    hintDirection: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 20,
        width: '100%',
        padding: 10,
        justifyContent: 'flex-start'
    },
    hintButtonBackground: {
        backgroundColor: '#F4F4F4',
        flex: 1,
        marginTop: 10,
        width: 330,
        height: 50,
        borderBottomRightRadius: 24,
        borderBottomLeftRadius: 24,
        alignItems: 'center',
    },
    hintButton: {
        marginTop: 15,
        color: '#1C55FD',
        fontWeight: 'bold',
        backgroundColor: '#F4F4F4'
    },
    hintButtonDirection: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    }
})

export default QuestionCard