import React from 'react';
import { Modal, StyleSheet, Text, Pressable, View } from 'react-native';

interface DeleteModalProps {
    modalVisible: boolean,
    setIsModalVisible: any,
    onConfirm: (x: string) => Promise<void>,
    id?: null | string
}
const DeleteModal = ({ modalVisible, setIsModalVisible, onConfirm, id }: DeleteModalProps) => {
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setIsModalVisible(!modalVisible);
            }}>
            <View style={styles.modalBackground}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure you want to delete this group?</Text>
                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setIsModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>No</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => id && onConfirm(id)}
                            >
                                <Text style={styles.textStyle}>Yes</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#000',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default DeleteModal;