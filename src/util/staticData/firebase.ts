import { IGenericMessage } from "../utils";
import { MONSTER_LIST } from "../dataStore";

export abstract class FirebaseMessages {
    static readonly GET_SUCCESS: IGenericMessage = {
        message: 'Get on path "$1" completed successfully.',
        expectedArguments: 1
    }

    static readonly GET_FAIL: IGenericMessage = {
        message: 'Get on the path "$0" failed with message:\n$1',
        expectedArguments: 2
    }
}

export enum FirebaseConstants {
    CHANNEL_LIST_PATH = 'constants/pvm/channelList',
    CHANNEL_DATA_PATH = 'constants/pvm/channelData'
}

export const getDefaultChannelData = () => {return {
    modsEnabled: false,
    banList: [],
    normalList: MONSTER_LIST,
    preferList: []
}}