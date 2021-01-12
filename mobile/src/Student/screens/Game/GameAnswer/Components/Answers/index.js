import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import Answer from './Answer'

const Answers = ({ teamSelectedTrickAnswer, numColumns }) => {
    const [answers, setAnswers] = useState([8, 540, 360, 1080])
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
                        }}>
                        {
                            numColumns == 1 &&
                            <Answer
                                answer={item}
                                isPopular={teamSelectedTrickAnswer == item}
                                percentage={Math.floor(Math.random() * 100)}
                                isAnswer={8 == item}
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
