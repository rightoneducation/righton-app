import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, Pressable, Animated } from 'react-native'
import { scale, verticalScale } from 'react-native-size-matters'
import Question from '../../screens/Game/Components/Question'

const ExpandableQuestion = () => {
    const [expanded, setExpanded] = useState(false)

    return (
        <View style={styles.mainContainer}>
            <View
                style={
                    expanded ? { flex: 1 } : { height: verticalScale(207) }
                }
            >
                <Question />
            </View>
            <Pressable
                onPress={() => setExpanded(!expanded)}
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed
                            ? '#e4e4e4'
                            : '#F4F4F4'
                    }, styles.footer]}
            >
                <Image
                    source={expanded ? require('./img/minus.png') : require('./img/plus.png')}
                    style={styles.expandIcon}
                    resizeMode='cover'
                    resizeMethod='resize'
                />
                <Text style={[
                    styles.showMoreText,
                    { marginRight: expanded ? 8 : 0 }
                ]}>
                    {expanded ? 'SHOW LESS' : 'SHOW MORE'}
                </Text>
            </Pressable>
        </View>
    )
}

export default ExpandableQuestion

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
        borderRadius: 24,
        overflow: 'hidden',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    questionContainer: {

    },
    expandIcon: {
        width: 12,
        height: 12,
        marginRight: 5,
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
    },
    showMoreText: {
        color: '#1C55FD',
    }
})
