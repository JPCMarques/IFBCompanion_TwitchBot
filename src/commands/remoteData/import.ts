import { ICustomCommand, IDataStore, ICommandResponse, IMonster, MONSTER_LIST } from "../../util/dataStore";
import { safeCopyMonster } from "../util";
import { isUserAllowed } from "../../util/permissions";
import { replaceMessageData } from "../../util/utils";
import { CommandMessages, CommandConstants } from "../../util/staticData/commands";
import { getDefaultChannelData } from "../../util/staticData/firebase";
import { isNullOrUndefined } from "util";

/**
 * Used for import command. An example of the import command is:
 * 
 * !import {b:['rax'], p:['corp']}
 * 
 * The rest of the bosses would be derived from the basic monster list. Gibberish is filtered out, and any alias is allowed (if repeated, treated as gibberish).
 * 
 * This command is mostly to be used with my other app, that offers a better GUI for boss list editing.
 */
export class Import implements ICustomCommand {
    isWhisper = true;
    aliases = ['!import', '!i'];

    constructor(private dataStore: IDataStore){ }

    async execute(channel: string, userState: Object, message: string): Promise<ICommandResponse> {
        isUserAllowed(channel, userState, this.dataStore).catch((err) => {
            return Promise.resolve({
                result: err,
                whisper: true
            });
        });

        const spaceIndex = message.indexOf(' ');
        if (spaceIndex === -1){
            return Promise.resolve({
                result: replaceMessageData(CommandMessages.COMMAND_NO_ARGS, CommandConstants.IMPORT_DISPLAY, message),
                whisper: true
            });
        };

        // Parse JSON
        const jsonData = JSON.parse(message.substring(spaceIndex+1)) as IImportData;
        const channelData = getDefaultChannelData();
        const normalList = channelData.normalList;

        // Check banlist
        if (!isNullOrUndefined(jsonData.b)){
            for(var i = 0; i < jsonData.b.length; i++) {
                const bannedItem = jsonData.b[i];
                if (normalList.length === 0) break;

                for (var mlIndex = 0; mlIndex < normalList.length; mlIndex++) {
                    const monsterItem = normalList[mlIndex];
                    if (monsterItem.aliases.indexOf(bannedItem) !== -1) {
                        normalList.splice(mlIndex, 1);
                        channelData.banList.push(monsterItem);
                    }
                }
            }
        }

        // Check preferlist 
        if (!isNullOrUndefined(jsonData.p)){
            for(var i = 0; i < jsonData.p.length; i++) {
                const preferredItem = jsonData.p[i];
                if (normalList.length === 0) break;

                for (var mlIndex = 0; mlIndex < normalList.length; mlIndex++) {
                    const monsterItem = normalList[mlIndex];
                    if (monsterItem.aliases.indexOf(preferredItem) !== -1) {
                        normalList.splice(mlIndex, 1);
                        channelData.banList.push(monsterItem);
                    }
                }
            }
        }

        console.log(JSON.stringify(channelData));
        return Promise.resolve({
            result: CommandConstants.IMPORT_SUCCESS,
            whisper: this.isWhisper
        })
    }

    private convertList(monsterList: string[]): IMonster[] {
        const monsters: IMonster[] = [];
        for(var i = 0; i < MONSTER_LIST.length; i++) {
            const monster = MONSTER_LIST[i];
            if (monsterList.indexOf(monster.displayName.toLowerCase()) !== -1) {
                monsters.push(safeCopyMonster(monster)); //Avoid data contamination
            }
        }
        return monsters;
    }
}

export interface IImportData {
    p?: string[],
    b?: string[],
}