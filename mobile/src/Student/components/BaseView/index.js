import { SafeAreaView, StyleSheet } from 'react-native'
import PurpleBackground from '../../../components/PurpleBackground'
import { colors } from '../../../utils/theme'

const BaseView = ({ children, style }) => {
    return (
        <SafeAreaView style={styles.container}>
            <PurpleBackground style={{ ...styles.background, ...style }}>
                {children}
            </PurpleBackground>
        </SafeAreaView>
    )
}

export default BaseView

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundPurple,
        flex: 1,
    },
    background: {
        width: '100%',
        height: '100%',
    }
})