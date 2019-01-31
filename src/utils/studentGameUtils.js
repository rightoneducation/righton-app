export function handleExitGame(handleSetAppState, IOTUnsubscribeFromTopic, navigation) {
  handleSetAppState('gameState', {});
  IOTUnsubscribeFromTopic();
  setTimeout(() => {
    navigation.navigate('Dashboard');
    handleSetAppState('GameRoomID', '');
    handleSetAppState('team', '');
  }, 250);
}

export function hello() {
  console.log('hello world');
}
