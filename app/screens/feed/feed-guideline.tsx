import React, {FC} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '@navigators/main-navigator';
import { HStack, VStack } from '@components/view-stack';
import FastImage from 'react-native-fast-image';
import {BackNavigation, Text} from '@components';
import { Colors, Layout, Spacing } from '@styles';
import { observer } from 'mobx-react-lite';
import logoBottom from '@assets/icons/ilead-bottom-logo.png';

const FeedGuideline: FC<StackScreenProps<NavigatorParamList, "feedGuideline">> = observer(
  ({ navigation, route }) => {
    const goBack = () => {
      navigation.goBack()
    }
    return (
      <VStack
      testID="feedTimelineMain"
      style={styles.outer}
    >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <VStack top={Spacing[42]} horizontal={Spacing[14]}>
            <Text type={'header'} underlineWidth={225}>Guideline Feed</Text>
            <VStack top={Spacing[32]}>
              <HStack horizontal={Spacing[20]} style={styles.scrollBox}>
                <ScrollView>
                  <Text>Test</Text>
                </ScrollView>
              </HStack>
            </VStack>
          </VStack>
        </SafeAreaView>
        <FastImage style={styles.bottomLogo} source={logoBottom} resizeMode={"contain"}/>
      </VStack>
    )
  },
)

const styles = StyleSheet.create({
  bottomLogo: {
    bottom: 0,
    height: Spacing[72],
  },
  outer: {
    backgroundColor: Colors.WHITE,
    flex: 1,
    justifyContent: "center",
  },
  scrollBox: {
    borderColor: Colors.UNDERTONE_BLUE,
    borderRadius: Spacing[20],
    borderWidth: 1.5,
    height: 410,
  },
})

export default FeedGuideline;