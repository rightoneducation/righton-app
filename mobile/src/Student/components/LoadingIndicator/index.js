import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { View, StyleSheet, Text } from 'react-native'
import Svg, { Path, G } from 'react-native-svg'
import { fontFamilies } from '../../../utils/theme'
import PropTypes from 'prop-types'

const { cos, sin, PI } = Math
const tau = 2 * PI

const multiply = ([a, b, c, d], x, y) => [a * x + b * y, c * x + d * y]

const rotate = x => [cos(x), -sin(x), sin(x), cos(x)]

const add = ([a1, a2], b1, b2) => [a1 + b1, a2 + b2]

const ellipse = (cx, cy, rx, ry, t1, delta, theta) => {
    delta = delta % tau
    const rotMatrix = rotate(theta)
    const [sX, sY] = add(multiply(rotMatrix, rx * cos(t1), ry * sin(t1)), cx, cy)
    const [eX, eY] = add(
        multiply(rotMatrix, rx * cos(t1 + delta), ry * sin(t1 + delta)),
        cx,
        cy,
    )
    const fA = delta > PI ? 1 : 0
    const fS = delta > 0 ? 1 : 0
    const path = ['M', sX, sY, 'A', rx, ry, (theta / tau) * 360, fA, fS, eX, eY]
    return path.join(' ')
}

function Segments({
    x = 0,
    y = 0,
    r = 1,
    rx = r,
    ry = r,
    colors,
    t1 = 0,
    phase = 0,
    spacing = 0.1,
} = {}) {
    const segments = colors.length
    const evenly = tau / segments
    const space = evenly * spacing
    const offset = space + phase
    const sweepAngle = evenly - space * 2
    return colors.map((color, i) => (
        <Path
            key={color}
            stroke={color}
            d={ellipse(x, y, rx, ry, t1, sweepAngle, i * evenly + offset)}
        />
    ))
}

export default LoadingIndicator = (
    {
        theme,
        radius,
        fontSize,
        textColor,
        timerStartInSecond,
        onTimerFinished
    }
) => {
    fontSize = fontSize || 24
    textColor = textColor || 'white'
    const [colors, setColors] = useState(theme)

    const [remainingSecondsInMilliSeconds, setRemainingSecondsInMilliSeconds] = useState(timerStartInSecond * 1000)
    const [remainingTimeInSecond, setRemainingTimeInSecond] = useState(timerStartInSecond)
    const [timerFinished, setTimerFinished] = useState(false)

    let timeInterval = 100
    useFocusEffect(
      React.useCallback(() => {
        if (timerFinished || remainingTimeInSecond < 1) {
            clearInterval(refreshIntervalId)
            setTimerFinished(true)
            onTimerFinished()
            return
        }
        var refreshIntervalId = setInterval(() => {
            const c = colors.slice(colors.length - 1).concat(colors.slice(0, colors.length - 1))
            setColors(c)
            if (timerFinished) {
                return
            }
            setRemainingSecondsInMilliSeconds(remainingSecondsInMilliSeconds - timeInterval)
            setRemainingTimeInSecond(Math.ceil(remainingSecondsInMilliSeconds / 1000))
        }, timeInterval)
        return () => {
            clearInterval(refreshIntervalId)
        }
      },[remainingSecondsInMilliSeconds])
    )

    return (
        <View style={styles.container}>
            <Svg
                width={radius * 2}
                height={radius * 2}
                strokeWidth={7}
                fill="transparent"
                viewBox="0 0 42 42"
            >
                <Segments
                    x={21}
                    y={21}
                    r={15.91549430918954}
                    colors={colors}
                />
            </Svg>
            <Text
                style={[styles.text, {
                    fontSize: fontSize,
                    color: textColor,
                }]}
            >
                {remainingTimeInSecond}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1
    },
    text: {
        textAlign: 'center',
        color: 'white',
        position: 'absolute',
        fontFamily: fontFamilies.MontserratBold,
        fontWeight: 'bold'
    }
})

LoadingIndicator.propTypes = {
    theme: PropTypes.array.isRequired,
    radius: PropTypes.number.isRequired,
    fontSize: PropTypes.number,
    timerStartInSecond: PropTypes.number,
    onTimerFinished: PropTypes.func,
}