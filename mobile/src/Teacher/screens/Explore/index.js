import React, { Fragment, useState, useEffect } from 'react'
import {
  ScrollView,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { colors, deviceWidth, fonts, fontFamilies } from '../../../utils/theme'
import debug from '../../../utils/debug'
import NavBarView from './NavBarView'
import ContentItem from './ContentItem'
import { createStackNavigator } from '@react-navigation/stack'
import { listGames } from '../../../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import { FlatList } from 'react-native-gesture-handler'
// import API from '../../../backend'
import gamesList from './data.json'
import DetailScreen from './DetailScreen'

const ExploreScreen = ({ props, navigation }) => {

  const Mode = {
    loading: 'loading',
    succeeded: 'succeeded',
    failed: 'failed',
  }

  const [mode, setMode] = useState(Mode.loading)
  const [games, setGames] = useState([])
  
  useEffect(() => {
    const fetchGames = () => {
        setGames(gamesList.data.listGames.items)
        setMode(Mode.succeeded)
    }
    fetchGames()
  }, [])

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#003668' }} />
      <SafeAreaView style={styles.mainContainer}>
        <NavBarView title="Explore" avatar={require("../../../assets/images/profile.png")} showHamBurgerMenu={true} />
        {mode == Mode.loading ? <ActivityIndicator /> : (
          <FlatList
            style={styles.content}
            data={games}
            keyExtractor={({ GameID }) => GameID}
            renderItem={({ item, index }) => (
              <ContentItem
                category={item.grade || "General"} 
                title={item.title || "No Title"} 
                body={item.description || "No Description"} 
                style={styles.contentItem}
                key={index}
                onPress={() => {
                    navigation.navigate("GameDetails", {game: item})
               }} 
              />
            )}
          />
        )}
      </SafeAreaView>
    </Fragment>
  )
}

export default ExploreScreen

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#F9F9F9',
    flex: 1,
  },
  content: {
    marginTop: 18,
    paddingBottom: 40,
  },
  contentItem: {
    marginStart: 25,
    marginEnd: 25,
    marginBottom: 12
  }
})