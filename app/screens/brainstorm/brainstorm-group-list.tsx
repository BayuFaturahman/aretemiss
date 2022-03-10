import React, {FC, useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { HStack, VStack } from "@components/view-stack";
import { GroupIconComponent } from './components/group-icon-component';
import Spacer from "@components/spacer";
import { Colors, Layout, Spacing } from "@styles";
import { Text, BackNavigation, Button } from "@components";
import { StackScreenProps } from "@react-navigation/stack";
import { NavigatorParamList } from "@navigators/idea-pools-navigator";
import { observer } from "mobx-react-lite";
import { useStores } from '../../bootstrap/context.boostrap';
import moment from 'moment';

const BrainstormGroupList: FC<StackScreenProps<NavigatorParamList, "newBrainstormsGroup">> =
  observer(({navigation}) => {
    const { brainstormStore } = useStores();
    const [isLoading, setIsLoading] = useState(false);

    const _goBack = () => navigation.goBack();
    const _goToAddBrainstormGroup = () => navigation.navigate("newBrainstormsGroup");
    const _getBrainstormGroupList = useCallback(async () => {
      setIsLoading(true);
      await brainstormStore.getListBrainstormGroups();
      setIsLoading(false);
    }, []);

    useEffect(() => {
      _getBrainstormGroupList();
    }, []);

    const renderGroupCreatedTime = (timestamp) => {
      const isToday = moment(timestamp).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD') && 'today';
      const isYesterday = moment(timestamp).format('YYYY-MM-DD') === moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD') && 'yesterday';
      const customDate = moment(timestamp).format('DD/MM/YYYY');
      return (
        <View style={{flexDirection: 'row', flex: 1, width: '79%', marginLeft: Spacing[28], marginBottom: Spacing[24]}}>
          <View style={[styles.centerVertical, {width: '60%'}]}>
            <View style={{borderWidth: 0.5, height: 0}}/>
          </View>
          <Text style={{alignSelf: 'flex-end', width: '46%', textAlign: 'right'}}>Initiated {isToday || isYesterday || customDate}</Text>
        </View>
      )
    }

    // header component (title and subtitle)
    const renderHeader = useCallback(() => {
      return (
        <VStack top={Spacing[8]} horizontal={Spacing[12]} bottom={Spacing[12]}>
          <Text
            type={"header"}
            style={styles.titleTxt}
            text="Idea Pools"
          />
          <Spacer height={Spacing[20]} />
          <Text
            type={"body"}
            style={styles.subtitleTxt}
            text="Di sinilah tempat kamu bertukar pikiran bersama dengan rekan kerjamu! Sebagai initiator, kamu bisa menambahkan “brainstorming group” dan mengundang rekan kerjamu untuk saling bertukar ide!"
          />
          <Spacer height={Spacing[48]} />
        </VStack>
      );
    }, []);

    // group list component
    const renderGroupList = useCallback((item: any, index: number) => {
      return (
        <>
        {index === 0 && (
          <View>
            {renderGroupCreatedTime(item.bg_created_at)}
          </View>
        )}
        {index !== 0 ? 
        <>
          {
            moment(item.bg_created_at).format('YYYY-MM-DD') !== moment(brainstormStore?.listBrainstormGroups[index - 1].bg_created_at).format('YYYY-MM-DD') && (
              <View>
                {renderGroupCreatedTime(item.bg_created_at)}
              </View>
            )
          }
        </> : (
          <></>
        )
        }
          <TouchableOpacity key={index} style={styles.groupOuterContainer}>
            <View style={styles.groupInnerContainer}>
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        </>
      )
    }, []);

    return (
      <VStack
        testID="BrainstormGroupList"
        style={styles.outerContainer}
      >
        <VStack style={Layout.flex}>
          <BackNavigation goBack={_goBack} />
          <View style={styles.innerContainer}>
            {renderHeader()}
            <View style={styles.groupListOuterContainer}>
              <Button
                text={'Tambah Group'}
                type={'primary'}
                style={styles.addGroupBtnContainer}
                onPress={_goToAddBrainstormGroup}
              />
              <Spacer height={Spacing[48]} />
              <FlatList
                ListHeaderComponent={
                  <>
                    <HStack horizontal={Spacing[24]}>
                      <Text type={"left-header"} text="Brainstorming groups" />
                    </HStack>
                    <Spacer height={Spacing[24]} />
                  </>
                }
                data={brainstormStore?.listBrainstormGroups}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => renderGroupList(item, index)}
              />
            </View>
          </View>
        </VStack>
      </VStack>
    )
})

const styles = StyleSheet.create({
  addGroupBtnContainer: {
    left: '30%',
    position: 'absolute',
    right: '30%',
    top: '-2%',
  },
  centerVertical: {
    justifyContent: 'center',
  },
  groupInnerContainer: {
    padding: Spacing[12],
  },
  groupListOuterContainer: {
    backgroundColor: Colors.WHITE,
    borderTopEndRadius: Spacing[48],
    borderTopStartRadius: Spacing[48],
    height: '100%',
  },
  groupOuterContainer: {
    borderColor: Colors.UNDERTONE_BLUE,
    borderRadius: Spacing[14],
    borderWidth: 2,
    marginBottom: Spacing[14],
    marginHorizontal: Spacing[28],
  },
  innerContainer: {
    backgroundColor: Colors.UNDERTONE_BLUE,
  },
  outerContainer: {
    backgroundColor: Colors.UNDERTONE_BLUE,
    flex: 1,
    justifyContent: "center",
  },
  subtitleTxt: {
    alignSelf: 'center',
    color: Colors.WHITE,
    textAlign: "center",
    width: '90%',
  },
  titleTxt: {
    color: Colors.WHITE,
    fontSize: Spacing[16],
  },
});

export default BrainstormGroupList;
