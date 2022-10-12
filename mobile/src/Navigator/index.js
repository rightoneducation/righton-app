import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import JoinGame from "../screens/JoinGame"
// import OnboardTeacherRouter from '../screens/OnboardTeacherRouter';
import EnterGameCode from "../Student/screens/EnterGameCode"
import StudentName from "../Student/screens/StudentName"
import StudentChooseTeam from "../Student/screens/StudentChooseTeam"
import StudentGameIntro from "../Student/screens/StudentGameIntro"
import PregameCountDown from "../Student/screens/PregameCountDown"
import BasicGamePlay from "../Student/screens/Game/BasicGamePlay"
import GamePreview from "../Student/screens/Game/GamePreview"
//import TeamInfo from "../Student/screens/Game/GamePlay/TeamInfo"
import GamePlay from "../Student/screens/Game/GamePlay"
import GameAnswerPopular from "../Student/screens/Game/GameAnswer/Popular"
import Leadership from "../Student/screens/Game/Leadership"
import TeacherApp from "../Teacher"
import GameDetailsScreen from "../Teacher/screens/Explore/GameDetails"
import SignIn from "../Auth/screens/SignIn"
import SignUp from "../Auth/screens/SignUp"
import PersonalDetails from "../Auth/screens/PersonalDetails"
import ConfirmAccount from "../Auth/screens/ConfirmAccount"
import GameSessionContainer from "../containers/GameSessionContainer"

const Stack = createStackNavigator()

const AppContainer = () => {
    return (
        <GameSessionContainer>
            {({
                gameSession,
                setGameCode,
                teamId,
                team,
                teamMember,
                setTeamInfo,
            }) => (
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="JoinGame"
                        screenOptions={{
                            headerShown: false,
                        }}
                    >
                        <Stack.Screen name="JoinGame">
                            {(props) => (
                                <JoinGame
                                    {...props}
                                    gameSession={gameSession}
                                    teamId={teamId}
                                    teamMember={teamMember}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="EnterGameCode">
                            {(props) => (
                                <EnterGameCode
                                    {...props}
                                    setGlobalGameCode={setGameCode}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="StudentName">
                            {(props) => (
                                <StudentName
                                    {...props}
                                    gameSession={gameSession}
                                    setTeamInfo={setTeamInfo}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="StudentGameIntro">
                            {(props) => (
                                <StudentGameIntro
                                    {...props}
                                    gameSession={gameSession}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="BasicGamePlay">
                            {(props) => (
                                <BasicGamePlay
                                    {...props}
                                    gameSession={gameSession}
                                    teamId={teamId}
                                    teamMember={teamMember}
                                />
                            )}
                        </Stack.Screen>
                        {/* <Stack.Screen
                            name="GamePreview"
                            component={GamePreview}
                        /> */}
                        {/* <Stack.Screen
                            name="PregameCountDown"
                            component={PregameCountDown}
                        /> */}
                        <Stack.Screen name="Leadership">
                            {(props) => (
                                <Leadership
                                    {...props}
                                    gameSession={gameSession}
                                    teamId={teamId}
                                    teamMember={teamMember}
                                />
                            )}
                        </Stack.Screen>

                        {/* <Stack.Screen
                            name="PersonalDetails"
                            component={PersonalDetails}
                        />
                        <Stack.Screen
                            name="StudentChooseTeam"
                            component={StudentChooseTeam}
                        />
                        <Stack.Screen
                            name="GameDetails"
                            component={GameDetailsScreen}
                        /> */}
                        {/* <Stack.Screen name="GamePlay" component={GamePlay} />
                        <Stack.Screen name="TeamInfo" component={TeamInfo} />
                        <Stack.Screen
                            name="GameAnswerPopular"
                            component={GameAnswerPopular}
                        />
                        <Stack.Screen name="SignIn" component={SignIn} />
                        <Stack.Screen name="SignUp" component={SignUp} />

                        <Stack.Screen
                            name="ConfirmAccount"
                            component={ConfirmAccount}
                        />
                        <Stack.Screen
                            name="TeacherApp"
                            component={TeacherApp}
                        /> */}
                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </GameSessionContainer>
    )
}

export default AppContainer
