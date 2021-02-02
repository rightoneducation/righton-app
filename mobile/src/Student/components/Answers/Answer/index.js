import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts } from '../../../../utils/theme'
import LinearGradient from 'react-native-linear-gradient'
import * as Progress from 'react-native-progress'

const Answer = ({ answer, isPopular, percentage, isAnswer }) => {
    const popularIconVisible = isPopular || false
    const percentageVisible = !popularIconVisible && percentage !== undefined
    const percentageTitle = (percentage) => {
        return percentage + '%'
    }
    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isAnswer ? '#6515C9' : 'white'
            }
        ]}>
            <View style={styles.answerContainer}>
                <Text
                    style={[
                        styles.answer,
                        {
                            color: isAnswer ? 'white' : '#384466'
                        }
                    ]}
                >
                    {answer}
                </Text>
                {
                    (percentage || false) &&
                    <Progress.Bar
                        style={styles.progressBar}
                        progress={percentage / 100}
                        color={'#3AC449'}
                        unfilledColor={'rgba(255,255,255,0.8)'}
                    />
                }
            </View>
            {
                popularIconVisible && <LinearGradient
                    colors={['#98CA28', '#49B036']}
                    style={styles.headerContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Image
                        source={require('../img/Team1Pick.png')}
                        resizeMethod='resize'
                        resizeMode='contain'
                        width={scale(45)}
                        style={styles.image}
                    />
                    <Text
                        style={[
                            styles.totalPercentage,
                            {
                                color: 'white',
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: '#00000000'
                            }
                        ]}
                    >
                        {percentageTitle(percentage)}
                    </Text>
                </LinearGradient>
            }
            {
                percentageVisible && <Text
                    style={[
                        styles.totalPercentage,
                        {
                            color: isAnswer ? 'white' : '#C7C7C7',
                            backgroundColor: isAnswer ? '#00000000' : '#F7F6F6',
                        }
                    ]}
                >
                    {percentageTitle(percentage)}
                </Text>
            }

        </View>
    )
}

export default Answer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#E4E4E6',
        borderRadius: 12,
        borderWidth: 1,
        height: 50,
        overflow: 'hidden'
    },
    answer: {
        fontSize: fonts.xMedium,
        fontFamily: fontFamilies.karlaRegular,
        fontWeight: 'bold',
        paddingLeft: 9,
        textAlignVertical: 'center',
        flex: 1,
    },
    totalPercentage: {
        width: scale(45),
        textAlignVertical: 'center',
        textAlign: 'center',
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xMedium,
        fontWeight: '700'
    },
    image: {

    },
    answerContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    progressBar: {
        marginLeft: scale(8),
        marginBottom: scale(4),
    }
})
