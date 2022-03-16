import React, {FC, useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
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
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const _goBack = () => navigation.goBack();
    const _goToAddBrainstormGroup = () => navigation.navigate("newBrainstormsGroup");
    const _getBrainstormGroupList = useCallback(async () => {
      setIsLoading(true);
      await brainstormStore.getListBrainstormGroups();
      setIsLoading(false);
      setRefreshing(false);
    }, []);
    const _onRefresh = useCallback(() => {
      setRefreshing(true);
    }, []);

    useEffect(() => {
      _getBrainstormGroupList();
    }, []);

    useEffect(() => {
      if (refreshing) {
        _getBrainstormGroupList();
      }
    }, [refreshing]);

    const renderGroupCreatedTime = (timestamp) => {
      const isToday = moment(timestamp).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD') && 'today';
      const isYesterday = moment(timestamp).format('YYYY-MM-DD') === moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD') && 'yesterday';
      const customDate = moment(timestamp).format('DD/MM/YYYY');
      return (
        <View style={styles.groupCreatedTimeOuterContainer}>
          <View style={[styles.centerVertical, styles.groupCreatedTimeLineContainer]}>
            <View style={styles.groupCreatedTimeLine}/>
          </View>
          <Text type={'label'} style={styles.groupCreatedTimeTxt}>Initiated {isToday || isYesterday || customDate}</Text>
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

    const renderGroupListContent = useCallback((item: any) => {
      return (
        <>
          <GroupIconComponent data={!item?.bg_is_selected ? `${item?.bg_icon}` : `${item?.bg_icon}Inactive`} />
          <View style={styles.centerVertical}>
            <View style={styles.groupListContentDetail}>
              <Text type={'body-bold'} style={styles.groupNameTxt} numberOfLines={1} ellipsizeMode={'tail'}>{item?.bg_name}</Text>
              <Text type={'body'} style={styles.groupSubTxt} numberOfLines={1} ellipsizeMode={'tail'}>Initiated by {item?.bg_initiator_name}</Text>
            </View>
          </View>
        </>
      )
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
        {index !== 0 &&
          <>
            {
              moment(item.bg_created_at).format('YYYY-MM-DD') !== moment(brainstormStore?.listBrainstormGroups[index - 1].bg_created_at).format('YYYY-MM-DD') && (
                <View>
                  {renderGroupCreatedTime(item.bg_created_at)}
                </View>
              )
            }
          </>
        }
          <TouchableOpacity key={index} style={[styles.groupOuterContainer, item?.bg_is_selected && styles.disabledGroupContainer]}>
            <View style={styles.groupInnerContainer}>
              {renderGroupListContent(item)}
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
              {isLoading ? (
                <ActivityIndicator size={'large'} color={Colors.UNDERTONE_BLUE} />
              ) : (
                <FlatList
                  contentContainerStyle={{paddingBottom: 50 * 10}}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
                  }
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
              )}
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
  disabledGroupContainer: {
    backgroundColor: Colors.CLOUD_GRAY,
  },
  groupCreatedTimeLine: {
    borderWidth: 0.5,
    height: 0,
  },
  groupCreatedTimeLineContainer: {
    width: '65%',
  },
  groupCreatedTimeOuterContainer: {
    flexDirection: 'row',
    marginBottom: Spacing[24],
    marginLeft: Spacing[28],
    width: '79%',
  },
  groupCreatedTimeTxt: {
    alignSelf: 'flex-end',
    textAlign: 'right',
    width: '40%',
  },
  groupInnerContainer: {
    flexDirection: 'row',
    padding: Spacing[12],
  },
  groupListContentDetail: {
    marginLeft: Spacing[20],
  },
  groupListOuterContainer: {
    backgroundColor: Colors.WHITE,
    borderTopEndRadius: Spacing[48],
    borderTopStartRadius: Spacing[48],
    height: '100%',
  },
  groupNameTxt: {
    fontSize: Spacing[18],
    width: 200,
  },
  groupOuterContainer: {
    borderColor: Colors.UNDERTONE_BLUE,
    borderRadius: Spacing[14],
    borderWidth: 2,
    marginBottom: Spacing[14],
    marginHorizontal: Spacing[28],
  },
  groupSubTxt: {
    fontSize: Spacing[15],
    width: 200,
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
