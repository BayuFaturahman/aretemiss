import React, { FC, useEffect, useState } from "react"
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    BackHandler,
    Alert
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button } from "@components"
import { NavigatorParamList } from "@navigators/event-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import { useStores } from "../../bootstrap/context.boostrap"
import { rHeight, rWidth } from "@styles/Spacing"
import { createEventForm } from "./create-event"
import PopUpModal from "./component/popup-modal"
import EventPreviewContainer from "./component/event-preview-container"
import Loader from "@components/loader/loader"

const EventPreview: FC<StackScreenProps<NavigatorParamList, "eventPreview">> = observer(({ navigation }) => {

    const { feedApi, eventApi, eventStore } = useStores()

    const [loading, setLoading] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [cancel, setCancel] = useState(false)
    const [close, setClose] = useState(false)

    useEffect(() => {
        // const backAction = () => {
        //     return true;
        // };
        // const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        // return () => backHandler.remove();
    }, []);

    const submit = async () => {
        setConfirm(!confirm)
        await uploadImage();
        await submitEvent();
        // navigation.navigate('eventCreated')
    }

    const uploadImage = async () => {
        let data = eventStore.eventData
        const form = new FormData();
        const file = {
            ...data.posterImg,
            uri: Platform.OS === "android" ? data.posterImg.uri : data.posterImg.uri.replace("file://", ""),
            name: `event-image-${new Date().getTime()}-${data.posterImg.fileName}`,
            type: data.posterImg.type,
            size: data.posterImg.fileSize,
        }
        // @ts-ignore
        form.append('files', file)
        console.log(file)
        console.log(form)

        console.log("Upload Photo")
        setLoading(true)
        try {
            const result = await feedApi.PostUploadFeedImages(form)
            console.log(result)
            if (result.kind === "form-error") {
                // this.coachingFailed(result.response.errorCode)
            }
            if (result.kind === "ok") {
                eventStore.setEventData({
                    ...eventStore.eventData,
                    posterUrl: result.response.data['urls']
                })
                return result.response;
            }
        } catch (e) {
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const submitEvent = async () => {
        try {
            let data = eventStore.eventData
            let payload: createEventForm = {
                name: data.name,
                startTime: data.startTime,
                endTime: data.endTime,
                implementation: data.implementation,
                location: data.location,
                locationDetail: data.locationDetail,
                timezone: data.timezone,
                hashtag: data.hashtag,
                description: data.description,
                categoryIds: data.categoryIds,
                typeId: data.typeId,
                posterUrl: data.posterUrl,
            };
            let result = await eventApi.postCreateEvent(payload)
            console.log(result)
            console.log(result)
            if (result.kind === "form-error") {
                Alert.alert('Info', result.response.message)
            }
            if (result.kind === "ok") {
                eventStore.setEventData({
                    ...eventStore.eventData,
                    id: result.response.data.id
                })
                navigation.reset({
                    routes: [{ name: 'eventCreated' }]
                })
                return result.response;
            }
        } catch (e) {
            setLoading(false)
        } finally {
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
                {eventStore.eventData && <SafeAreaView style={Layout.flex}>
                    <Spacer height={Spacing[20]} />
                    <HStack bottom={rHeight(4)}>
                        <Text type={"left-header"} style={{}} text="Preview Acara Ceria." />
                        <Spacer />
                        <HStack>
                            <Button type={"light-blue"} text={"Ganti Detail"} style={{ paddingHorizontal: rWidth(3) }}
                                onPress={() => navigation.goBack()} />
                        </HStack>
                    </HStack>

                    <EventPreviewContainer type="preview" data={eventStore.eventData}/>
                    

                    <HStack top={rHeight(2)} style={{ justifyContent: 'space-between' }}>
                        <Button type={"warning"} text={"Batal"} style={{ paddingHorizontal: rWidth(3), width: '48%' }}
                            onPress={() => setCancel(!cancel)}
                        />

                        <Button type={"primary"} text={"Buat Acara Ceria"} style={{ paddingHorizontal: rWidth(3), width: '48%' }}
                            onPress={() => setConfirm(!confirm)}
                        />
                    </HStack>

                </SafeAreaView>}
            </VStack>
            <PopUpModal
                type="confirm"
                isVisible={confirm}
                title="Kamu akan membuat Acara Ceria."
                desc="Acara Ceria kamu akan dibuat. Apakah kamu yakin ingin membuat Acara Ceria?"
                onConfirm={() => submit()}
                onClose={() => setConfirm(!confirm)}
                useCancelButton
            />
            <PopUpModal
                type="cancel"
                isVisible={cancel}
                title="Kamu akan membatalkan pembuatan Acara."
                desc="Acara Ceria kamu akan dihapus. Apakah kamu yakin ingin membatalkan pembuatan Acara?"
                onConfirm={() => {
                    setCancel(!cancel)
                    setClose(true)
                }}
                onClose={() => setCancel(!cancel)}
                useCancelButton
            />
            <PopUpModal
                type="close"
                desc="Acara Ceria telah sukses dibatalkan!"
                labelButton="Kembali ke Acara Ceria"
                isVisible={close}
                onConfirm={() => {
                    navigation.reset({
                        routes: [{ name: 'homepage' }, { name: 'eventMain' }]
                    })
                }}
                onClose={() => setClose(!close)}
            />
        </KeyboardAvoidingView>
    )
})

export default EventPreview