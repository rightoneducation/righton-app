import React from 'react';
import { Modal, Text, View } from "react-native"
import RoundButton from "../../../components/RoundButton"
import { ScaledSheet } from "react-native-size-matters"

export default function ReJoinModal({ isModalVisible, setIsModalVisible, prevGameData, handleRejoinSession, clearLocalSession }){

  return(
    <View>
      <Modal
        animationType='fade'
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => {
          setIsModalVisible(false)
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>We have detected that you were disconnected from an ongoing game.</Text>
            <Text style={styles.modalText}>Would you like to rejoin?</Text>
            <RoundButton
              title="Rejoin Game"
              style={styles.button}
              onPress={() => {
                handleRejoinSession(prevGameData).then(
                  setIsModalVisible(false)
                )
              }}>
            </RoundButton>
            <RoundButton
              title="Close"
              style={styles.button}
              onPress={() => {
                clearLocalSession().then(
                  setIsModalVisible(false)
                )
              }}>
            </RoundButton>
          </View>
        </View>
    </Modal>
  </View>
  )  
}

const styles = ScaledSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:5,
    elevation: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 50,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 6,
    elevation: 3,
  },
  button: {
    borderRadius: 20,
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