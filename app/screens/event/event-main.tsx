import React, { FC, useEffect, useState } from "react"
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    BackHandler,
    Alert,
    ScrollView,
    View,
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
import RNAnimated from "react-native-animated-component"
import { EventContainer } from "./component/event-container"
import { TouchableOpacity } from "react-native"
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { presets } from "@components/text/text.presets"
import { LoadingComponent } from "@components/loader/loader"
import { useFocusEffect } from "@react-navigation/native"
const EventMain: FC<StackScreenProps<NavigatorParamList, "eventMain">> = observer(({ navigation, route }) => {

    const { eventStore, eventApi } = useStores()
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Acara Mendatang' },
        { key: 'second', title: 'Acara Tuntas' },
        { key: 'third', title: 'Acara Anda' },
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getType()
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (route.params && route.params.triggerRefresh) {
                refreshData();
            }
            return () => {
                // Clean up any side-effects if needed
            };
        }, [])
    );

    const getType = async () => {
        await eventStore.getEvent()
        await eventStore.getListCategory('category-event')
        await eventStore.getListCategory('type-event')
    }

    const refreshData = async () => {
        setLoading(true)
        await eventStore.getEvent()
        setLoading(false)
    }

    const FirstRoute = () => (
        loading ? <LoadingComponent /> : <ScrollView style={{ marginTop: rHeight(2) }}>
            {eventStore.listEvent.length > 0 &&
                eventStore.listEvent.map((e) =>
                    !e.isFinished &&
                    <TouchableOpacity onPress={() => navigation.navigate('eventDetail', { id: e.id })}>
                        <View style={{ alignItems: 'center' }}>
                            <EventContainer data={e} width={rWidth(53)} />
                            <View style={{ height: 2, width: rWidth(100), backgroundColor: 'black', marginVertical: rHeight(2) }} />
                        </View>
                    </TouchableOpacity>
                )
            }
        </ScrollView>
    );

    const SecondRoute = () => (
        loading ? <LoadingComponent /> : <ScrollView style={{ marginTop: rHeight(2) }}>
            {eventStore.listEvent.length > 0 &&
                eventStore.listEvent.map((e) =>
                    e.isFinished &&
                    <View style={{ alignItems: 'center' }}>
                        <EventContainer data={e} width={rWidth(53)} />
                        <View style={{ height: 2, width: rWidth(100), backgroundColor: 'black', marginVertical: rHeight(2) }} />
                    </View>
                )
            }
        </ScrollView>
    );

    const ThirdRoute = () => (
        loading ? <LoadingComponent /> : <ScrollView style={{ marginTop: rHeight(2) }}>
            {eventStore.listEvent.length > 0 &&
                eventStore.listEvent.map((e) =>
                    e.isMe &&
                    <View style={{ alignItems: 'center' }}>
                        <EventContainer data={e} width={rWidth(53)} />
                        <View style={{ height: 2, width: rWidth(100), backgroundColor: 'black', marginVertical: rHeight(2) }} />
                    </View>
                )
            }
        </ScrollView>
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third: ThirdRoute,
    });

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: Colors.ABM_YELLOW }}
            style={{ backgroundColor: 'white', color: 'black' }}
            labelStyle={{ ...presets.default, textAlign: 'center', textTransform: 'capitalize' }}
        />
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={Layout.flex}
        >
            <HStack bottom={rHeight(5)} top={Spacing[20]} style={{ justifyContent: 'center', backgroundColor: Colors.ABM_BG_BLUE, marginBottom: rHeight(-2) }}>
                <Button type={"light-blue"}
                    text={"◂ Kembali"}
                    style={{ paddingHorizontal: rWidth(3), backgroundColor: 'transparent', position: 'absolute', left: 0 }}
                    textStyle={{ color: Colors.ABM_DARK_BLUE }}
                    onPress={() => {
                        navigation.goBack()
                    }} />

                <Text
                    type={"left-header"}
                    underlineWidth={rWidth(25)}
                    text="Acara Ceria."
                    style={{ marginTop: rHeight(1) }}
                />
            </HStack>
            <VStack
                style={{ flex: 1, backgroundColor: Colors.WHITE, justifyContent: "center", borderWidth: 2, borderBottomWidth: 0, borderTopColor: Colors.ABM_DARK_BLUE, borderTopLeftRadius: 20, borderTopRightRadius: 20, }}
            >
                <View style={{
                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    marginTop: rHeight(3),
                }}>
                    <VStack style={{ alignItems: 'center' }}>
                        <Text
                            type={"left-header"}
                            underlineWidth={rWidth(33)}
                            text="List Acara Ceria."
                            style={{ marginTop: rHeight(1) }}
                        />
                    </VStack>

                </View>

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    renderTabBar={renderTabBar}
                // initialLayout={{ width: layout.width }}
                />
                <RNAnimated appearFrom={"bottom"} animationDuration={500} style={{ position: "absolute", bottom: Spacing[12], alignSelf: 'center' }}>
                    <HStack
                        alignment={"center"}
                        style={{
                            width: "100%",
                            height: Spacing[96],
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Button type={"primary"} text={"Buat Event"} textStyle={{ fontSize: 18 }}
                            style={{ paddingHorizontal: rWidth(5), ...Layout.shadow }}
                            onPress={() => navigation.navigate('createEvent')}
                        />
                    </HStack>
                </RNAnimated>
            </VStack>
        </KeyboardAvoidingView>
    )
})

export default EventMain