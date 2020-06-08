import React, { Fragment } from 'react';
import {
  ActivityIndicator,
  // Image,
  ScrollView,
  StatusBar,
  Text,
  View,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { colors, deviceWidth, fonts, fontFamilies } from '../../../utils/theme'
import debug from '../../../utils/debug'
import NavBarView from './NavBarView'
import ContentItem from './ContentItem'
import { createStackNavigator } from '@react-navigation/stack'

const ExploreStack = createStackNavigator()

const ExploreStackScreen = () => {
  return (
    <ExploreStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <ExploreStack.Screen name="ExploreScreen" component={ExploreScreen} />
    </ExploreStack.Navigator>
  )
}

const ExploreScreen = ({ props, navigation }) => {
  const onGameSelected = () => {
    navigation.navigate("GameDetails")
  }
  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#003668' }} />
      <SafeAreaView style={styles.mainContainer}>
        <NavBarView title="Explore" avatar={require("../../../assets/images/profile.png")} />
        <ScrollView>
          <View style={styles.content}>
            <ContentItem category="GENERAL" title="Fun Facts about Food" body="Things you might not know about foods you eat." style={{ marginBottom: 12 }} onPress={onGameSelected} />
            <ContentItem category="GENERAL" title="International Trivia" body="Fun facts around the world." style={{ marginBottom: 12 }} />
            <ContentItem category="7.RP.A.3" title="Practicing Percents: Let’s go Shopping!" body="User promotional relationships to solve multi-step ratio percent problems. Examples: simple interest, tax, markups and markdowns, gratuities and commissions." style={{ marginBottom: 12 }} />
            <ContentItem category="GENERAL" title="Fun Facts about Food" body="Things you might not know about foods you eat." style={{ marginBottom: 12 }} />
            <ContentItem category="GENERAL" title="International Trivia" body="Fun facts around the world." style={{ marginBottom: 12 }} />
            <ContentItem category="7.RP.A.3" title="Practicing Percents: Let’s go Shopping!" body="User promotional relationships to solve multi-step ratio percent problems. Examples: simple interest, tax, markups and markdowns, gratuities and commissions." style={{ marginBottom: 12 }} />
            <ContentItem category="GENERAL" title="Fun Facts about Food" body="Things you might not know about foods you eat." style={{ marginBottom: 12 }} />
            <ContentItem category="GENERAL" title="International Trivia" body="Fun facts around the world." style={{ marginBottom: 12 }} />
            <ContentItem category="7.RP.A.3" title="Practicing Percents: Let’s go Shopping!" body="User promotional relationships to solve multi-step ratio percent problems. Examples: simple interest, tax, markups and markdowns, gratuities and commissions." style={{ marginBottom: 12 }} />
            <ContentItem category="GENERAL" title="Fun Facts about Food" body="Things you might not know about foods you eat." style={{ marginBottom: 12 }} />
            <ContentItem category="GENERAL" title="International Trivia" body="Fun facts around the world." style={{ marginBottom: 12 }} />
            <ContentItem category="7.RP.A.3" title="Practicing Percents: Let’s go Shopping!" body="User promotional relationships to solve multi-step ratio percent problems. Examples: simple interest, tax, markups and markdowns, gratuities and commissions." style={{ marginBottom: 12 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment >
  )
}

export default ExploreStackScreen

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#F9F9F9',
    flex: 1,
  },
  content: {
    marginStart: 25,
    marginEnd: 25,
    marginTop: 18,
    marginBottom: 18,
  }
})