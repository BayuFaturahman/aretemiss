import React from "react";
import {Spacing} from "@styles"

import {
    AngryBw, AngryColor,
    HappyBw, HappyColor,
    IconSadBw, IconSadColor,
    IconSickBw, IconSickColor,
    IconSurprisedBw, IconSurprisedColor,
} from "@assets/svgs"

type MoodProps = {
    data: string
    height?: number
    width?: number
}

export const MoodComponent = ({data, height=Spacing[42], width=Spacing[42]}: MoodProps) => {

    if (data === 'senang') {
        return <HappyColor height={height} width={width}/>
    } else if (data === 'senangBorder') {
        return <HappyColor height={height} width={width}/>
    } else if (data === 'senangInactive') {
        return <HappyBw height={height} width={width}/>
    } else if (data === 'marah') {
        return <AngryColor height={height} width={width}/>
    } else if (data === 'marahBorder') {
        return <AngryColor height={height} width={width}/>
    } else if (data === 'marahInactive') {
        return <AngryBw height={height} width={width}/>
    } else if (data === 'sedih') {
        return <IconSadColor height={height} width={width}/>
    } else if (data === 'sedihBorder') {
        return <IconSadColor height={height} width={width}/>
    } else if (data === 'sedihInactive') {
        return <IconSadBw height={height} width={width}/>
    } else if (data === 'sakit') {
        return <IconSickColor height={height} width={width}/>
    } else if (data === 'sakitBorder') {
        return <IconSickColor height={height} width={width}/>
    } else if (data === 'sakitInactive') {
        return <IconSickBw height={height} width={width}/>
    } else if (data === 'terkejut') {
        return <IconSurprisedColor height={height} width={width}/>
    } else if (data === 'terkejutBorder') {
        return <IconSurprisedColor height={height} width={width}/>
    } else if (data === 'terkejutInactive') {
        return <IconSurprisedBw height={height} width={width}/>
    } else {
        return <HappyBw height={height} width={width}/>
    }

}
