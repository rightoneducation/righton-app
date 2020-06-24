import React from 'react'
import { StyleSheet, Image, View } from 'react-native'

const TeamsReadinessFooter = () => {
    return (
        <View style={styles.footer}>
            <Image source={require('./img/Team1Ready.png')} style={styles.footerImage} />
            <Image source={require('./img/Team2NotReady.png')} style={styles.footerImage} />
            <Image source={require('./img/Team3Ready.png')} style={styles.footerImage} />
            <Image source={require('./img/Team4NotReady.png')} style={styles.footerImage} />
            <Image source={require('./img/Team5NotReady.png')} style={styles.footerImage} />
        </View>
    )
}

export default TeamsReadinessFooter

const styles = StyleSheet.create({
    footer: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
    },
    footerImage: {
        marginLeft: 5,
        marginRight: 5,
        width: 56,
        resizeMode: 'contain'
    }
})
