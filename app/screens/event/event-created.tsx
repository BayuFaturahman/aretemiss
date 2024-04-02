import React, { FC, useEffect, useRef, useState } from "react"
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    BackHandler,
    Alert,
    View,
    TouchableOpacity
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, BackNavigation, DropDownPicker, DropDownItem } from "@components"
import { NavigatorParamList } from "@navigators/event-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import { useStores } from "../../bootstrap/context.boostrap"
import { rHeight, rWidth } from "@styles/Spacing"
import { createEventForm } from "./create-event"
import PopUpModal from "./component/popup-modal"
import EventPreviewContainer from "./component/event-preview-container"
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { presets } from "@components/text/text.presets"
import { SearchIcon, ShareIcon } from "@assets/svgs"
import UserInvitation from "./component/user-invitation"
import Toast from "@components/toast/toast"
import ActionSheet from "react-native-actions-sheet"
import { UserData } from "@services/api/event/response/get-list-user"
import { ScrollView } from "react-native-gesture-handler"
import Loader from "@components/loader/loader"

const EventCreated: FC<StackScreenProps<NavigatorParamList, "eventCreated">> = observer(({ navigation }) => {

    const { feedApi, eventApi, eventStore } = useStores()

    const [loading, setLoading] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [success, setSuccess] = useState(false)
    const [modal, setModal] = useState(false)

    const [selected, setSelected] = useState<UserData[]>([]);

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    const submit = async () => {
        try {
            setConfirm(!confirm)
            setLoading(true)
            let payload = selected.map(e => e.id)
            let res = await eventApi.invitationEvent(eventStore.eventData.id, payload)
            setLoading(false)
            if(res['kind'] == 'ok'){
                setSuccess(true)
            }
        } catch (error) {
            setLoading(false)
        }
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={Layout.flex}
        >
            {loading && <Loader />}
            <VStack
                style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
                horizontal={Spacing[24]}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                {eventStore.eventData && <SafeAreaView style={Layout.flex}>
                    <Spacer height={Spacing[20]} />
                    <HStack bottom={rHeight(4)} style={{ justifyContent: 'space-between' }}>
                        <View>
                            <Text type={"left-header"} underlineWidth={rWidth(25)} text="Acara Ceria." />
                        </View>

                        <Button type={"light-blue"}
                            text={"◂ Kembali Ke Main Menu"}
                            style={{ paddingHorizontal: rWidth(3), backgroundColor: 'transparent' }}
                            textStyle={{ color: Colors.ABM_DARK_BLUE }}
                            onPress={() => {
                                navigation.reset({
                                    routes: [{ name: 'homepage' }]
                                })
                            }} />
                    </HStack>

                    <Text type={"header"} style={{ fontSize: 22 }} underlineWidth={rWidth(75)} text="Hore! Acara Ceria berhasil dibuat!" />
                    <Text type={"body"} style={{ textAlign: 'center', fontSize: 16, marginBottom: rHeight(2) }} text="Bagikan acara ceria ini ke rekan-rekan Anda atau undang rekan-rekan Anda untuk ikut di event ini sekarang!" />

                    <EventPreviewContainer
                        type="preview"
                        data={eventStore.eventData}
                        showShareButton
                        shareAction={()=>setShowToast(!showToast)}
                    />

                    <Text type="body-bold" text='Undang' style={{ marginTop: rHeight(1.5) }} />
                    <TouchableOpacity
                        // onPress={()=>actionSheetRef.current?.show()
                        onPress={() => setModal(!modal)}
                    >
                        <HStack style={{
                            marginBottom: rHeight(1.5), marginTop: rHeight(1),
                            borderWidth: 2, borderRadius: 10, borderColor: 'black',
                            paddingHorizontal: rWidth(4), paddingVertical: rHeight(1),
                            justifyContent: 'space-between'
                        }}>
                            <Text text="Undang" />
                            <SearchIcon height={rHeight(3)} width={rHeight(3)} />
                        </HStack>
                    </TouchableOpacity>

                    {selected.length > 0 && <View style={{
                        backgroundColor: Colors.ABM_BG_BLUE,
                        padding: rWidth(3),
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: Colors.ABM_DARK_BLUE,
                        marginBottom: rHeight(2)
                    }}>
                        <Text style={{marginBottom:rHeight(1)}}>
                            <Text
                                type="body-bold"
                                text="Kamu Akan Mengundang: "
                            />
                            {selected.map((e, index) => index > 0 ? `, ${e.nickname}` : `${e.nickname}`)}
                        </Text>
                        <Button
                            type="primary"
                            text="Kirim Undangan"
                            onPress={()=>setConfirm(!confirm)}
                        />
                    </View>}

                </SafeAreaView>}
                </ScrollView>
            </VStack>
            <PopUpModal
                type="confirm"
                isVisible={confirm}
                // title="Kamu akan mengundang teman-temanmu ke Acara Ceria."
                desc="Apakah kamu yakin ingin mengundang teman-temanmu ke Acara Ceria ini?"
                onConfirm={() => submit()}
                onClose={() => setConfirm(!confirm)}
                useCancelButton
            />
            <PopUpModal
                type="success"
                title="Sukses!"
                desc="Anda telah berhasil mengundang rekan-rekan anda!"
                labelButton="Ok!"
                isVisible={success}
                onConfirm={() => {
                    setSuccess(!success)
                }}
                onClose={() => setSuccess(!success)}
            />
            <Toast
                showToast={showToast}
                message="Tautan Acara Ceria telah berhasil disalin!"
                type='bottom'
                duration={2000} // Set duration to 3 seconds
                toggleToast={() => setShowToast(!showToast)} // Pass toggleToast function to the Toast component
            />
            <UserInvitation
                isVisible={modal}
                onClose={(v: UserData[]) => {
                    setModal(!modal)
                    setSelected(v)
                }}
            />
        </KeyboardAvoidingView>
    )
})

export default EventCreated