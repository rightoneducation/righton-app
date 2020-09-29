import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import { scale, verticalScale } from 'react-native-size-matters'
import Question from '../../Components/Question'

const ExpandableQuestion = () => {
    const [expanded, setExpanded] = useState(false)
    return (
        <View style={styles.mainContainer}>
            <View>
                <Question />
            </View>
            <Pressable
                style={styles.footer}
                onPress={() => setExpanded(!expanded)}
            >
                <Image source={expanded ? require('./img/minus.png') : require('./img/plus.png')} />
                <Text style={styles.showMoreText}>
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
        borderRadius: scale(24),
        height: 207,
        marginRight: scale(42),
        marginLeft: scale(42),
        flex: 1,
        flexDirection: 'column',
    },
    footer: {
        backgroundColor: '#F4F4F4',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: verticalScale(50)
    },
    showMoreText: {
        marginLeft: 5,
        color: '#1C55FD'
    }
})
