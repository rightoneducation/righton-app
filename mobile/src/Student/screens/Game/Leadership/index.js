import React from 'react'
import { StyleSheet, Text, SafeAreaView, View, FlatList } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts } from '../../../../utils/theme'
import Button from '../../../components/Button'
import Points from '../../../components/Points'
import TeamItem from './Components/TeamItem'

const Leadership = () => {
    const teams = [
        {
            teamNo: 1,
            score: 0,
            showPoints: false
        },
        {
            teamNo: 2,
            score: 25,
            showPoints: false
        },
        {
            teamNo: 3,
            score: 0,
            showPoints: true
        },
        {
            teamNo: 4,
            score: 25,
            showPoints: false
        },
        {
            teamNo: 5,
            score: 0,
            showPoints: true
        },
    ]
    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={['rgba(62, 0, 172, 1)', 'rgba(98, 0, 204, 1)']}
                style={styles.headerContainer}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.headerText}>
                    Leaderboard
                </Text>
                <Button
                    titleStyle={{
                        fontFamilies: fontFamilies.karlaRegular,
                        fontStyle: 'bold',
                        fontSize: fonts.xxMedium
                    }}
                    buttonStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        marginTop: verticalScale(13),
                        height: 40,
                    }}
                    title="Review Question"
                />
            </LinearGradient>
            <>
                <View style={styles.textContainer}>
                    <View style={styles.rowLine}>
                        <Text style={[
                            styles.textSharedStyle,
                            {
                                fontWeight: 'bold'
                            }]}
                        >
                            {"2 teams"}
                        </Text>
                        <Text style={styles.textSharedStyle}>
                            {" got the right answer!"}
                        </Text>
                    </View>
                    <View style={styles.rowLine}>
                        <Text style={styles.textSharedStyle}>
                            They both get
                        </Text>
                        <Points point={25} />
                    </View>
                </View>

                <FlatList
                    data={teams}
                    keyExtractor={item => `${item.teamNo}`}
                    style={styles.teamContainer}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{ height: 10 }} />
                        )
                    }}
                    renderItem={({ item }) =>
                        <TeamItem teamNo={item.teamNo} score={item.score} showPoints={item.showPoints} />
                    }
                />
            </>
        </SafeAreaView>
    )
}

export default Leadership

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(247,249,250,1)'
    },
    headerContainer: {
        height: verticalScale(136),
        shadowColor: 'rgba(0, 141, 239, 0.3)',
        paddingLeft: scale(30),
        paddingRight: scale(30),
        paddingTop: scale(24),
    },
    headerText: {
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.large,
        fontWeight: 'bold',
        fontStyle: 'normal',
        color: 'white',
        lineHeight: 32,
        textAlign: 'center',
    },
    rowLine: {
        flexDirection: 'row',
        alignContent: 'center',
        paddingBottom: 5
    },
    textContainer: {
        marginLeft: 26,
        marginRight: 26,
        alignContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(17)
    },
    textSharedStyle: {
        color: '#384466',
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xMedium,
    },
    teamContainer: {
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 25,
    }
})
