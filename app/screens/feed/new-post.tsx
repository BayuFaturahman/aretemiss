import React, { FC, useCallback } from "react"
import { RefreshControl, SafeAreaView, ScrollView, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import FastImage from "react-native-fast-image"
import { useStores } from "../../bootstrap/context.boostrap"

import insertPict from "@assets/icons/feed/insertPict.png"
import smileYellow from "@assets/icons/coachingJournal/empty/smile-yellow.png"
import { FeedTimelineItem } from "./feed.type"

const NewPost: FC<StackScreenProps<NavigatorParamList, "newPost">> = observer(({ navigation }) => {
  // empty list state
  const { feedStore } = useStores()

  // const onRefresh = React.useCallback(async() => {
  //   setCoachingData([])
  // }, []);

  const goBack = () => {
    navigation.reset({
      routes: [{ name: "homepage" }],
    })
  }

  const getListFeed = useCallback(async () => {
    await feedStore.getListFeeds()
  }, [])

  return (
    <VStack
      testID="newPost"
      style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
    >
      <SafeAreaView style={Layout.flex}>
        <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
        <ScrollView
          refreshControl={
            <RefreshControl
              //   refreshing={coachingStore.isLoading}
              //   onRefresh={onRefresh}
              tintColor={Colors.MAIN_RED}
            />
          }
        >
          <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
            <HStack>
              <Text type={"left-header"} style={{}} text="Update your Feed." />
              <Spacer />
              <HStack>
                <Button type={"transparent"} text={"Cancel"} onPress={goBack} />
              </HStack>
            </HStack>

            {/* <Spacer height={Spacing[8]} /> */}
            <VStack top={Spacing[12]}>
              <TextField
                style={{ paddingTop: 0, textAlign: "left" }}
                inputStyle={{ minHeight: Spacing[128] }}
                isRequired={false}
                secureTextEntry={false}
                isTextArea={true}
                // editable={!coachingStore.isDetail}
                // value={values.commitment}
                // isError={isError === "commitment"}
                placeholder={"Mau cerita tentang apa nih?"}
                onChangeText={() => console.log("alala")}
                charCounter={false}
              />
            </VStack>
            <HStack>
              <HStack>
                <View
                  style={{
                    backgroundColor: Colors.MAIN_BLUE,
                    padding: Spacing[4],
                    borderRadius: 5,
                    width: Spacing[36],
                    height: Spacing[36],
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FastImage
                    style={{
                      backgroundColor: Colors.MAIN_BLUE,
                      height: Spacing[24],
                      width: Spacing[24],
                      borderRadius: Spacing[8],
                    }}
                    source={insertPict}
                    resizeMode={"contain"}
                  />
                </View>

                <ScrollView
                  style={{ backgroundColor: Colors.BLACK, maxWidth: "50%" }}
                  horizontal={true}
                >
                  <FastImage
                    style={{
                      height: Spacing[24],
                      width: Spacing[24],
                      borderRadius: Spacing[24],
                      marginRight: Spacing[10],
                    }}
                    source={smileYellow}
                    resizeMode={"cover"}
                  />
                  <FastImage
                    style={{
                      height: Spacing[24],
                      width: Spacing[24],
                      borderRadius: Spacing[24],
                    }}
                    source={smileYellow}
                    resizeMode={"cover"}
                  />
                </ScrollView>
              </HStack>
              <Button
                type={"primary"}
                text={"Update"}
                style={{
                  height: Spacing[32],
                  paddingHorizontal: Spacing[8],
                  right: 0,
                  position: "absolute",
                }}
                textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                onPress={() => console.log("lele")}
              />
            </HStack>
            <HStack>
              <Spacer />
              <Spacer />
            </HStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </VStack>
  )
})

export default NewPost
