import React from 'react'
import { StyleSheet, Text, Image, View, Dimensions } from 'react-native'
import debug from '../../../utils/debug'
import { colors, fonts } from '../../../utils/theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import PurpleBackground from '../../../components/PurpleBackground'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Modal from 'react-native-modal'

const index = () => {

    var [overlayVisible, setOverlayVisibility] = React.useState(false)
    var [currentOverlayImage, setCurrentOverlayImage] = React.useState()

    const tappedTeam = (image) => {
        setOverlayVisibility(true)
        setCurrentOverlayImage(image)
    }

    return (
        <SafeAreaView style={styles.container}>
            <PurpleBackground style={styles.innerContainer}>
                <View style={styles.mainContainer}>
                    <Text style={styles.titleText}>Pick a Team</Text>
                    <View style={styles.teamContainer}>
                        <TouchableOpacity onPress={() => tappedTeam(require('./img/Team1Picked.png'))}>
                            <Image source={require('./img/Team1Small.png')} style={styles.teamImage} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => tappedTeam(require('./img/Team2Picked.png'))}>
                            <Image source={require('./img/Team2Small.png')} style={styles.teamImage} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => tappedTeam(require('./img/Team3Picked.png'))}>
                            <Image source={require('./img/Team3Small.png')} style={styles.teamImage} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => tappedTeam(require('./img/Team4Picked.png'))}>
                            <Image source={require('./img/Team4Small.png')} style={styles.teamImage} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => tappedTeam(require('./img/Team5Picked.png'))}>
                            <Image source={require('./img/Team5Small.png')} style={styles.teamImage} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    isVisible={overlayVisible}
                    onBackdropPress={() => setOverlayVisibility(false)}
                >
                    <SafeAreaView style={styles.overlayView}>
                        <Image source={currentOverlayImage} style={styles.overlayImage} />
                    </SafeAreaView>
                </Modal>
            </PurpleBackground >
        </SafeAreaView >
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundPurple,
        flex: 1
    },
    mainContainer: {
        zIndex: 100
    },
    titleText: {
        color: colors.white,
        fontSize: fonts.large,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 18
    },
    teamContainer: {
        paddingTop: 20
    },
    teamImage: {
        resizeMode: 'stretch',
        width: Dimensions.get('window').width
    },
    overlayView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    overlayImage: {
        resizeMode: 'contain'
    },
})
