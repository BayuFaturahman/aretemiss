import React, { useCallback } from "react"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"
import { TouchableOpacity, View } from "react-native"
import FastImage from "react-native-fast-image"
import { Button, Text } from "@components"
import Spacer from "@components/spacer"
import downArrow from "@assets/icons/down-arrow.png"
import surprised from "@assets/icons/homepage/surprised.png"
import sick from "@assets/icons/notifications/sick.png"
import { presets } from "@components/text/text.presets"
import { FeedItemType } from "@screens/feed/feed.type"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../../bootstrap/context.boostrap"
import { rHeight } from "@styles/Spacing"
import { EventContainer } from "@screens/event/component/event-container"

export const EmptyList = ({
  navigateTo = () => null,
  imageSource = sick,
  buttonLabel = "Kembali",
}) => {
  return (
    <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
      <Text type={"body"} style={{ textAlign: "center" }}>
        Belum ada
        <Text
          type={"body"}
          style={[{ textAlign: "center", fontStyle: "italic" }, presets.italic]}
        > {''}
          Acara Ceria.
        </Text>
      </Text>
      <Button
        type={"primary"}
        text={buttonLabel}
        style={{ height: Spacing[32], paddingHorizontal: Spacing[8], marginVertical: rHeight(3)}}
        textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
        onPress={navigateTo}
      />
    </VStack>
  )
}

export const EventItemComponent:React.FC = () => {
  const { eventStore } = useStores()
  const navigation = useNavigation()

  if (eventStore.listEvent.length == 0) {
    return (
      <VStack>
        <Text
          type={"left-header"}
          style={{ fontSize: Spacing[16] }}
          underlineWidth={Spacing[72]}
          text="Acara Ceria."
        />
        <Spacer height={Spacing[12]} />
        <Spacer width={Spacing[24]} />
        <EmptyList
          buttonLabel={"Buat Acara Ceria Disini!"}
          imageSource={surprised}
          navigateTo={() => navigation.navigate("createEvent" as any)}
        />
        <Spacer height={Spacing[32]} />
      </VStack>
    )
  }

  return (
    <VStack>
      <Text
        type={"left-header"}
        style={{ fontSize: Spacing[16]}}
        underlineWidth={Spacing[72]}
        text="Acara Ceria."
      />
      <TouchableOpacity 
        onPress={()=>navigation.navigate('eventMain' as any)}
      >
        <VStack style={{alignItems:'center'}}>
          <TouchableOpacity style={{marginTop: rHeight(2)}}
            onPress={()=>navigation.navigate('eventMain' as any)}
            >
            <View>
              {/* <FeedPost isFromHomePage={true} data={data} key={data.id} onImageTap={onImageFeedTap} /> */}
              {eventStore.listEvent.length > 1 && <EventContainer data={eventStore.listEvent[0]} hideButton/>}
            </View>
          </TouchableOpacity>
          <HStack>
            <Spacer />
            <View>
              <FastImage
                style={{
                  height: Spacing[24],
                  width: Spacing[24],
                  borderRadius: Spacing[8],
                }}
                source={downArrow}
                resizeMode={"contain"}
              />
            </View>
            <Spacer />
          </HStack>
        </VStack>
      </TouchableOpacity>
    </VStack>
  )
}
