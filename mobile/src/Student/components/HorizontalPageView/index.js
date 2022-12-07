import React, { useState } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import Carousel from 'react-native-snap-carousel'

const HorizontalPageView = ({ children, initialPage }) => {
    const [currentPage, setCurrentPage] = useState(initialPage || 0)
    const renderItem = ({ item, index }) => {
        return <React.Fragment key={index}>
            {item}
        </React.Fragment>
    }

    const pageIndicators = children.map((_child, index) => {
        return <Image
            key={index}
            source={
                currentPage == index ?
                    require('../../../assets/images/PageIndicatorActive.png') :
                    require('../../../assets/images/PageIndicatorInactive.png')}
            style={styles.pageIndicator}
        />
    })

    return (
        <View style={styles.mainContainer}>
            <Carousel
                layout={'default'}
                data={children}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Math.max(scale(275), Dimensions.get('window').width - moderateScale(50))}
                renderItem={renderItem}
                onSnapToItem={index => setCurrentPage(index)}
                firstItem={initialPage || 0}
            />
            <View style={styles.pageIndicatorContainer}>
                {pageIndicators}
            </View>
        </View>
    )
}

export default HorizontalPageView

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    pageIndicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: verticalScale(10),
        marginTop: verticalScale(5),
    },
    pageIndicator: {
        marginLeft: 5,
        marginRight: 5,
        width: 20,
        resizeMode: 'contain'
    },
})
