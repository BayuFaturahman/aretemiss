import React, { FC, useCallback, useEffect, useState } from "react"
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    View,
    StyleSheet,
    ActivityIndicator,
    Image
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, TextField, } from "@components"
import { NavigatorParamList } from "@navigators/event-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPickerr, { ItemType } from 'react-native-dropdown-picker';
import { launchImageLibrary, Asset } from "react-native-image-picker"
import { useStores } from "../../bootstrap/context.boostrap"
import Spinner from "react-native-loading-spinner-overlay"
import { Formik } from "formik"
import moment from "moment"
import { spacing } from "@theme/spacing"
import { typography } from "@theme/typography"
import { rHeight, rWidth } from "@styles/Spacing"
import CheckBoxComponent from "@components/checkbox/multiple_checkbox"

export type createEventForm = {
    id?: string,
    errDesc?: string,
    name: string,
    startTime: string,
    endTime: string,
    implementation: string,
    location: string,
    locationDetail: string,
    timezone: string,
    hashtag: string,
    description: string,
    categoryIds: string[],
    typeId: string,
    posterUrl: string,
    posterImg?: Asset,
}

const createEventInitialForm: createEventForm = {
    errDesc: '',
    name: '',
    startTime: '',
    endTime: '',
    implementation: 'online',
    location: '',
    locationDetail: '',
    timezone: 'wib',
    hashtag: '',
    description: '',
    categoryIds: [],
    typeId: '',
    posterUrl: '',
}

