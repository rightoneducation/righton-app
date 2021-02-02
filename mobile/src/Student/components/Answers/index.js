import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import Answer from './Answer'

const Answers = ({ teamSelectedTrickAnswer, numColumns }) => {
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

    const [answers, setAnswers] = useState([
        {
            num: 8,
            percentage: generatePercentage()
        },
        {
            num: 540,
            percentage: generatePercentage()
        },
        {
            num: 360,
            percentage: generatePercentage()
        },
        {
            num: 1080,
            percentage: generatePercentage()
        }
    ].sort((a, b) => {
        return a.percentage < b.percentage
    }))
    return (
        <View style={styles.mainContainer}>
            <FlatList
                data={answers}
                numColumns={numColumns}
                keyExtractor={item => `${item.num}`}
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
                                answer={item.num}
                                isPopular={teamSelectedTrickAnswer == item.num}
                                percentage={item.percentage}
                                isAnswer={1080 == item.num}
                            />
                        }
                        {
                            numColumns == 2 &&
                            <Answer
                                answer={item.num}
                                isPopular={teamSelectedTrickAnswer == item.num}
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
