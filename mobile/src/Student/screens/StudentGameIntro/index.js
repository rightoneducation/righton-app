import ViewPager from "@react-native-community/viewpager"
import { useState } from "react"
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { moderateScale } from "react-native-size-matters"
import PurpleBackground from "../../../components/PurpleBackground"
import { colors, fontFamilies, fonts } from "../../../utils/theme"
import IntroInfo from "./IntroInfo"

const StudentGameIntro = () => {
    const [currentPage, setCurrentPage] = useState(0)

    const onPageSelected = (event) => {
        setCurrentPage(event.nativeEvent.position)
    }

    return (
        <SafeAreaView style={styles.container}>
            <PurpleBackground style={styles.mainContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTeam}>How to Play!</Text>
                </View>
                <View style={styles.carouselContainer}>
                    <ViewPager
                        style={styles.carousel}
                        initialPage={currentPage}
                        orientation="horizontal"
                        onPageSelected={onPageSelected}
                    >
                        <IntroInfo
                            key="1"
                            screen={1}
                            Monsters={[require("./img/MonsterStep1.png"), null]}
                            sticker={require("./img/Phase1Sticker.png")}
                            phone={require("./img/IntroStep1Phone.png")}
                            text="Read the multiple-choice question"
                        />
                        <IntroInfo
                            key="2"
                            screen={2}
                            Monsters={[null, require("./img/MonsterStep2.png")]}
                            sticker={require("./img/Phase1Sticker.png")}
                            phone={require("./img/IntroStep2Phone.png")}
                            text="Gain points by choosing the correct answer..."
                        />
                        <IntroInfo
                            key="3"
                            screen={3}
                            Monsters={[require("./img/MonsterStep3Left.png"), require("./img/MonsterStep3Right.png")]}
                            sticker={require("./img/Phase1Sticker.png")}
                            phone={require("./img/IntroStep3Phone.png")}
                            text="Read step-by-step solutions"
                        />
                        <IntroInfo
                            key="4"
                            screen={4}
                            Monsters={[null, require("./img/MonsterStep4.png")]}
                            sticker={require("./img/Phase1Sticker.png")}
                            phone={require("./img/IntroStep4Phone.png")}
                            text="Gain more points by guessing the most popular incorrect answer!"
                        />
                        <IntroInfo
                            key="5"
                            screen={5}
                            Monsters={[null, require("./img/MonsterStep5.png")]}
                            sticker={require("./img/Phase1Sticker.png")}
                            phone={require("./img/IntroStep5Phone.png")}
                            text="The most total points wins!"
                        />
                    </ViewPager>
                    <View style={styles.pageIndicatorContainer}>
                        <Image
                            source={
                                currentPage == 0
                                    ? require("../../../assets/images/PageIndicatorActive.png")
                                    : require("../../../assets/images/PageIndicatorInactive.png")
                            }
                            style={styles.pageIndicator}
                        />
                        <Image
                            source={
                                currentPage == 1
                                    ? require("../../../assets/images/PageIndicatorActive.png")
                                    : require("../../../assets/images/PageIndicatorInactive.png")
                            }
                            style={styles.pageIndicator}
                        />
                        <Image
                            source={
                                currentPage == 2
                                    ? require("../../../assets/images/PageIndicatorActive.png")
                                    : require("../../../assets/images/PageIndicatorInactive.png")
                            }
                            style={styles.pageIndicator}
                        />
                        <Image
                            source={
                                currentPage == 3
                                    ? require("../../../assets/images/PageIndicatorActive.png")
                                    : require("../../../assets/images/PageIndicatorInactive.png")
                            }
                            style={styles.pageIndicator}
                        />
                        <Image
                            source={
                                currentPage == 4
                                    ? require("../../../assets/images/PageIndicatorActive.png")
                                    : require("../../../assets/images/PageIndicatorInactive.png")
                            }
                            style={styles.pageIndicator}
                        />
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerNote}>
                        Waiting for the game to start...
                    </Text>
                </View>
            </PurpleBackground>
        </SafeAreaView>
    )
}

export default StudentGameIntro

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundPurple,
        flex: 1,
    },
    mainContainer: {
        zIndex: 100,
        paddingTop: 21,
        flex: 1,
        flexDirection: "column",
    },
    header: {},
    headerTeam: {
        color: colors.white,
        fontFamily: fontFamilies.montserratBold,
        fontSize: 42,
        textAlign: "center",
    },
    headerTeamNo: {
        color: colors.white,
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.xxxLarge,
        textAlign: "center",
    },
    carouselContainer: {
        flex: 1,
        flexDirection: "column",
        marginBottom: 37,
        marginTop: 40,
        justifyContent: "space-between"
    },
    carousel: {
        flex: 1,
    },
    pageIndicatorContainer: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "center",
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
    },
    pageIndicator: {
        marginLeft: 5,
        marginRight: 5,
        width: 20,
        resizeMode: "contain",
    },
    footer: {
        marginBottom: moderateScale(30),
    },
    footerNote: {
        fontFamily: fontFamilies.karlaBold,
        fontSize: fonts.xxsmall,
        color: "white",
        textAlign: "center",
    },
})
