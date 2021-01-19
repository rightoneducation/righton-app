import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import Answer from './Answer'

const Answers = ({ teamSelectedTrickAnswer, numColumns }) => {
    const [answers, setAnswers] = useState([8, 540, 360, 1080])
    let totalPercentage = 0
    let totalAnswers = 0
    const generatePercentage = () => {
        const remainingPercentage = 100 - totalPercentage
        if (totalAnswers == 3) {
            return remainingPercentage
        }
        const currentPercentage = Math.floor((Math.random() * remainingPercentage))
        totalAnswers++
        totalPercentage += currentPercentage
        return currentPercentage
    }
    return (
        <View style={styles.mainContainer}>
            <FlatList
                data={answers}
                numColumns={numColumns}
                keyExtractor={item => `${item}`}
                renderItem={({ item }) =>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            margin: 10
                        }}
                    >
                        {
                            numColumns == 1 &&
                            <Answer
                                answer={item}
                                isPopular={teamSelectedTrickAnswer == item}
                                percentage={generatePercentage()}
                                isAnswer={1080 == item}
                            />
                        }
                        {
                            numColumns == 2 &&
                            <Answer
                                answer={item}
                                isPopular={teamSelectedTrickAnswer == item}
                            />
                        }
                    </View>
                }
            />
        </View>
    )
}

export default Answers

const styles = StyleSheet.create({
    mainContainer: {
        padding: 12
    }
})
