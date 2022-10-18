import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import ConfirmAccount from "../Auth/screens/ConfirmAccount"
import PersonalDetails from "../Auth/screens/PersonalDetails"
import SignIn from "../Auth/screens/SignIn"
import SignUp from "../Auth/screens/SignUp"
import GameSessionContainer from "../containers/GameSessionContainer"
import JoinGame from "../screens/JoinGame"
import EnterGameCode from "../Student/screens/EnterGameCode"
import StudentName from "../Student/screens/StudentName"
import StudentGameIntro from "../Student/screens/StudentGameIntro"
import PregameCountDown from "../Student/screens/PregameCountDown"
import BasicGamePlay from "../Student/screens/Game/BasicGamePlay"
import Leadership from "../Student/screens/Game/Leadership"

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
                        <Stack.Screen
                            name="PregameCountDown"
                            component={PregameCountDown}
                        />

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
                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </GameSessionContainer>
    )
}

export default AppContainer
