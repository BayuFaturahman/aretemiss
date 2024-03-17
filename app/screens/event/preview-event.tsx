import React, { createRef, FC, useCallback, useEffect, useState } from "react"
import {
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleProp,
    TouchableOpacity,
    View,
    StyleSheet,
    ActivityIndicator,
    Image,
    Linking,
    BackHandler,
    Alert
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField, DropDownPicker, DropDownItem, Icon } from "@components"
import { NavigatorParamList } from "@navigators/acara-ceria-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import SelectBox from "react-native-multi-selectbox"
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPickerr, { ItemType } from 'react-native-dropdown-picker';

import FastImage from "react-native-fast-image"
import { launchImageLibrary, ImagePickerResponse, launchCamera, Asset } from "react-native-image-picker"
import { useStores } from "../../bootstrap/context.boostrap"

import insertPict from "@assets/icons/feed/insertPict.png"
import ActionSheet from "react-native-actions-sheet/index"

import Spinner from "react-native-loading-spinner-overlay"
import { FieldArray, Formik } from "formik"
import { debounce } from "lodash";

import { createThumbnail } from "react-native-create-thumbnail";
import moment from "moment"
import { Calendar } from "@components/calendar/calendar"
import { keys } from "mobx"
import { spacing } from "@theme/spacing"
import { typography } from "@theme/typography"
import { deviceWidth, rHeight, rWidth } from "@styles/Spacing"
import CheckBoxComponent from "@components/checkbox/multiple_checkbox"
import { FeedApi } from "@services/api/feed/feed-api"
import { Api } from "@services/api"
import { createEventForm } from "./create-event"
import Modal from "react-native-modalbox"
import PopUpModal from "./component/popup-modal"
import { Data } from "@services/api/event/event-api.types"

const PreviewEvent: FC<StackScreenProps<NavigatorParamList, "createEvent">> = observer(({ route, navigation }) => {

    const params = route.params;
    const { feedApi, eventApi } = useStores()
    const [data, setData] = useState<createEventForm>(null);

    const [loading, setLoading] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [cancel, setCancel] = useState(false)
    const [close, setClose] = useState(false)

    useEffect(() => {
        if (params) {
            console.log(params['data'])
            setData(params['data'])
        }
    }, [])

    useEffect(() => {
        const backAction = () => {
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);

    const loadInBrowser = (url) => {
        if (url) {
            let checkhttp = url.slice(0, 7);
            let checkhttps = url.slice(0, 8);
            if (checkhttps == 'https://' || checkhttp == 'http://') {
                Linking.openURL(url)
            } else {
                Linking.openURL('https://' + url)
            }
        }
    };

    const submit = async () => {
        setConfirm(!confirm)
        console.log(data)
        await uploadImage();
        await submitEvent();
    }

    const uploadImage = async () => {
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
                setData({
                    ...data,
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
                
            }
            if (result.kind === "ok") {
                Alert.alert(
                    'Success', 'Event Berhasil Dibuat',
                    [
                        {text: 'OK',
                        onPress: () => {
                            navigation.reset({
                                routes: [{ name: 'homepage' }]
                            })
                        }},
                    ],
                    { cancelable: false },
                );
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
            <VStack
                style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
                horizontal={Spacing[24]}
            >
                {data && <SafeAreaView style={Layout.flex}>
                    <Spacer height={Spacing[20]} />
                    <HStack>
                        <Text type={"left-header"} style={{}} text="Preview Acara Ceria." />
                        <Spacer />
                        <HStack>
                            <Button type={"light-blue"} text={"Ganti Detail"} style={{ paddingHorizontal: rWidth(3) }}
                                onPress={() => navigation.goBack()} />
                        </HStack>
                    </HStack>

                    <HStack top={rHeight(4)}>
                        <Image
                            source={{ uri: data.posterImg.uri }}
                            style={{
                                // backgroundColor:'red',
                                // width:rWidth(40),
                                // height:rHeight(40),
                                width: '45%', // Set the width to 80% of the container width
                                aspectRatio: 3 / 4,
                                resizeMode: 'stretch'
                            }}
                        />
                        <VStack style={{
                            // backgroundColor:'red',
                            width: rWidth(45),
                            // alignItems:'center',
                            marginLeft: rWidth(4),
                            paddingRight: rWidth(4),
                        }}>
                            <Text
                                type="body-bold"
                                text={data.name}
                                style={{ fontSize: 19, marginBottom: 10 }}
                            />
                            <Text
                                type="label"
                                text={`${moment(data.startTime).format('DD MMM YYYY, HH.mm')} s/d \n${moment(data.endTime).format('DD MMM YYYY, HH.mm')}`}
                                style={{ fontSize: 15 }}
                            />

                            {data.implementation == 'offline' && <Text
                                type="label"
                                text={data.locationDetail}
                                style={{ fontSize: 15 }}
                            />}

                            <TouchableOpacity
                                onPress={() => loadInBrowser(data.location)}
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Icon icon={'link'} style={{ width: 18, height: 18, marginEnd: 5 }} />
                                <Text
                                    type="label"
                                    // text={'asdojaskldjasdkjasldkajlsdka'}
                                    text={data.location.length > 23 ? `${data.location.slice(0, 23)}...` : data.location}
                                    style={{ fontSize: 15, textDecorationLine: 'underline' }}
                                />
                            </TouchableOpacity>

                            <Text
                                type="left-header"
                                text={data.hashtag}
                                underlineWidth={data.hashtag.length * deviceWidth / 40}
                            // style={{fontSize:20}}
                            />
                        </VStack>
                    </HStack>

                    <VStack top={rHeight(4)}>
                        <View style={{
                            backgroundColor: Colors.ABM_BG_BLUE,
                            padding: spacing[4],
                            borderRadius: Spacing[20],
                            borderWidth: 2,
                            borderColor: Colors.ABM_DARK_BLUE
                        }}>
                            <Text text={data.description} />


                            <Text style={{ marginTop: rHeight(2) }}>
                                <Text type="body-bold" text={'Kategori: '} />
                                {data.kategory.map((e, index) => index > 0 ? `, ${e.name}` : `${e.name}`)}
                            </Text>

                            <Text>
                                <Text type="body-bold" text={'Tipe Kegiatan: '} />
                                {data.tipeKegiatan['label']}
                            </Text>

                        </View>
                    </VStack>

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
                onConfirm={() => submit()}
                onClose={() => setConfirm(!confirm)}
            />
            <PopUpModal
                type="cancel"
                isVisible={cancel}
                onConfirm={() => {
                    setCancel(!cancel)
                    setClose(true)
                }}
                onClose={() => setCancel(!cancel)}
            />
            <PopUpModal
                type="close"
                isVisible={close}
                onConfirm={() => {
                    navigation.reset({
                        routes: [{ name: 'homepage' }]
                    })
                }}
                onClose={() => setClose(!close)}
            />
        </KeyboardAvoidingView>
    )
})

export default PreviewEvent