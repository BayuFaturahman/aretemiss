import React, { useEffect, useState } from "react"
import { ActivityIndicator, Image, Linking, TouchableOpacity, View } from "react-native"
import { HStack, VStack } from "@components/view-stack"
import { deviceWidth, rHeight, rWidth } from "@styles/Spacing"
import { Colors, Spacing } from "@styles/index"
import { Text, Icon, Button } from "@components"
import moment from "moment"
import { spacing } from "@theme/spacing"
import { useStores } from "../../../bootstrap/context.boostrap"
import { Event } from "@services/api/event/response/get-event"
import { useNavigation } from "@react-navigation/native"
import {  StackNavigation } from "@navigators/event-navigator"

interface EventContainerProps {
    data: Event
    isDetail?: boolean
    width?: string | number
    hideButton?: boolean
    onPressDetail?: any
}

export const EventContainer: React.FC<EventContainerProps> = (props) => {
    const { eventStore, eventApi } = useStores()
    const navigation = useNavigation<StackNavigation>()
    const [grayscaleBase64, setGrayscaleBase64] = useState<string | null>(null);
    const [loadingJoin, setLoadingJoin] = useState(false)

    useEffect(() => {
        async function convertToGrayscale() {
            try {
                let base64data;
                base64data = await uriToBase64(`https://ilead.id/storage/development/file/image/${props.data.posterUrl}`);
                setGrayscaleBase64(base64data);
            } catch (error) {
                console.error('Error converting URI to base64:', error);
            }
        }
        convertToGrayscale();
    }, []);
    
    const loadInBrowser = async (url) => {
        let a = await uriToBase64(`https://ilead.id/storage/development/file/image/${props.data.posterUrl}`)
        console.log(a)
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

    const joinEvent = async () => {
        let id = props.data.id
        setLoadingJoin(true)
        let res = await eventApi.joinEvent(id)
        if(res['response']['data']){
            // getEventById()
            await eventStore.getEvent()
        }
        setLoadingJoin(false)
    }

    const uriToBase64 = async (uri) => {
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result;
              if (typeof result === 'string') {
                const base64data = result.split(',')[1];
                resolve(base64data);
              } else {
                reject(new Error('Result is not a string'));
              }
            };
            reader.onerror = (error) => {
              reject(error);
            };
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Error converting URI to base64:', error);
          throw error;
        }
    };

    return <>
        <HStack>
            <Image
                source={{ uri: `https://ilead.id/storage/development/file/image/${props.data.posterUrl}` }}
                style={{
                    width: rWidth(30),
                    height: rHeight(20),
                    // aspectRatio: 3 / 4,
                    // resizeMode: 'stretch',
                    // tintColor: 'gray',
                }}
            />
            {/* {grayscaleBase64 ? (
                <Image
                    source={{ uri: `https://ilead.id/storage/development/file/image/${props.data.posterUrl}` }}
                    style={{
                        width: rWidth(30),
                        height: rHeight(20),
                        // tintColor: 'gray', // Apply grayscale effect
                    }}
                />
            ) : <Text>as</Text>} */}
            <VStack style={{
                width: props.width ?? rWidth(45),
                marginLeft: rWidth(4),
                paddingRight: rWidth(4),
            }}>
                <Text
                    type="body-bold"
                    text={props.data.name}
                    style={{ fontSize: 18, marginBottom: rHeight(0.2) }}
                />
                <Text
                    type="label"
                    text={`${moment(props.data.startTime).format('DD MMM YYYY, HH.mm')} s/d \n${moment(props.data.endTime).format('DD MMM YYYY, HH.mm')}`}
                    style={{ fontSize: 14, marginBottom: rHeight(0.2)}}
                />

                {props.data.implementation == 'offline' && <Text
                    type="label"
                    text={props.data.locationDetail}
                    style={{ fontSize: 13, marginBottom: rHeight(0.2)}}
                />}

                <TouchableOpacity
                    onPress={() => loadInBrowser(props.data.location)}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: rHeight(0.2)}}
                >
                    <Icon icon={'link'} style={{ width: 18, height: 18, marginEnd: 5 }} />
                    <Text
                        type="label"
                        text={props.data.location.length > 23 ? `${props.data.location.slice(0, 23)}...` : props.data.location}
                        style={{ fontSize: 15, textDecorationLine: 'underline' }}
                    />
                </TouchableOpacity>

                <Text
                    text={props.data.description.length > 80 ? `${props.data.description.slice(0, 80)}.....` : props.data.description}
                    style={{fontSize: 14, maxHeight:rHeight(10), marginBottom: rHeight(0.2)}}
                />

                <Text
                    type="left-header"
                    text={props.data.hashtag}
                    style={{ fontSize: 15, textAlign: 'left'}}
                    underlineWidth={Spacing['72']}
                />

                {!props.hideButton &&
                    <HStack top={rHeight(1)}>
                        {loadingJoin ? <ActivityIndicator size={30} color={Colors.ABM_DARK_BLUE}/>
                        : <Button 
                            type={props.data.isJoin ? "negative-white" : "primary"}
                            text={props.data.isJoin ? "Terdaftar!" : "Ikut!" }
                            style={{paddingHorizontal: rWidth(5),paddingVertical:5,marginRight: rWidth(2)}}
                            disabled={props.data.isJoin}
                            // onPress={joinEvent}
                        />}
                        <Button 
                            type="light-blue" 
                            text="Lihat Detail"
                            style={{paddingHorizontal: rWidth(5),paddingVertical:5}}
                            // onPress={props.onPressDetail}
                            onPress={()=>navigation.navigate('eventDetail', { id: props.data.id })}
                        />
                    </HStack>
                }
            </VStack>
        </HStack>

        {props.isDetail &&
        <VStack top={rHeight(2)}>
            <View style={{
                backgroundColor: Colors.ABM_BG_BLUE,
                padding: spacing[4],
                borderRadius: Spacing[20],
                borderWidth: 2,
                borderColor: Colors.ABM_DARK_BLUE
            }}>
                <Text text={props.data.description} />

                {/* <Text style={{ marginTop: rHeight(2) }}>
                    <Text type="body-bold" text={'Kategori: '} />
                    {props.data.categoryIds.map((e, index) => index > 0 ? `, ${getNameList(e, 'category-event')}` : `${getNameList(e, 'category-event')}`)}
                </Text>

                <Text>
                    <Text type="body-bold" text={'Tipe Kegiatan: '} />
                    {getNameList(props.data.typeId, 'type-event')}
                </Text> */}

            </View>
        </VStack>}
    </>

}