const CreateEvent: FC<StackScreenProps<NavigatorParamList, "createEvent">> = observer(({ navigation }) => {

    const goBack = () => navigation.goBack()
    const { eventApi, eventStore } = useStores()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [showTimePicker, setShowTimePicker] = useState(false)
    const [dateTimePickerType, setDateTimePickerType] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(moment().add(1, 'days').toDate())

    const [showTimezonePicker, setTimezonePicker] = useState<boolean>(false);
    const [showImplementation, setImplementation] = useState<boolean>(false);
    const [showTypeList, setShowTypeList] = useState<boolean>(false);
    const [timezone, setTimezone] = useState<string | null>('wib');
    const [pelaksanaanAcara, setPelaksanaanAcara] = useState<string | null>('online');
    const [tipeAcara, setTipeAcara] = useState<string | null>('');

    const [onTriggerChecked, setOnTrigger] = useState(false);
    const [submitPressed, setSubmitPressed] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [loadingType, setLoadingType] = useState(false);
    const [categoryList, setCategoryList] = useState([]);    
    const [typeList, setTypeList] = useState<ItemType[]>([]); 

    // const [imageName, setImgName] = useState('');
    // const [imageUri, setImgUri] = useState('');

    const [posterImg, setPosterImg] = useState<Asset>(null);
    const [posterErr, setPosterErr] = useState(false);
    const [hashtagTaken, setHashtagTaken] = useState(false);

    const timeZoneitems : ItemType[] = [
        { label: 'WIB', value: 'wib' },
        { label: 'WITA', value: 'wita' },
        { label: 'WIT', value: 'wit' },
    ];
    
    const implementationItems : ItemType[] = [
        // {label: 'Pilih Tipe Pelaksanaan', value:'pilih'},
        {label: 'Online', value:'online'},
        {label: 'Offline', value:'offline'},
    ]

    const handleCheckedItemsChange = (items, setFieldValue) => {
        if(onTriggerChecked){
            console.log('aa', items)
            let ids = items.map((e) => e.id)
            setFieldValue('categoryIds', ids)
        }
    };

    useEffect(() => {
        getCategory()
        getType()
    }, [])
    const getCategory = async () => {
        setLoadingCategory(true)
        let response = await eventStore.getListCategory('category-event')
        // console.log('ress', response)
        // let data = response['response']['data']
        setCategoryList(eventStore.listCategory)
        setLoadingCategory(false)
    }
    const getType = async () => {
        setLoadingType(true)
        let response = await eventStore.getListCategory('type-event')
        // console.log('ress', response)
        // let data = response['response']['data']
        let dataList : ItemType[] = [];
        eventStore.listType.map((e)=>{
            let item : ItemType = {
                label: e.name,
                value: e.id
            }
            dataList.push(item);
            console.log(item)
        })
        setTypeList(dataList)
        setLoadingType(false)
    }

    const submitPreviewEvent = useCallback(async (dataForm: createEventForm) => {
        console.log('data', dataForm)
        eventStore.setEventData({
            ...dataForm,
            locationDetail: dataForm.implementation == 'online' ? '' : dataForm.locationDetail
        })
        navigation.navigate('eventPreview')
    }, [])

    const onDateChange = (selectedDate, setFieldValue, type) => {
        if(type == 'startTime'){
            setStartDate(selectedDate)
        } else {
            setEndDate(selectedDate)
        }
        setFieldValue(type, selectedDate)
    }

    const openGallery = async (setFieldValue) => {
        const result = await launchImageLibrary({
            mediaType:'photo',
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.5,
            includeBase64: false,
            selectionLimit: 1
        });
        console.log(result);
        if(result && result.assets.length > 0){
            const selectedImage = result.assets[0];
            const fileSizeInMB = selectedImage.fileSize / (1024 * 1024);
            if(fileSizeInMB <= 2){
                setPosterErr(false)
                setPosterImg(selectedImage)
                setFieldValue('posterImg', selectedImage)
                setFieldValue('posterUrl', 'post')
            } else {
                setPosterImg(null)
                setPosterErr(true)
            }
        }
    }

    const renderTitle = (t1, t2, removeMargin = false) => { return <Text style={{marginVertical: removeMargin ? 0 : spacing[2]}}>
        <Text
            type={"body-bold"}
            style={{ color: Colors.ABM_LIGHT_BLUE }}
            text={`${t1} `}
        />
        <Text
            type={"body-bold"}
            //   style={{ color: Colors.BRIGHT_BLUE }}
            text={`${t2}`}
        />
    </Text>}


    const hashtagCheck = async (str, setFieldValue) => {
        let v = str.replace(/\s+/g, ' ')
        .replace(/\b\w/g, (e) => e.toUpperCase())
        .replace(/^\w/, (e) => e.toUpperCase())
        .replace(/\s+/g, '')
        console.log(v)
        setFieldValue('hashtag', `#${v}`)
        let res = await eventApi.getEventDetail('hashtag', v)
        if(res.kind != 'not-found'){
            return true
        }
        return false
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={Layout.flex}
        >
            <VStack
                style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
            >
                <Formik
                    initialValues={createEventInitialForm}
                    onSubmit={submitPreviewEvent}
                    validate={(values) => {
                        const errors: Partial<createEventForm> = {};
                        if(
                            !values.name
                            || !values.startTime
                            || !values.endTime
                            || !values.implementation
                            || (!values.locationDetail && (values.implementation == 'offline' || pelaksanaanAcara == 'offline'))
                            || !values.location
                            || !values.hashtag
                            || !values.description
                            || values.categoryIds.length == 0
                            || !values.typeId
                            || !values.posterUrl
                        ) {
                            errors.errDesc = 'Ups! Sepertinya ada kolom yang belum diisi! Silahkan dicek kembali dan isi semua kolom yang tersedia!';
                        }
                        if(!values.name) errors.name = ''
                        if(!values.startTime) errors.startTime = ''
                        if(!values.endTime) errors.endTime = ''
                        if(!values.implementation) errors.implementation = ''
                        if(!values.locationDetail && (values.implementation == 'offline' || pelaksanaanAcara == 'offline')) errors.locationDetail = ''
                        if(!values.location) errors.location = ''
                        if(!values.hashtag) errors.hashtag = ''
                        if(!values.description) errors.description = ''
                        if(values.categoryIds.length == 0) errors.categoryIds = []
                        if(!values.typeId) errors.typeId = ''
                        if(!values.posterUrl) errors.posterUrl = ''

                        console.log(errors)
                        return errors;
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, touched, errors }) => (
                        <SafeAreaView style={Layout.flex}>
                            <Spacer height={Spacing[20]} />
                            <HStack horizontal={Spacing[24]}>
                                <Text type={"left-header"} style={{}} text="Buat Acara Ceria." />
                                <Spacer />
                                <HStack>
                                    <Button type={"red-bg"} text={"Batal"} onPress={goBack} />
                                </HStack>
                            </HStack>
                            {submitPressed && errors.errDesc && (
                                <Text style={{...styles.errorText,marginVertical:Spacing[8],textAlign:'center',marginHorizontal:Spacing[24],marginBottom:Spacing[4],fontSize:13}}
                                    type="body-bold"
                                >
                                    {errors.errDesc}
                                </Text>
                            )}
                            <ScrollView>
                                <VStack top={Spacing[4]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                                    

                                    {/* <Spacer height={Spacing[8]} /> */}
                                    <VStack top={Spacing[12]}>
                                        {renderTitle('Nama', 'Acara Ceria', true)}
                                        <TextField
                                            value={values.name}
                                            inputStyle={{ textAlign: 'left', paddingLeft: Spacing[12], borderColor: submitPressed && errors.name == '' ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE}}
                                            maxChar={120}
                                            isRequired={true}
                                            secureTextEntry={false}
                                            isTextArea={true}
                                            placeholder={"Nama Acara Ceria"}
                                            onChangeText={handleChange("name")}
                                            onBlur={ async () => {
                                                let check = await hashtagCheck(values.name, setFieldValue)
                                                setHashtagTaken(check)
                                            }}
                                            style={{paddingVertical:0}}
                                            charCounter={true}
                                            multiline={false}
                                        />
                                    </VStack>

                                    <VStack>
                                        {renderTitle('Waktu Pelaksanaan', 'Acara Ceria')}
                                        <HStack style={{marginBottom:spacing[3]}}>
                                            <TouchableOpacity onPress={() => {
                                                setShowTimePicker(true)
                                                setDateTimePickerType('date-start')
                                            }}>
                                            <View style={{ borderColor: submitPressed && errors.startTime == '' ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE,
                                                borderRadius: Spacing[20], borderWidth: Spacing[2], padding: 15, marginRight: 10}}>
                                                <Text type={"body-bold"} text={`${values.startTime == '' ? 'Pilih Waktu Mulai' : moment(startDate).format('DD/MM/YY - HH:mm:ss')}`} />
                                            </View>
                                            </TouchableOpacity>

                                            <Text type="body-bold" text="s/d" style={{fontSize: 18}}/>
                                        </HStack>

                                        <HStack style={{width:rWidth(90)}}>
                                            <TouchableOpacity onPress={() => {
                                                setShowTimePicker(true)
                                                setDateTimePickerType('date-end')
                                            }}>
                                                <View style={{ borderColor: submitPressed && errors.endTime == '' ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE,
                                                borderRadius: Spacing[20], borderWidth: Spacing[2], padding: 15, marginRight: 10}}>
                                                    <Text type={"body-bold"} text={`${values.endTime == '' ? 'Pilih Waktu Selesai' : moment(endDate).format('DD/MM/YY - HH:mm:ss')}`} />
                                                </View>
                                            </TouchableOpacity>
                                            <DropDownPickerr
                                                open={showTimezonePicker}
                                                value={timezone}
                                                items={timeZoneitems}
                                                setOpen={setTimezonePicker}
                                                onSelectItem={(v) => {
                                                    setFieldValue('timezone', v['value'])
                                                }}
                                                setValue={setTimezone}
                                                placeholder={'WIB'}
                                                style={{
                                                    flex: 1,
                                                    borderColor: Colors.ABM_DARK_BLUE,
                                                    borderWidth: Spacing[2],
                                                    borderRadius: Spacing[20],
                                                    backgroundColor: Colors.WHITE,
                                                    width: rWidth(25)
                                                }}
                                                textStyle={{...styles.textStyle,width: rWidth(30)}}
                                                containerStyle={{width: rWidth(30)}}
                                            />
                                        </HStack>
                                    </VStack>
                                    
                                    <VStack top={Spacing[4]}>
                                        {renderTitle('Pelaksanaan', 'Acara Ceria')}
                                        <DropDownPickerr
                                            open={showImplementation}
                                            value={pelaksanaanAcara}
                                            items={implementationItems}
                                            setOpen={setImplementation}
                                            onSelectItem={(v) => {
                                                setFieldValue('implementation', v['value'])
                                                console.log(values.implementation)
                                                console.log(pelaksanaanAcara)
                                            }}
                                            setValue={setPelaksanaanAcara}
                                            placeholder={'Online'}
                                            style={{
                                                flex: 1,
                                                borderColor: submitPressed && errors.implementation == '' ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE,
                                                borderWidth: Spacing[2],
                                                borderRadius: Spacing[20],
                                                backgroundColor: Colors.WHITE,
                                                zIndex: 1
                                            }}
                                            textStyle={styles.textStyle}
                                        />
                                    </VStack>

                                    {pelaksanaanAcara == 'offline' &&
                                    <VStack top={Spacing[12]}>
                                        {renderTitle('Nama Lokasi', 'Acara Ceria', true)}
                                        <TextField
                                            value={values.locationDetail}
                                            inputStyle={{ textAlign: 'left', paddingLeft: Spacing[12], borderColor: submitPressed && errors.locationDetail == '' ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE}}
                                            maxChar={100}
                                            isRequired={true}
                                            secureTextEntry={false}
                                            isTextArea={true}
                                            placeholder={"Nama Lokasi"}
                                            onChangeText={handleChange("locationDetail")}
                                            onBlur={handleBlur('locationDetail')}
                                            style={{paddingVertical:0}}
                                            // charCounter={true}
                                            multiline={false}
                                        />
                                    </VStack>}

                                    <VStack top={Spacing[12]}>
                                        {renderTitle(
                                            pelaksanaanAcara == 'online' ? 'Link Pelaksanaan' : 'Link Google Maps',
                                            pelaksanaanAcara == 'online' ? 'Acara Ceria (MS Teams, Zoom, dll.)' : '',
                                            true
                                        )}
                                        <TextField
                                            value={values.location}
                                            inputStyle={{ textAlign: 'left', paddingLeft: Spacing[12], borderColor: submitPressed && errors.location == '' ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE}}
                                            maxChar={100}
                                            isRequired={true}
                                            secureTextEntry={false}
                                            isTextArea={true}
                                            placeholder={"Link"}
                                            onChangeText={handleChange("location")}
                                            onBlur={handleBlur('location')}
                                            style={{paddingVertical:0}}
                                            // charCounter={true}
                                            multiline={false}
                                        />
                                    </VStack>
                                    
                                    <HStack top={spacing[2]} 
                                    // style={{alignItems:'flex-start'}}
                                    // style={{width:rWidth(90)}}
                                    >
                                    {posterImg != null ?
                                    <Image source={{ uri: posterImg.uri }}
                                    style={{width:rWidth(25),height:rHeight(15),resizeMode:'stretch'}}
                                    />
                                    :
                                    <Image source={require('@assets/icons/upload-poster.png')}
                                    style={{width:rWidth(30),height:rHeight(15),resizeMode:'contain'}}
                                    />
                                    }
                                        
                                    <VStack left={spacing[2]} style={{height:rHeight(15),justifyContent:'space-around'}}>

                                        {posterImg != null ?
                                            // <HStack>
                                            // <Text style={{width:rWidth(40),fontSize:14}}
                                            //     text={posterImg.fileName.length > 10 ? `${posterImg.fileName.slice(0,20)}....${posterImg.fileName.slice(posterImg.fileName.length-3,posterImg.fileName.length)}` : posterImg.fileName}
                                            // />
                                            //     <TouchableOpacity 
                                            //     onPress={()=>{setPosterImg(null)}}
                                            //     >
                                            //         <Icon icon="cross" style={{height:20,width:20}}/>
                                            //     </TouchableOpacity>
                                            // </HStack>
                                            <Button
                                                type={"primary"}
                                                text={"Ganti Poster"}
                                                style={{padding:10,backgroundColor: Colors.ABM_DARK_BLUE , width: rWidth(30)}}
                                                textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                                                onPress={()=>openGallery(setFieldValue)}
                                            />
                                            :
                                            <Button
                                                type={"primary"}
                                                text={"Upload Poster"}
                                                style={{padding:10,backgroundColor:Colors.ABM_YELLOW, width: rWidth(30)}}
                                                textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18], 
                                                    color: (submitPressed || posterErr) && posterImg == null ? Colors.MAIN_RED : 'black'
                                                }}
                                                onPress={()=>openGallery(setFieldValue)}
                                            />
                                        }
                                        
                                        
                                        <Text style={{width:rWidth(40),fontSize:12,
                                                color: (submitPressed || posterErr) && posterImg == null ? Colors.MAIN_RED : 'black'
                                            }}
                                            text="Poster maksimal berukuran 2 MB dan dapat berupa .png dan .jpg"
                                        />
                                        </VStack>
                                    </HStack>
                                    {posterErr && <Text
                                        style={{...styles.errorText,marginVertical:Spacing[8],textAlign:'center',marginHorizontal:Spacing[24],marginBottom:Spacing[4],fontSize:13}}
                                        type="body-bold"
                                        text="Ups! Sepertinya file dokumen tidak sesuai dengan syarat yang telah disediakan! Silahkan dicek kembali!"
                                    />}
                                    

                                    <VStack top={Spacing[4]}>
                                        {renderTitle('Hashtag', 'untuk Feed', true)}
                                        <TextField
                                            value={values.hashtag}
                                            inputStyle={{ textAlign: 'left', paddingLeft: Spacing[12], borderColor: (submitPressed && errors.hashtag == '') || hashtagTaken ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE}}
                                            maxChar={100}
                                            isRequired={true}
                                            secureTextEntry={false}
                                            isTextArea={true}
                                            placeholder={"#EventMaret2024"}
                                            onChangeText={handleChange("hashtag")}
                                            onBlur={handleBlur('hashtag')}
                                            style={{paddingVertical:0}}
                                            charCounter={true}
                                            multiline={false}
                                            editable={false}
                                        />
                                    </VStack>
                                    {hashtagTaken && (
                                        <Text style={{...styles.errorText,textAlign:'center',marginHorizontal:Spacing[24],marginBottom:Spacing[4],fontSize:13}}
                                            type="body-bold"
                                            text="Hashtag ini telah dipakai, coba ubah judul untuk membuat hashtag lain yaa!"
                                        />
                                    )}

                                    <VStack>
                                        {renderTitle('Deskripsi', 'Acara Ceria', true)}
                                        <TextField
                                            value={values.description}
                                            inputStyle={{ textAlign: 'left', paddingLeft: Spacing[12], borderColor: submitPressed && errors.description == '' ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE}}
                                            maxChar={200}
                                            isRequired={true}
                                            secureTextEntry={false}
                                            isTextArea={true}
                                            placeholder={"Isi Deskripsi Acara Ceriamu Disini!"}
                                            onChangeText={handleChange("description")}
                                            onBlur={handleBlur('description')}
                                            style={{paddingVertical:0}}
                                            charCounter={true}
                                            multiline={true}
                                            numberOfLines={4}
                                        />
                                    </VStack>
                                    
                                    {loadingCategory ?
                                    <ActivityIndicator size={20} color={Colors.ABM_LIGHT_BLUE}/>
                                    :
                                    <VStack top={Spacing[4]}>
                                        {renderTitle('Kategori', 'Acara Ceria', true)}
                                        
                                        <CheckBoxComponent
                                            data={categoryList}
                                            onError={ submitPressed && errors.categoryIds && errors.categoryIds.length == 0 ? true : false}
                                            // onError={false}
                                            onCheckedItemsChange={(v) => handleCheckedItemsChange(v,setFieldValue)}
                                            onTrigger={(v) => setOnTrigger(true)}
                                        />
                                        
                                    </VStack>}

                                    <VStack top={Spacing[4]}>
                                        {renderTitle('Tipe', 'Acara Ceria')}
                                        { loadingType ? <ActivityIndicator size={20} color={Colors.ABM_LIGHT_BLUE}/> :
                                        <DropDownPickerr
                                            open={showTypeList}
                                            value={tipeAcara}
                                            items={typeList}
                                            setOpen={setShowTypeList}
                                            onSelectItem={(v) => {
                                                setFieldValue('typeId', v['value'])
                                            }}
                                            setValue={setTipeAcara}
                                            placeholder={'Pilih Tipe Pelaksanaan'}
                                            style={{
                                                flex: 1,
                                                borderColor: submitPressed && errors.typeId == '' ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE,
                                                borderWidth: Spacing[2],
                                                borderRadius: Spacing[20],
                                                backgroundColor: Colors.WHITE,
                                                zIndex: 1
                                            }}
                                            textStyle={styles.textStyle}
                                        />}
                                    </VStack>
                                    
                                    <Spacer height={Spacing[32]} />
                                    <HStack>
                                        <Button
                                            type={"primary"}
                                            text={"Preview Event"}
                                            style={styles.updateButtonStyle}
                                            textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                                            onPress={() => {
                                                setSubmitPressed(true);
                                                if(!hashtagTaken){
                                                    handleSubmit();
                                                }
                                                // navigation.navigate(
                                                //     'previewEvent',
                                                //     {
                                                //         data: values
                                                //     }
                                                // )
                                            }}
                                        />
                                    </HStack>
                                    <Spacer height={Spacing[32]} />
                                </VStack>
                            </ScrollView>
                            <DateTimePickerModal
                                mode="datetime"
                                is24Hour={true}
                                isVisible={showTimePicker}
                                date={ dateTimePickerType == 'date-start' ? startDate : endDate}
                                onConfirm={(data)=>{
                                    setShowTimePicker(false)
                                    onDateChange(data, setFieldValue, dateTimePickerType == 'date-start' ? 'startTime' : 'endTime')
                                }}
                                onCancel={()=>{setShowTimePicker(false)}}
                                minimumDate={startDate}
                            />
                        </SafeAreaView>
                    )}
                </Formik>
                <Spinner visible={isLoading} textContent={"Memuat..."} />
            </VStack>
        </KeyboardAvoidingView>
    )
})

const styles = StyleSheet.create({
    textStyle: {
        fontFamily: typography.primary,
        color: Colors.ABM_DARK_BLUE,
        // fontSize: Spacing[16],
        fontWeight: 'bold'
    },
    errorText: {
      color: Colors.MAIN_RED,
      alignSelf:'center'
    },
    updateButtonStyle: {
        height: Spacing[32],
        paddingHorizontal: Spacing[16],
        right: 0,
        position: "absolute",
        backgroundColor: Colors.ABM_LIGHT_BLUE
    }
});

export default CreateEvent