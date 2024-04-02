import React, { useState, useEffect } from 'react';
import { View, Modal, ActivityIndicator, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useStores } from '../../../bootstrap/context.boostrap';
import { GetListUserResponse, UserData } from '@services/api/event/response/get-list-user';
import { rHeight } from '@styles/Spacing';
import { Text, Icon, Button } from "@components"

interface UserInvitationProps {
    isVisible: boolean;
    onClose: (selectedUsers: UserData[]) => void;
}

const UserInvitation: React.FC<UserInvitationProps> = ({ isVisible, onClose }) => {
    const { eventApi } = useStores();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await eventApi.getListUser('', page);
            const data: GetListUserResponse = res['response'];
            const newUsers = data.data.filter(newUser => !users.some(user => user.id === newUser.id));
            setUsers((prevUsers) => [...prevUsers, ...newUsers]);
            setTotalPages(data.meta.total_pages);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isVisible) {
            fetchUsers();
        }
    }, [isVisible, page]);

    const handleLoadMore = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePress = (index: number) => {
        if (index !== users.length) {
            const user = users[index];
            const isSelected = selectedUsers.some(selectedUser => selectedUser.id === user.id);
            if (isSelected) {
                setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
            } else {
                setSelectedUsers([...selectedUsers, user]);
            }
        }
    };

    const handleClose = () => {
        onClose(selectedUsers);
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.contentContainer}>
                    <Text type='body-bold' text='Pilih teman kamu untuk diundang!' style={{textAlign:'center', marginBottom:rHeight(1.5)}}/>
                    <View style={{height:1, backgroundColor: 'lightgray', width: '100%'}}/>
                    <FlatList
                        data={users}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handlePress(index)}
                                style={[styles.userContainer, selectedUsers.some(selectedUser => selectedUser.id === item.id) && styles.selected]}
                            >
                                <Text>{item.fullname} - {item.email}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={
                            loading ? <ActivityIndicator style={{ marginVertical: 10 }} /> : null
                        }
                    />
                    <Button type='light-blue' text="Tutup" onPress={handleClose} style={{marginTop:rHeight(2)}}/>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        maxHeight: rHeight(70),
        width: '80%',
    },
    userContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selected: {
        backgroundColor: 'lightblue',
    },
});

export default UserInvitation;
