import React from 'react'
import { StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const PurpleBackground = (props) => {
    const style = { ...styles.background, ...props.style }
    return (
        <LinearGradient
            colors={['#312759', '#6e5eaf', '#312759']}
            start={{ x: 0, y: 0.2 }} end={{ x: 0, y: 0.8 }}
            locations={[0, 0.4, 1]}
            style={style}>
            {props.children}
        </LinearGradient>
    )
}

export default PurpleBackground

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
})
