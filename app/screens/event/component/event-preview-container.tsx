import React, { useState } from "react"
import { Alert, Image, Linking, NativeModules, Platform, TouchableOpacity, View } from "react-native"
import { HStack, VStack } from "@components/view-stack"
import { deviceWidth, rHeight, rWidth } from "@styles/Spacing"
import { Colors, Spacing } from "@styles/index"
import { Text, Icon, Button } from "@components"
import { createEventForm } from "../create-event"
import moment from "moment"
import { spacing } from "@theme/spacing"
import { useStores } from "../../../bootstrap/context.boostrap"
import { IEventDetail } from "@services/api/event/response/get-event-detail"
import { ShareIcon, UserIcon } from "@assets/svgs"
import Clipboard from '@react-native-clipboard/clipboard';
// import Clipboard from '@react-native-community/clipboard';
import { LoadingComponent } from "@components/loader/loader"
import { ActivityIndicator } from "react-native"
import Share, { ShareOptions } from 'react-native-share';

interface EventPreviewContainerProps {
    data?:  IEventDetail | createEventForm
    dataDetail?: IEventDetail
    type: 'detail' | 'preview'
    showShareButton?: boolean
    joinAction?: any
    loadingJoin?: boolean
    deleteAction?: any
    shareAction?: any
}

const { ClipboardModule } = NativeModules;

const EventPreviewContainer: React.FC<EventPreviewContainerProps> = (props) => {
    const { eventStore, eventApi } = useStores()
    // const ClipboardModule = NativeModules.ClipboardModule;

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

    const getNameList = (id:string, type:string) => {
        let label = ''
        let list = type == 'category-event' ? eventStore.listCategory : eventStore.listType
        list.map((e) => {
            if(e.id == id){
                label = e.name
            }
        })
        return label
    }

    const share = () => {
        // ClipboardModule.copyToClipboard(props.data.location);
        
        // Clipboard.setString(props.data.location);
        Share.open({title: props.data.name, message: props.data.location})
        props.shareAction && props.shareAction()
    }

    return <>
        <HStack>
            <Image
                source={{ uri: props.type == 'detail' ? `https://ilead.id/storage/development/file/image/${props.data.posterUrl}` : props.data['posterImg'].uri }}
                style={{
                    width: '45%',
                    aspectRatio: 3 / 4,
                    resizeMode: 'stretch'
                }}
            />
            <VStack style={{
                width: rWidth(45),
                marginLeft: rWidth(4),
                paddingRight: rWidth(4),
            }}>
                <Text
                    type="body-bold"
                    text={props.data.name}
                    style={{ fontSize: 19, marginBottom: 10 }}
                />
                <Text
                    type="label"
                    text={`${moment(props.data.startTime).format('DD MMM YYYY, HH.mm')} s/d \n${moment(props.data.endTime).format('DD MMM YYYY, HH.mm')}`}
                    style={{ fontSize: 15 }}
                />

                {props.data.implementation == 'offline' && <Text
                    type="label"
                    text={props.data.locationDetail}
                    style={{ fontSize: 15, marginTop: rHeight(0.5)}}
                />}

                <TouchableOpacity
                    onPress={() => loadInBrowser(props.data.location)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <Icon icon={'link'} style={{ width: 18, height: 18, marginEnd: 5, marginVertical: rHeight(1)}} />
                    <Text
                        type="label"
                        text={props.data.location.length > 23 ? `${props.data.location.slice(0, 23)}...` : props.data.location}
                        style={{ fontSize: 15, textDecorationLine: 'underline' }}
                    />
                </TouchableOpacity>
                {
                props.loadingJoin ? <ActivityIndicator size={30} color={Colors.ABM_DARK_BLUE}/>
                : props.type == 'detail' && props.dataDetail.isMe ?
                <VStack>
                    <Button
                        type={"primary"}
                        text={"Edit"}
                        onPress={()=>{}}
                    />
                    <Button 
                        style={{marginVertical: rHeight(1)}}
                        type={"warning"} 
                        text={"Hapus Acara"} 
                        onPress={props.deleteAction} 
                    />
                </VStack>
                : props.type == 'detail' ?
                <TouchableOpacity
                    onPress={props.joinAction}
                    disabled={props.dataDetail.isJoin}
                    style={{ backgroundColor: props.dataDetail.isJoin ? 'grey' : Colors.ABM_GREEN, borderRadius: Spacing[20], paddingHorizontal: rWidth(3), paddingVertical: rHeight(0.8), alignContent:'center'}}
                >
                    <Text
                        type="label"
                        text={props.dataDetail.isJoin ? 'Terdaftar' : 'Ikut!'}
                        style={{ fontSize: 15, color: 'white', marginEnd: rWidth(1),textAlign:'center'}}
                    />
                </TouchableOpacity> : null}

                <Text
                    type="left-header"
                    text={props.data.hashtag}
                    style={{marginTop:rHeight(1),textAlign:'left'}}
                />

                {props.type == 'detail' && 
                <TouchableOpacity
                    onPress={share}
                    style={{ flexDirection: 'row', backgroundColor: Colors.ABM_LIGHT_BLUE, borderRadius: Spacing[20], paddingHorizontal: rWidth(3), paddingVertical: rHeight(0.8), alignSelf:'flex-start', alignItems:'center', marginTop: rHeight(1)}}
                >
                    <Text
                        type="label"
                        text={'Bagikan'}
                        style={{ fontSize: 15, color: 'white', marginEnd: rWidth(1)}}
                    />
                    <ShareIcon height={rHeight(2)} width={rHeight(2)}/>
                </TouchableOpacity>}
            </VStack>
        </HStack>

        <VStack top={rHeight(2)}>
            <View style={{
                backgroundColor: Colors.ABM_BG_BLUE,
                padding: spacing[4],
                borderRadius: Spacing[20],
                borderWidth: 2,
                borderColor: Colors.ABM_DARK_BLUE
            }}>
                {props.type == 'detail' && 
                <VStack bottom={rHeight(1.5)}>
                    <Text text="Event ini diselenggarakan oleh"/>
                    <HStack>
                    <UserIcon height={rHeight(3)} width={rHeight(3)}/>
                    <Text type="body-bold" text={' ' + props.dataDetail.user.fullname} style={{marginStart:rWidth(1)}}/>
                    </HStack>
                </VStack>
                }
                

                <Text text={props.data.description} />

                <Text style={{ marginTop: rHeight(2) }}>
                    <Text type="body-bold" text={'Kategori: '} />
                    {props.data.categoryIds.map((e, index) => index > 0 ? `, ${getNameList(e, 'category-event')}` : `${getNameList(e, 'category-event')}`)}
                </Text>

                <Text>
                    <Text type="body-bold" text={'Tipe Kegiatan: '} />
                    {getNameList(props.data.typeId, 'type-event')}
                </Text>

            </View>
        </VStack>
        
        {props.type == 'preview' && props.showShareButton &&
        <TouchableOpacity
            onPress={share}
            style={{ flexDirection: 'row', backgroundColor: Colors.ABM_LIGHT_BLUE, borderRadius: Spacing[20], paddingHorizontal: rWidth(3), paddingVertical: rHeight(0.8), alignSelf:'flex-start', alignItems:'center', marginTop: rHeight(1)}}
        >
            <Text
                type="label"
                text={'Bagikan'}
                style={{ fontSize: 15, color: 'white', marginEnd: rWidth(1)}}
            />
            <ShareIcon height={rHeight(2)} width={rHeight(2)}/>
        </TouchableOpacity>}
    </>

}

export default EventPreviewContainer