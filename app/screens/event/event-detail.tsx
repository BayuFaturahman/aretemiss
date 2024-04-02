import React, { FC, createRef, useEffect, useRef, useState } from "react"
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    BackHandler,
    Alert,
    ActivityIndicator,
    TouchableOpacity
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, Icon } from "@components"
import { NavigatorParamList } from "@navigators/event-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import { useStores } from "../../bootstrap/context.boostrap"
import { rHeight, rWidth } from "@styles/Spacing"
import { createEventForm } from "./create-event"
import PopUpModal from "./component/popup-modal"
import Loader, { LoadingComponent } from "@components/loader/loader"
import { IEventDetail } from "@services/api/event/response/get-event-detail"
import EventPreviewContainer from "./component/event-preview-container"
import { ScrollView } from "react-native-gesture-handler"
import RNAnimated from "react-native-animated-component"
import ActionSheet from "react-native-actions-sheet"
import { spacing } from "@theme/spacing"
import Toast from "@components/toast/toast"

const EventDetail: FC<StackScreenProps<NavigatorParamList, "eventDetail">> = observer(({ navigation, route }) => {

    const { feedApi, eventApi, eventStore } = useStores()
    const actionSheetRef = useRef<ActionSheet>(null);

    const [loadingDetail, setLoadingDetail] = useState(false)
    const [loadingJoin, setLoadingJoin] = useState(false)
    const [modal, setModal] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [eraseConfirm, setEraseConfirm] = useState(false)
    const [eraseSuccess, setEraseSuccess] = useState(false)
    const [data, setData] = useState<IEventDetail>(null)
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        getEventById()
    }, [])

    const getEventById = async () => {
        let id = route.params.id
        setLoadingDetail(true)
        let res = await eventApi.getEventDetail('id', id)
        let rData = res['response']['data']
        setData(rData)
        setLoadingDetail(false)
    }

    const joinEvent = async () => {
        let id = route.params.id
        setLoadingJoin(true)
        let res = await eventApi.joinEvent(id)
        if(res['response']['data']){
            setModal(!modal)
            getEventById()
            await eventStore.getEvent()
        }
        setLoadingJoin(false)
    }

    const deleteEvent = async () => {
        let id = route.params.id
        setLoadingDetail(true)
        let res = await eventApi.deleteEvent(id)
        if(res['response']['message'] == "Event deleted"){
            await eventStore.getEvent()
            setEraseSuccess(true)
        }
        setLoadingDetail(false)
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={Layout.flex}
        >

            <VStack
                style={{ backgroundColor: Colors.WHITE, flex: 1, }}
                horizontal={Spacing[24]}
            >
                <HStack bottom={rHeight(2)} style={{justifyContent:'space-between',marginTop:rHeight(3)}}>
                    <Text type={"left-header"} style={{}} text="Details Acara Ceria." />
                    <Button type={"light-blue"}
                    text={"◂ Kembali"}
                    style={{ paddingHorizontal: rWidth(3), backgroundColor: 'transparent',}}
                    textStyle={{color: Colors.ABM_DARK_BLUE}}
                    onPress={() => {
                        navigation.goBack()
                    }} />
                </HStack>

                {loadingDetail && <LoadingComponent />}
                
                {data && !loadingDetail && <SafeAreaView style={Layout.flex}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <EventPreviewContainer 
                        type="detail" data={data} dataDetail={data}
                        joinAction={()=>setConfirm(!confirm)}
                        loadingJoin={loadingJoin}
                        deleteAction={()=>setEraseConfirm(!eraseConfirm)}
                        shareAction={()=> setShowToast(!showToast)}
                    />
                    
                    </ScrollView>
                </SafeAreaView>}
            </VStack>
            <RNAnimated appearFrom={"bottom"} animationDuration={500} style={{position: "absolute", bottom: Spacing[12], alignSelf: 'center'}}>
                <HStack
                    alignment={"center"}
                    style={{
                    width: "100%",
                    height: Spacing[96],
                    alignItems: "center",
                    justifyContent: "center",
                    }}
                >
                    <Button type={"primary"} text={"List Partisipan"} textStyle={{fontSize: 18}}
                        style={{ paddingHorizontal: rWidth(5), ...Layout.shadow }}
                        onPress={() => actionSheetRef.current?.show()}
                    />
                </HStack>
            </RNAnimated>

            <ActionSheet ref={actionSheetRef} containerStyle={{borderTopStartRadius: Spacing[20],borderTopEndRadius: Spacing[20]}}>
                <VStack style={{ alignItems:'center', }}>
                    <VStack style={{
                        backgroundColor:'white',
                        width:'100%', 
                        alignItems:'center',
                        borderTopStartRadius: Spacing[20],borderTopEndRadius: Spacing[20],
                        paddingTop:rHeight(2),
                        ...Layout.shadow
                        }}>
                        <Text
                            type="header"
                            text={"List Partisipan"}
                            style={{marginTop:rHeight(1),fontSize:18}}
                            underlineWidth={100}
                        />
                        <Text 
                            type="body-bold"
                            style={{fontSize:17, marginVertical:rHeight(1.5)}}
                        >
                        Total Partisipan:
                        {data && <Text type="body-bold" style={{color:Colors.ABM_LIGHT_BLUE}}> {`${data.attendances.length}`}</Text>}
                        </Text>

                        <TouchableOpacity
                        style={{ position: 'absolute', top: rHeight(2.5), right: rHeight(2.5) }}
                        onPress={()=> actionSheetRef.current?.hide()}
                        >
                            <Icon icon="cross" style={{ width: rHeight(4), height: rHeight(4) }} />
                        </TouchableOpacity>
                    </VStack>

                    
                    <VStack style={{ maxHeight: rHeight(50), minHeight: rHeight(10), width:'100%',}}>
                        <ScrollView style={{marginVertical:rHeight(1)}}>
                            {/* {data && [...data.attendances,...data.attendances,...data.attendances,...data.attendances,...data.attendances,...data.attendances,...data.attendances,...data.attendances,...data.attendances,...data.attendances,...data.attendances,...data.attendances,...data.attendances,...data.attendances].map(e =>  */}
                            {data && data.attendances.map(e => 
                                <Text
                                    type="body-bold" 
                                    style={{fontSize:18, marginVertical: rHeight(1),textAlign:'center'}}
                                    text={e.user.fullname}
                                />
                            )}
                        </ScrollView>
                    </VStack>
                    
                </VStack>
            </ActionSheet>

            <PopUpModal
                type="success"
                title="Sukses!"
                desc="Anda telah berhasil mengikuti Acara Ceria ini!"
                labelButton="Ok!"
                isVisible={modal}
                onConfirm={() => {
                    setModal(!modal)
                }}
                onClose={() => setModal(!modal)}
            />

            <PopUpModal
                type="confirm"
                title="Ikut Acara Ceria."
                desc="Apakah kamu yakin ingin berpartisipasi pada Acara Ceria ini?"
                useCancelButton
                isVisible={confirm}
                onConfirm={() => {
                    setConfirm(!confirm)
                    joinEvent()
                }}
                onClose={() => setConfirm(!confirm)}
            />

            <PopUpModal
                type="confirm"
                title="Kamu Akan menghapus Acara Ceria kamu."
                desc="Acara Ceria kamu akan dihapus. Apakah kamu yakin ingin menghapus Acara Ceria kamu?"
                useCancelButton
                isVisible={eraseConfirm}
                onConfirm={() => {
                    setEraseConfirm(!eraseConfirm)
                    deleteEvent()
                }}
                onClose={() => setEraseConfirm(!eraseConfirm)}
            />

            <PopUpModal
                type="close"
                desc="Acara Ceria telah sukses dihapuskan!"
                labelButton="Kembali ke Acara Ceria"
                isVisible={eraseSuccess}
                onConfirm={() => {
                    setEraseSuccess(!eraseSuccess)
                    navigation.navigate('eventMain', { triggerRefresh: true });
                }}
                onClose={() => setEraseSuccess(!eraseSuccess)}
            />
            <Toast
                showToast={showToast}
                message="Tautan Acara Ceria telah berhasil disalin!"
                type='bottom'
                duration={2000} // Set duration to 3 seconds
                toggleToast={() => setShowToast(!showToast)} // Pass toggleToast function to the Toast component
            />
        </KeyboardAvoidingView>
    )
})

export default EventDetail