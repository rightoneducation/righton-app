import React, { useState } from 'react';
import NavBarView from './NavBarView'
import { fontFamilies } from '../../../utils/theme'
import { FlatList } from 'react-native-gesture-handler'
import {
    StyleSheet,
    Text,
    SafeAreaView,
} from 'react-native';
import Card from './QuestionCard';

const detailList = ({route, navigation}) => {

    const { game } = route.params;

    const questions = [game.q1,game.q2,game.q3,game.q4,game.q5].filter( (question) => !!question ) 
    
    const parsedQuestions =  questions.map( (question) => JSON.parse(question)  )

    return(
            <SafeAreaView style={styles.mainContainer}>
                    <NavBarView title={false} avatar={false} onBack={() => navigation.goBack()} />
                        <Text style={styles.gameTitle}>{game.title}</Text>
                        <Text style={styles.description}>{game.description}</Text>
                        <Text style={styles.gameStandard}>Common Core Standard: {`${game.grade}.${game.domain}.${game.cluster}.${game.standard}`}</Text>
                        <Text style={styles.grade}>Grade {game.grade}</Text>

                        <FlatList
                            style={styles.questionContainer}
                            data={parsedQuestions}
                            keyExtractor={(item) => item.question}
                            renderItem={({ item }) => (
                                <Card
                                    image={item.image}
                                    question={item.question || "Question"}
                                    instructions={item.instructions || []}
                                />
                            )}
                        />
            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%'
    },
    headerContainer: {
        backgroundColor: 'red',
        width: '100%'
    },
    questionContainer: {
        paddingLeft: 40,
    },
    gameTitle: {
        height: 36,
        width: 310,
        fontSize: 24,
        color: '#384466',
        fontWeight: '700',
        fontFamily: fontFamilies.poppinsBold,
        textAlign: 'left',
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 40,
        fontStyle: 'normal'
    },
    description: {
        fontSize: 14,
        color: '#717D8F',
        fontWeight: '500',
        fontStyle: 'normal',
        textAlign: 'left',
        marginLeft: 40,
        marginRight: 20,
        marginBottom: 10
    },
    gameStandard: {
        fontSize: 14,
        color: '#9BA9D0',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'left',
        marginLeft: 40,
        marginRight: 20,
        marginBottom: 5
    },
    grade: {
        fontSize: 14,
        color: '#717D8F',
        fontWeight: '500',
        fontStyle: 'normal',
        textAlign: 'left',
        marginLeft: 40,
        marginRight: 20,
        marginBottom: 15
    },
    item: {
        marginTop: 24,
        padding: 30,
        backgroundColor: 'white',
        fontSize: 24,
    },
})
export default detailList;