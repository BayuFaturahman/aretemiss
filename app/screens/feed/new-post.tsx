import React, { createRef, FC, useCallback, useEffect, useState } from "react"
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleProp,
  TouchableOpacity,
  View,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField, DropDownPicker, DropDownItem } from "@components"
import { NavigatorParamList } from "@navigators/feed-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import FastImage from "react-native-fast-image"
import { launchImageLibrary, ImagePickerResponse, launchCamera } from "react-native-image-picker"
import { useStores } from "../../bootstrap/context.boostrap"

import insertPict from "@assets/icons/feed/insertPict.png"
import ActionSheet from "react-native-actions-sheet/index"

import Spinner from "react-native-loading-spinner-overlay"
import { Formik } from "formik"
import {debounce} from "lodash";

import { createThumbnail } from "react-native-create-thumbnail";

const NEW_ITEM_CONTAINER: StyleProp<any> = {
  zIndex: 10,
  height: Spacing[18],
  width: Spacing[18],
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: Colors.MAIN_RED,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  right: Spacing[4],
}

const updateButtonStyle: StyleProp<any> = {
  height: Spacing[32],
  paddingHorizontal: Spacing[16],
  right: 0,
  position: "absolute",
}

const feedImageStyle: StyleProp<any> = {
  height: Spacing[54],
  width: Spacing[96],
  borderRadius: Spacing[16],
  marginRight: Spacing[10],
}

const addImageStyle: StyleProp<any> = {
  backgroundColor: Colors.MAIN_BLUE,
  padding: Spacing[4],
  borderRadius: 5,
  width: Spacing[36],
  height: Spacing[36],
  justifyContent: "center",
  alignItems: "center",
  marginRight: Spacing[14],
}

export type newPostForm = {
  description: string,
  category: DropDownItem
}


const newPostInitialForm: newPostForm = {
  description: '',
  category: null
}

