import {HStack, VStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import {dimensions} from "@config/platform.config";
import {TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import notFeedbackIcon from "@assets/icons/coachingJournal/note-feedback.png";
import Spacer from "@components/spacer";
import {Text} from "@components";
import notIcon from "@assets/icons/coachingJournal/note.png";
import React from "react";
import {CoachingJournalItem} from "@screens/coaching-journal/coaching-journal.type";

type CoachingJournalItemRenderProps = {
  item: CoachingJournalItem
  index: number
  selectedActivities: string
  onPressActivity(id: string): void
  onPressNote(id: string, coach_id: string): void
  onPressFeedback(id: string, coach_id: string): void
  onPressNoteFeedback(id: string, coach_id: string): void
}

export const CoachingJournalItemRender = (
  {
    item,
    index,
    selectedActivities,
    onPressActivity = ()=> null,
    onPressNote = ()=> null,
    onPressFeedback = ()=> null,
    onPressNoteFeedback = ()=> null
  }:CoachingJournalItemRenderProps) => {

  const dateArr = item.date.split(' ')

  const renderButtonTagged = (isTagged: boolean, id: string, coach_id: string) => {
    if(isTagged){
      return(
        <HStack left={Spacing[8]} style={{maxWidth: dimensions.screenWidth - Spacing[128]}}>
          <TouchableOpacity onPress={()=>onPressNoteFeedback(id, coach_id)} style={[{backgroundColor: Colors.LIGHT_GRAY, borderRadius: Spacing[12], alignItems: 'center'}, Layout.widthFull]}>
            <HStack horizontal={Spacing[8]} style={{minHeight:Spacing[64]}}>
              <FastImage style={{
                height: Spacing[24],
                width: Spacing[24]
              }} source={notFeedbackIcon} resizeMode={"contain"}/>
              <Spacer width={Spacing[8]} />
              <Text type={'body-bold'} style={{lineHeight:Spacing[16]}} text={'Isi catatan &\n' + 'beri feedback.'} numberOfLines={2} />
            </HStack>
          </TouchableOpacity>
        </HStack>
      )
    }else{
      return(
        <HStack left={Spacing[8]} style={{maxWidth: dimensions.screenWidth - Spacing[128]}}>
          <TouchableOpacity onPress={()=>onPressNote(id, coach_id)} style={{flex:1,backgroundColor: Colors.LIGHT_GRAY, borderTopStartRadius: Spacing[12], borderBottomStartRadius: Spacing[12], alignItems: 'center'}}>
            <HStack horizontal={Spacing[8]} style={{minHeight:Spacing[64]}}>
              <FastImage style={{
                height: Spacing[24],
                width: Spacing[24]
              }} source={notIcon} resizeMode={"contain"}/>
              <Spacer width={Spacing[8]} />
              <Text type={'body-bold'} style={{lineHeight:Spacing[16]}} text={'Lihat \ncatatan.'} numberOfLines={2} />
            </HStack>
          </TouchableOpacity>
          <View style={{backgroundColor: Colors.UNDERTONE_BLUE, width: Spacing[1], height: '100%'}} />
          <TouchableOpacity onPress={()=>onPressFeedback(id, coach_id)} style={{flex:1,backgroundColor: Colors.LIGHT_GRAY, borderTopEndRadius: Spacing[12], borderBottomEndRadius: Spacing[12], alignItems: 'center'}}>
            <HStack horizontal={Spacing[8]} style={{minHeight:Spacing[64]}}>
              <FastImage style={{
                height: Spacing[24],
                width: Spacing[24]
              }} source={notFeedbackIcon} resizeMode={"contain"}/>
              <Spacer width={Spacing[8]} />
              <Text type={'body-bold'} style={{lineHeight:Spacing[16]}} text={'Lihat \nfeedback.'} numberOfLines={2} />
            </HStack>
          </TouchableOpacity>
        </HStack>
      )
    }
  }

  return(
    <HStack>
      <View style={{height: '100%'}}>
        <VStack horizontal={Spacing[8]} vertical={Spacing[2]} style={{flex:1, minWidth: Spacing[72], borderRadius: Spacing[12], alignItems: 'flex-end', justifyContent: 'flex-end', backgroundColor: index % 2 === 0 ? Colors.MAIN_BLUE : Colors.BRIGHT_BLUE}}>
          <Text type={'button'} style={{color:Colors.WHITE, bottom: -Spacing[8]}} text={dateArr[0]} />
          <Text type={'button'} style={{color:Colors.WHITE}} text={dateArr[1]} />
        </VStack>
      </View>
      <VStack style={{alignItems: 'flex-start'}}>

        {item.activities.map((activitiesItem, activitiesIndex)=>{

          let statusColor:string = Colors.MAIN_BLUE

          if(activitiesItem.is_coachee){
            statusColor = Colors.SOFT_GREEN;
          } else {
            // switch (activitiesItem.type){
            //   case "formal_coaching":
                statusColor = Colors.HONEY_YELLOW;
              //   break;
              // case "informal_coaching":
              //   statusColor = Colors.SOFT_PURPLE;
              //   break;
              // case "coached":
              //   statusColor = Colors.SOFT_GREEN;
                // break;
            // }
          }

          // const renderContent = useMemo(()=>{
          //   if(selectedActivities === activitiesItem.id){
          //     return(renderButtonTagged(activitiesItem.isTagged, activitiesItem.id, activitiesItem.coach_id))
          //   }else{
          //     return(
          //       <TouchableOpacity key={activitiesItem.jl_id} onPress={()=>{onPressActivity(activitiesItem.id)}}>
          //         <HStack horizontal={Spacing[8]} style={{maxWidth: dimensions.screenWidth - Spacing[144], minHeight:Spacing[64]}}>
          //           <View style={{height: Spacing[16], width: Spacing[16], backgroundColor: statusColor, borderRadius: Spacing[128]}} />
          //           <Spacer width={Spacing[12]}/>
          //           <VStack>
          //             <Text type={'body'} style={{}} numberOfLines={1} >
          //               {activitiesItem.is_coachee ?
          //                 <VStack style={{backgroundColor: Colors.SOFT_GREEN, paddingHorizontal: Spacing[8], alignItems: 'center', justifyContent: 'center', borderRadius: Spacing[48], maxWidth: Spacing[64]}}>
          //                   <Text type={'body'} text={activitiesItem.title} numberOfLines={1} />
          //                 </VStack>
          //                 : <Text type={'body'} text={activitiesItem.title} numberOfLines={1} /> }
          //             </Text>
          //             {activitiesItem.coach_fullname ?
          //               <Text type={'body-bold'} style={{color: statusColor, fontSize: Spacing[12]}} numberOfLines={1} >
          //                 {activitiesItem.is_coachee ? `Coached by ` : 'You Coached '}
          //                 {activitiesItem.is_coachee ? <Text type={'body'} style={{color: Colors.UNDERTONE_BLUE}}>
          //                   {`${activitiesItem.coach_fullname}`}
          //                 </Text> :
          //                   <Text type={'body'} style={{color: Colors.UNDERTONE_BLUE}}>
          //                     {`${activitiesItem.learner_fullname}`}
          //                   </Text>
          //                 }
          //               </Text> : null}
          //           </VStack>
          //         </HStack>
          //       </TouchableOpacity>
          //     )
          //   }
          // },[selectedActivities, item, index])

          return(
            <VStack style={[Layout.widthFull,{minWidth: dimensions.screenWidth - Spacing[72]}]}>
              {/* {renderContent} */}
              {selectedActivities === activitiesItem.id ? renderButtonTagged(activitiesItem.isTagged, activitiesItem.id, activitiesItem.coach_id) :
                <TouchableOpacity key={activitiesItem.jl_id} onPress={()=>{onPressActivity(activitiesItem.id)}}>
                  <HStack horizontal={Spacing[8]} style={{maxWidth: dimensions.screenWidth - Spacing[144], minHeight:Spacing[64]}}>
                    <View style={{height: Spacing[16], width: Spacing[16], backgroundColor: statusColor, borderRadius: Spacing[128]}} />
                    <Spacer width={Spacing[12]}/>
                    <VStack style={Layout.widthFull}>
                      <HStack>
                        <VStack style={{backgroundColor: activitiesItem.is_coachee ? Colors.SOFT_GREEN : Colors.WHITE,
                          paddingHorizontal: activitiesItem.is_coachee ? Spacing[8] : 0, alignItems: 'center', justifyContent: 'center', borderRadius: Spacing[48]}}>
                          <Text type={'body'} style={{}} numberOfLines={1} >
                            {activitiesItem.is_coachee ?
                              <Text type={'body'} text={activitiesItem.title} numberOfLines={1} />
                              : <Text type={'body'} text={activitiesItem.title} numberOfLines={1} /> }
                          </Text>
                        </VStack>
                      </HStack>
                      {activitiesItem.coach_fullname ?
                        <Text type={'body-bold'} style={{color: statusColor, fontSize: Spacing[12]}} numberOfLines={1} >
                          {activitiesItem.is_coachee ? `Coached by ` : 'You Coached '}
                          {activitiesItem.is_coachee ? <Text type={'body'} style={{color: Colors.UNDERTONE_BLUE}}>
                              {`${activitiesItem.coach_fullname}`}
                            </Text> :
                            <Text type={'body'} style={{color: Colors.UNDERTONE_BLUE}}>
                              {`${activitiesItem.learner_fullname}`}
                            </Text>
                          }
                        </Text> : null}
                    </VStack>
                  </HStack>
                </TouchableOpacity>
              }
              <View style={{borderBottomWidth: activitiesIndex + 1 === item.activities.length ? 0 : Spacing[1], borderColor: Colors.MAIN_BLUE, paddingTop: Spacing[2], maxWidth: dimensions.screenWidth - Spacing[128]}}/>
            </VStack>
          )
        })}
      </VStack>
    </HStack>
  )
}
