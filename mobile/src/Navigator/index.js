import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import JoinGame from "../screens/JoinGame"
import GameSessionContainer from "../Student/containers/GameSessionContainer"
import EnterGameCode from "../Student/screens/EnterGameCode"
import Leaderboard from "../Student/screens/Game/Leaderboard"
import PhaseOneBasicGamePlay from "../Student/screens/Game/PhaseOneBasicGamePlay"
import PhaseTwoBasicGamePlay from "../Student/screens/Game/PhaseTwoBasicGamePlay"
import PhaseResult from "../Student/screens/PhaseResult"
import PregameCountDown from "../Student/screens/PregameCountDown"
import ScorePage from "../Student/screens/ScorePage"
import SelectTeam from "../Student/screens/SelectTeam"
import StartPhase from "../Student/screens/StartPhase"
import StudentGameIntro from "../Student/screens/StudentGameIntro"
import StudentName from "../Student/screens/StudentName"

const Stack = createStackNavigator()

const AppContainer = () => {
    return (
        <GameSessionContainer>
            {({
                gameSession,
                fetchGameSessionByCode,
                team,
                teamMember,
                setTeamInfo,
                teamAvatar,
                loadLocalSession,
                clearLocalSession,
                handleSubscribeToGame,
                handleAddTeam,
                handleAddTeamAnswer,
                handleRejoinSession,
                saveTeamAvatar,
                isRejoin,
                setIsRejoin
            }) => (
                <NavigationContainer >
                    <Stack.Navigator
                        initialRouteName="JoinGame"
                        screenOptions={{
                            headerShown: false,
                            gestureEnabled: false
                        }}
                    >
                        <Stack.Screen name="JoinGame">
                            {(props) => (
                                <JoinGame
                                    {...props}
                                    gameSession={gameSession}
                                    team={team}
                                    teamMember={teamMember}
                                    loadLocalSession={loadLocalSession}
                                    clearLocalSession={clearLocalSession}
                                    handleRejoinSession={handleRejoinSession}
                                    isRejoin={isRejoin}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="EnterGameCode">
                            {(props) => (
                                <EnterGameCode
                                    {...props}
                                    fetchGameSessionByCode={fetchGameSessionByCode}
                                    handleSubscribeToGame={handleSubscribeToGame}
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
                        <Stack.Screen name="SelectTeam">
                            {(props) => (
                                <SelectTeam
                                    {...props}
                                    team={team}
                                    saveTeamAvatar={saveTeamAvatar}
                                    handleAddTeam={handleAddTeam}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="StudentGameIntro">
                            {(props) => (
                                <StudentGameIntro
                                    {...props}
                                    gameSession={gameSession}
                                    teamMember={teamMember}
                                    team={team}
                                    teamAvatar={teamAvatar}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="PregameCountDown">
                            {(props) => (
                                <PregameCountDown
                                    {...props}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="PhaseOneBasicGamePlay">
                            {(props) => (
                                <PhaseOneBasicGamePlay
                                    {...props}
                                    gameSession={gameSession}
                                    teamMember={teamMember}
                                    team={team}
                                    teamAvatar={teamAvatar}
                                    handleAddTeamAnswer={handleAddTeamAnswer}
                                    isRejoin={isRejoin}
                                    setIsRejoin={setIsRejoin}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="StartPhase">
                            {(props) => (
                                <StartPhase
                                    {...props}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="PhaseTwoBasicGamePlay">
                            {(props) => (
                                <PhaseTwoBasicGamePlay
                                    {...props}
                                    gameSession={gameSession}
                                    teamMember={teamMember}
                                    team={team}
                                    teamAvatar={teamAvatar}
                                    handleAddTeamAnswer={handleAddTeamAnswer}
                                    isRejoin={isRejoin}
                                    setIsRejoin={setIsRejoin}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="PhaseResult">
                            {(props) => (
                                <PhaseResult
                                    {...props}
                                    gameSession={gameSession}
                                    teamMember={teamMember}
                                    team={team}
                                    teamAvatar={teamAvatar}
                                    fetchGameSessionByCode={fetchGameSessionByCode}
                                    setTeamInfo={setTeamInfo}
                                    isRejoin={isRejoin}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="ScorePage">
                            {(props) => (
                                <ScorePage
                                    {...props}
                                    gameSession={gameSession}
                                    teamMember={teamMember}
                                    team={team}
                                    teamAvatar={teamAvatar}
                                    clearLocalSession={clearLocalSession}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="Leaderboard">
                            {(props) => (
                                <Leaderboard
                                    {...props}
                                    gameSession={gameSession}
                                    teamMember={teamMember}
                                    team={team}
                                    teamAvatar={teamAvatar}
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