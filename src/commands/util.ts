import { IDataStore, IChannelData, IMonster } from "../util/dataStore";
import { isNullOrUndefined } from "util";
import { OtherConstants } from "../util/staticData/other";


export function isChannelMod (channel: string, userState: Object, dataStore: IDataStore): boolean {
    return userState['user-type'] === 'mod' && dataStore.channelData[channel.replace('#', '')].modsEnabled;
}

export function isChannelOwner (channel:string, userState: Object): boolean {
    return '#' + userState['username'] === channel;
}

export function ensureChannelDataLists (channelData: IChannelData): void {
    if (isNullOrUndefined(channelData.normalList)) channelData.normalList = [];
    if (isNullOrUndefined(channelData.preferList)) channelData.preferList = [];
    if (isNullOrUndefined(channelData.banList)) channelData.banList = [];
}

export function getChannelOwner(channel: string): string {
    return channel.replace('#', '');
}

export function listBosses(monsterList: IMonster[]): string {
    const monsterCount = monsterList.length;
    if (monsterCount === 0) return OtherConstants.EMPTY_BOSS_LIST;

    let monsters = monsterList[0].displayName;
    for(var i = 1; i < monsterCount; i++) {
        monsters += ', ' + monsterList[i].displayName;
    }
    return monsters;
}

export function preCleanMessage(message: string): string {
    return message.toLowerCase().trim();
}

export function safeCopyMonster(monster: IMonster): IMonster {
    return {...monster, aliases: [...monster.aliases]};
}