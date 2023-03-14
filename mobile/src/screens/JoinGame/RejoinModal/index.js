import React from 'react';
import { Modal, Text, View } from "react-native"
import RoundButton from "../../../components/RoundButton"
import { ScaledSheet } from "react-native-size-matters"

export default function ReJoinModal({isModalVisible, setIsModalVisible, prevGameData, handleRejoinGame}){

  return(
     <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>We have detected that you were disconnected from an ongoing game.</Text>
            <Text style={styles.modalText}>Would you like to rejoin?</Text>
            <RoundButton
              title="Rejoin Game"
              style={styles.button}
              onPress={() => handleRejoinGame(prevGameData)}>
              <Text style={styles.buttonText}>Rejoin Game</Text>
            </RoundButton>
            <RoundButton
              title="Close Modal"
              style={styles.button}
              onPress={() => setIsModalVisible(!isModalVisible)}>
              <Text style={styles.buttonText}>Close</Text>
            </RoundButton>
          </View>
        </View>
      </Modal>
  )  
}

const styles = ScaledSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 50,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#7D42D1',
    marginTop: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})