const NewPost: FC<StackScreenProps<NavigatorParamList, "newPost">> = observer(({ navigation }) => {
  // empty list state
  const { feedStore } = useStores()

  const actionSheetRef = createRef();

  const qualityImage = Platform.OS === "ios" ? 0.4 : 0.5
  const maxWidthImage = 1024
  const maxHeightImage = 1024

  // const [description, setDescription] = useState<string>('')
  const [selectedPicture, setSelectedPicture] = useState([])
  const [uploadedPicture, setUploadedPicture] = useState([])
  const [isAddPictDisabled, setIsAddPictDisabled] = useState<boolean>(false)
  const [selectionPictLimit, setSelectionPictLimit] = useState<number>(4)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isCategoryError, setIsCategoryError] = useState<boolean>(false)
  const [feedCategory, setFeedCategory] = useState(feedStore.listFeedCategory)

  const [isPhoto, setIsPhoto] = useState<boolean | null>(null)
  const [videoThumbnail, setVideoThumnail] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(()=>{
    actionSheetRef.current?.setModalVisible(false)
  }, [isLoading])

  // const feedCategory = feedStore.listFeedCategory

  // const onRefresh = React.useCallback(async() => {
  //   setCoachingData([])
  // }, []);

  const goToFeed = () => navigation.navigate('feedTimelineMain', {
    newPost: true
  })

  const goBack = () => navigation.goBack()

  const NotificationCounter = ({ id }: { id: number }) => {
    return (
      <TouchableOpacity style={NEW_ITEM_CONTAINER} onPress={() => {removeSelectedPict(id)}}>
          <Text
            type={"label"}
            style={{ fontSize: Spacing[12], color: "white" }}
            text={"X"}
          />
        
      </TouchableOpacity>
    )
  }

  const removeSelectedPict = (id) => {
    const tempSelected = [...selectedPicture];
    tempSelected.splice(id, 1);
    setSelectedPicture(tempSelected)


    const tempUploaded = [...uploadedPicture];
    tempUploaded.splice(id, 1);
    setUploadedPicture(tempUploaded)
    
  }
 
  const cameraHandler = useCallback(async (response: ImagePickerResponse, isPhoto: boolean) => {
    setIsLoading(true)
    console.log(response)
    if (!response.didCancel) {
      const formData = new FormData()
      // formData.append('files', response.assets[0].base64 )
      for (const asset of response.assets) {
        const id = response.assets.indexOf(asset);

        const format = isPhoto ? "jpeg" : "mp4"

        if(format === "mp4"){
          console.log(asset.uri)
          const thumbnail = await createThumbnail({
            url: asset.uri,
            timeStamp: 1,
          })
          setVideoThumnail((item) => [...item, `file://${thumbnail.path}`])
        }

        formData.append("files", {
          ...response.assets[id],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uri:
            Platform.OS === "android"
              ? response.assets[id].uri
              : response.assets[id].uri.replace("file://", ""),
          name: `feed-image-${response.assets[id].fileName.toLowerCase().split(" ")[0]}-${new Date().getTime()}.${format}`,
          type: response.assets[id].type ?? "image/jpeg",
          size: response.assets[id].fileSize,
        })
      }
      // console.log("RESPONSE ASET: ", response.assets)
      // console.log(formData['_parts'])

      feedStore.formReset()
      const responseUpload = await feedStore.uploadImage(formData)
      console.log('responseUpload ',responseUpload)
      const listResponseUpload = responseUpload.data.urls.split(';')
      console.log('listResponseUpload ', listResponseUpload)

      if (feedStore.errorCode === null  && responseUpload !== undefined) {
        console.log('upload photo OK.')
        setSelectedPicture((selectedPicture) => [...selectedPicture, ...response.assets])
        setUploadedPicture((uploadedPicture) => [...uploadedPicture, ...listResponseUpload])
      }
    
    } else {
      console.log("cancel")
    }
    setIsLoading(false)
  }, [selectedPicture, setSelectedPicture, uploadedPicture, setUploadedPicture])
  
  const openGallery = useCallback((isPhoto: boolean) => {
    launchImageLibrary(
      {
        mediaType: isPhoto ? "photo" : "video",
        quality: qualityImage,
        maxWidth: maxWidthImage,
        maxHeight: maxHeightImage,
        includeBase64: false,
        selectionLimit: isPhoto ? selectionPictLimit : 1,
      },
      async (response) => {
        await cameraHandler(response, isPhoto)
      },
    ).then(r  =>{
      // actionSheetRef.current?.setModalVisible(false)
      // setIsLoading(false)
    })
  }, [actionSheetRef])

  const openCamera = useCallback((isPhoto: boolean) => {
    actionSheetRef.current?.setModalVisible(false)
    launchCamera(
      {
        mediaType: isPhoto ? "photo" : "video",
        quality: qualityImage,
        maxWidth: maxWidthImage,
        maxHeight: maxHeightImage,
        includeBase64: false,
      },
      async (response)=>{
        await cameraHandler(response, isPhoto)
      },
    ).then(r  =>{
      actionSheetRef.current?.setModalVisible(false)
    })
  }, [])

  useEffect(() => {
    if (selectedPicture.length === 4) {
      setIsAddPictDisabled(true)
    } else {
      setIsAddPictDisabled(false)
    }

    console.log("selectedPicture.length ", selectedPicture.length)
    const maxSelectPict = 4 - selectedPicture.length
    // console.log('maxSelectPict ', maxSelectPict)
    setSelectionPictLimit(maxSelectPict)
    // console.log("selected pict: ", selectedPicture)
  }, [
    selectedPicture,
    isAddPictDisabled,
    setIsAddPictDisabled,
    setSelectionPictLimit,
    selectionPictLimit,
  ])

  useEffect(() => {
    firstLoadFeedCategory()
    console.log('get list feed category')
  },[])

  
  const firstLoadFeedCategory = debounce( async () => {
    await feedStore.getListFeedCategory()
    setFeedCategory(feedStore.listFeedCategory)
  }, 500)
  
  const submitNewPost = useCallback(async (data: newPostForm) => {
    const imagesUrl = uploadedPicture.join(';')
    console.log('imagesUrl ', imagesUrl)
    console.log('data', data)

    if (!data.category.id ) {
      setIsCategoryError(true)
      return 
    } else {
      setIsCategoryError(false)
    }

    feedStore.formReset()
    await feedStore.createPost({ 
      "description": data.description,
      "images_url": imagesUrl,
      "type_id": data.category.id
    });

    if (feedStore.errorCode === null) {
      // feedStore.formReset()
      // await feedStore.getListFeeds()
      goToFeed()
    } else {
      setErrorMessage(feedStore.errorMessage)
      console.log(feedStore.errorCode, ' : ', feedStore.errorMessage )
    }
  }, [feedStore.errorCode, selectedPicture, uploadedPicture, setUploadedPicture])


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
              refreshing={isLoading}
              //   onRefresh={onRefresh}
              tintColor={Colors.MAIN_RED}
            />
          }
        >
           <Formik initialValues={newPostInitialForm} onSubmit={submitNewPost}>
              {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
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
                  value={values.description}
                  style={{ paddingTop: 0, textAlign: "left" }}
                  inputStyle={{ minHeight: Spacing[128],textAlign: 'left', paddingLeft: Spacing[12]}}
                  isRequired={true}
                  secureTextEntry={false}
                  isTextArea={true}
                  placeholder={"Mau cerita tentang apa nih?"}
                  onChangeText={handleChange("description")}
                  // onChangeText={(value) => setDescription(value)}
                  charCounter={false}
                  // value={description}
                />
                
              </VStack>
              <Text type={"warning"} style={{ textAlign: "center" }}>
                  {errorMessage}
              </Text>
              <HStack>
                <HStack>
                  <TouchableOpacity
                    disabled={isAddPictDisabled}
                    onPress={() => {
                      if (!isPhoto){
                        setSelectedPicture([])
                        setUploadedPicture([])
                      }
                      setIsPhoto(null)
                      actionSheetRef.current?.setModalVisible(true)
                    }}
                  >
                    <View
                      style={addImageStyle}
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
                  </TouchableOpacity>

                  <ScrollView style={{ maxWidth: "85%" }} horizontal={true}>
                    {selectedPicture.map((pic, id) => {
                      if(pic.type === "video/mp4"){

                        return(
                          <VStack key={id}>
                            <NotificationCounter id={id} />
                            <FastImage
                              key={id}
                              style={feedImageStyle}
                              source={{uri: videoThumbnail[id]}}
                              resizeMode={"cover"}
                            />
                          </VStack>
                        )
                      }

                      return (
                        <VStack key={id}>
                          <NotificationCounter id={id} />
                          <FastImage
                            key={id}
                            style={feedImageStyle}
                            source={pic}
                            resizeMode={"cover"}
                          />
                        </VStack>
                      )
                    })}
                  </ScrollView>
                </HStack>
              </HStack>
              <DropDownPicker
                items={feedCategory}
                label='Pilih Kategori'
                isRequired={false}
                // value={values.lea}
                onValueChange={(value: DropDownItem | DropDownItem[]) => {
                  setFieldValue("category", value)
                }}
                placeholder={"Pilih kategori"}
                containerStyle={{ marginTop: Spacing[4] }}
                isError={isCategoryError}
                multiple={false}
              />
              <Spacer height={Spacing[12]} />
              { isCategoryError && 
                <Text type={"warning"} style={{ textAlign: "center" }}>
                  Woops. Kamu belum memilih kategori post Feed-mu. Dipilih dulu yuk!
                </Text>
              }
              <Spacer height={Spacing[32]} />
              <HStack>
                <Button
                  type={"primary"}
                  text={"Update"}
                  style={updateButtonStyle}
                  textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                  onPress={handleSubmit}
                />
              </HStack>
              <Spacer height={Spacing[32]} />
            </VStack>
           )}
           </Formik>
        </ScrollView>
      </SafeAreaView>
      <Spinner visible={feedStore.isLoading} textContent={"Memuat..."} />
      <ActionSheet ref={actionSheetRef}>
        {
          isPhoto === null ?
            <VStack
                style={{ justifyContent: "center" }}
                vertical={Spacing[24]}
                horizontal={Spacing[24]}
            >
                <Button
                    onPress={() => {
                      setIsPhoto(true)
                    }}
                    type={"primary"}
                    text={"Foto 🖼️"}
                />
                <Spacer height={Spacing[12]} />
                <Button
                    onPress={() => {
                      setSelectedPicture([])
                      setUploadedPicture([])
                      setIsPhoto(false)
                    }}
                    type={"primary"}
                    text={"Video 🎥"}
                />
            </VStack> :
            <>
              <VStack
                style={{ justifyContent: "center" }}
                vertical={Spacing[24]}
                horizontal={Spacing[24]}
              >
                <VStack style={[Layout.widthFull, Layout.flexCenter]} bottom={Spacing[12]}>
                  <Text type={"body-bold"} style={{}} text={`Mengupload ${isPhoto === true ? "Foto 🖼" : "Video 🎥"}`} />
                </VStack>
                <Button
                  onPress={() => {
                    openGallery(isPhoto)
                  }}
                  type={"primary"}
                  text={"Galeri Foto 🖼️"}
                />
                <Spacer height={Spacing[12]} />
                <Button
                  onPress={() => {
                    openCamera(isPhoto)
                  }}
                  type={"primary"}
                  text={"Kamera 📸"}
                />
                <VStack style={[Layout.widthFull, Layout.flexCenter]} top={Spacing[12]}>
                  <Button
                    onPress={() => {
                      setIsPhoto(null)
                    }}
                    type={"secondary"}
                    text={"Kembali"}
                  />
                </VStack>
              </VStack>
            </>
        }
      </ActionSheet>
    </VStack>
  )
})

export default NewPost

