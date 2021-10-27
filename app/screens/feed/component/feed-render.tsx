import {HStack, VStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import {dimensions} from "@config/platform.config";
import {TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import notFeedbackIcon from "@assets/icons/coachingJournal/note-feedback.png";
import Spacer from "@components/spacer";
import {Text} from "@components";
import notIcon from "@assets/icons/coachingJournal/note.png";
import React, {useMemo} from "react";
import {FeedTimelineItems} from "@screens/feed/feed.type"

type FeedItemRenderProps = {
    item: FeedTimelineItems
    index: number
    selectedActivities: string
    onPressActivity(id: string): void
    onPressNote(id: string, post_id: string): void
    onPressFeedback(id: string, post_id: string): void
    onPressNoteFeedback(id: string, post_id: string): void
}

export const FeedItemRender = (
    {
      item,
      index,
      selectedActivities,
      onPressActivity = ()=> null,
      onPressNote = ()=> null,
      onPressFeedback = ()=> null,
      onPressNoteFeedback = ()=> null
    }:FeedItemRenderProps) => {
  
    const dateArr = item.date.split(' ')
  
    // const renderButtonTagged = (isTagged: boolean, id: string, post_id: string) => {
    //   if(isTagged){
    //     return(
    //       <HStack left={Spacing[8]} style={{maxWidth: dimensions.screenWidth - Spacing[128]}}>
    //         <TouchableOpacity onPress={()=>onPressNoteFeedback(id, coach_id)} style={[{backgroundColor: Colors.LIGHT_GRAY, borderRadius: Spacing[12], alignItems: 'center'}, Layout.widthFull]}>
    //           <HStack horizontal={Spacing[8]} style={{minHeight:Spacing[64]}}>
    //             <FastImage style={{
    //               height: Spacing[24],
    //               width: Spacing[24]
    //             }} source={notFeedbackIcon} resizeMode={"contain"}/>
    //             <Spacer width={Spacing[8]} />
    //             <Text type={'body-bold'} style={{lineHeight:Spacing[16]}} text={'Isi catatan &\n' + 'beri feedback.'} numberOfLines={2} />
    //           </HStack>
    //         </TouchableOpacity>
    //       </HStack>
    //     )
    //   }else{
    //     return(
    //       <HStack left={Spacing[8]} style={{maxWidth: dimensions.screenWidth - Spacing[128]}}>
    //         <TouchableOpacity onPress={()=>onPressNote(id, coach_id)} style={{flex:1,backgroundColor: Colors.LIGHT_GRAY, borderTopStartRadius: Spacing[12], borderBottomStartRadius: Spacing[12], alignItems: 'center'}}>
    //           <HStack horizontal={Spacing[8]} style={{minHeight:Spacing[64]}}>
    //             <FastImage style={{
    //               height: Spacing[24],
    //               width: Spacing[24]
    //             }} source={notIcon} resizeMode={"contain"}/>
    //             <Spacer width={Spacing[8]} />
    //             <Text type={'body-bold'} style={{lineHeight:Spacing[16]}} text={'Lihat \ncatatan.'} numberOfLines={2} />
    //           </HStack>
    //         </TouchableOpacity>
    //         <View style={{backgroundColor: Colors.UNDERTONE_BLUE, width: Spacing[1], height: '100%'}} />
    //         <TouchableOpacity onPress={()=>onPressFeedback(id, coach_id)} style={{flex:1,backgroundColor: Colors.LIGHT_GRAY, borderTopEndRadius: Spacing[12], borderBottomEndRadius: Spacing[12], alignItems: 'center'}}>
    //           <HStack horizontal={Spacing[8]} style={{minHeight:Spacing[64]}}>
    //             <FastImage style={{
    //               height: Spacing[24],
    //               width: Spacing[24]
    //             }} source={notFeedbackIcon} resizeMode={"contain"}/>
    //             <Spacer width={Spacing[8]} />
    //             <Text type={'body-bold'} style={{lineHeight:Spacing[16]}} text={'Lihat \nfeedback.'} numberOfLines={2} />
    //           </HStack>
    //         </TouchableOpacity>
    //       </HStack>
    //     )
    //   }
    // }
  
    return(
        
      <HStack>
        <View style={{height: '100%'}}>
          <VStack horizontal={Spacing[8]} vertical={Spacing[2]} style={{flex:1, minWidth: Spacing[72], borderRadius: Spacing[12], alignItems: 'flex-end', justifyContent: 'flex-end', backgroundColor: index % 2 === 0 ? Colors.MAIN_BLUE : Colors.BRIGHT_BLUE}}>
            <Text type={'button'} style={{color:Colors.WHITE, bottom: -Spacing[8]}} text={dateArr[0]} />
            <Text type={'button'} style={{color:Colors.WHITE}} text={dateArr[1]} />
          </VStack>
        </View>
        <VStack style={{alignItems: 'flex-start'}}>
        {console.log(item)}
          {/* {item.activities.map((activitiesItem, activitiesIndex)=>{
  
            let statusColor:string = Colors.MAIN_BLUE
  
            console.log(activitiesItem.type)
            console.log(activitiesItem.coach_id)
            console.log(activitiesItem.learner_id)
            console.log(activitiesItem.is_coached)
  
            if(activitiesItem.is_coached){
              statusColor = Colors.SOFT_GREEN;
            } else {
              switch (activitiesItem.type){
                case "weekly_coaching":
                  statusColor = Colors.HONEY_YELLOW;
                  break;
                case "kumpul_santai":
                  statusColor = Colors.SOFT_PURPLE;
                  break;
                case "coached":
                  statusColor = Colors.SOFT_GREEN;
                  break;
              }
            }
  
            const renderContent = useMemo(()=>{
              if(selectedActivities === activitiesItem.id){
                return(renderButtonTagged(activitiesItem.isTagged, activitiesItem.id, activitiesItem.coach_id))
              }else{
                return(
                  <TouchableOpacity key={activitiesItem.jl_id} onPress={()=>{onPressActivity(activitiesItem.id)}}>
                    <HStack horizontal={Spacing[8]} style={{maxWidth: dimensions.screenWidth - Spacing[144], minHeight:Spacing[64]}}>
                      <View style={{height: Spacing[16], width: Spacing[16], backgroundColor: statusColor, borderRadius: Spacing[128]}} />
                      <Spacer width={Spacing[12]}/>
                      <VStack>
                        <Text type={'body'} style={{}} text={activitiesItem.title} numberOfLines={2} />
                        {activitiesItem.coach_fullname ? <Text type={'body'} style={{fontSize: Spacing[12]}} text={`Coached by ${activitiesItem.coach_fullname}`} numberOfLines={1} /> : null}
                      </VStack>
                    </HStack>
                  </TouchableOpacity>
                )
              }
            },[selectedActivities])
  
            return(
              <VStack style={[Layout.widthFull,{minWidth: dimensions.screenWidth - Spacing[72]}]}>
                {renderContent}
                <View style={{borderBottomWidth: activitiesIndex + 1 === item.activities.length ? 0 : Spacing[1], borderColor: Colors.MAIN_BLUE, paddingTop: Spacing[2], maxWidth: dimensions.screenWidth - Spacing[128]}}/>
              </VStack>
            )
          })} */}
        </VStack>
      </HStack>
    )
  }
  