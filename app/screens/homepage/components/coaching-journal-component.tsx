import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Spacing} from "@styles";
import {TouchableOpacity} from "react-native";
import FastImage from "react-native-fast-image";
import {CoachingJournalItem} from "@screens/coaching-journal/coaching-journal.type";
import {Text} from "@components";
import Spacer from "@components/spacer";
import {EmptyList} from "@screens/notification/components/empty-list";
import sad from "@assets/icons/homepage/sad.png";
import {CoachingJournalItemRender} from "@screens/coaching-journal/components/coaching-journal-item-render";
import downArrow from "@assets/icons/down-arrow.png";
import {IconSadColor} from "@assets/svgs";

export type CoachingJournalComponentProps = {
  data: CoachingJournalItem;
  onPressActivity(): void;
  selectedActivities(): void;
  onPressNote(): void;
  onPressFeedback(): void;
  onPressNoteCoachee(): void;
  goToCoaching(): void
  userId: string
}


export const CoachingJournalComponent = ({
   data,
   onPressActivity,
   selectedActivities,
   onPressNote,
   onPressFeedback,
   onPressNoteCoachee,
   goToCoaching = ()=> null,
   userId
  }:CoachingJournalComponentProps) => {

  if(data === null){
    return(
      <VStack>
        <Text type={'left-header'} style={{fontSize: Spacing[16]}} underlineWidth={Spacing[72]} text="Coaching Journal." />
        <Spacer width={Spacing[24]} />
        <EmptyList buttonLabel={'Tambah sekarang!'}
                   description={'Kamu belum menambahkan catatan coaching journal.'}
                   imageSource={()=> <IconSadColor height={Spacing[42]} width={Spacing[42]}/>} navigateTo={goToCoaching}/>
      </VStack>
    )
  }

  return(
    <>
      <TouchableOpacity onPress={goToCoaching}>
        <Text type={'left-header'} style={{fontSize: Spacing[16]}} underlineWidth={Spacing[72]} text="Coaching Journal." />
      </TouchableOpacity>
      <Spacer height={Spacing[8]} />
      <CoachingJournalItemRender
        item={data}
        index={0}
        onPressActivity={onPressActivity}
        selectedActivities={selectedActivities}
        onPressNote={onPressNote}
        onPressFeedback={onPressFeedback}
        onPressNoteCoachee={onPressNoteCoachee}
        userId={userId}
        isHomepageComponent
      />
      <HStack top={Spacing[4]}>
        <Spacer />
        <TouchableOpacity onPress={goToCoaching}>
          <FastImage style={{
            height: Spacing[24],
            width: Spacing[24],
            borderRadius: Spacing[8]
          }} source={downArrow} resizeMode={"contain"}/>
        </TouchableOpacity>
        <Spacer />
      </HStack>
    </>
  )

}
