import { CommandType, IDataStore, CommandList, ISimpleCommand, ICustomCommand, ICommandResponse } from "../util/dataStore";
import { BossVote } from "./pvm/bossVoting";
import { ModControl } from "./remoteData/modControl";
import { isNullOrUndefined } from "util";
import { replaceMessageData } from "../util/utils";
import { CommandMessages } from "../util/staticData/commands";
import { Join } from "./remoteData/join";
import { Leave } from "./remoteData/leave";

export class CommandManager {
    private commandDirectory: ICommandDirectory = {}
    private whisperCommandDirectory: ICommandDirectory = {}

    constructor (private dataStore: IDataStore) {
        this.buildSimpleCommands();
        this.registerCommand(new BossVote(dataStore));
        this.registerCommand(new ModControl(dataStore));
        this.registerWhisperCommand(new Join(dataStore));
        this.registerWhisperCommand(new Leave(dataStore));
    }
    
    buildSimpleCommands () : void {
        CommandList.forEach(command => {
            command.aliases.forEach(alias => {
                this.commandDirectory[alias] = command;
            });
        });
    }

    registerCommand (command: CommandType): void {
        command.aliases.forEach(alias => {
            this.commandDirectory[alias] = command
        });
    }

    registerWhisperCommand (command: CommandType): void {
        command.aliases.forEach(alias => {
            this.whisperCommandDirectory[alias] = command;
        })
    }

    async parseMessage (channel: string, userState: Object, message: string) : Promise<ICommandResponse> {
        message = message.toLowerCase();
        const messageTokens = message.trim().split(' ');
        const commandID = messageTokens[0];

        const command = this.commandDirectory[commandID];
        if (isNullOrUndefined(command)) return Promise.reject(replaceMessageData(CommandMessages.INEXISTENT_COMMAND, commandID));
        
        if('data' in command) 
            return Promise.resolve({
                result: (command as ISimpleCommand).data,
                whisper: command.isWhisper
            });
        else
            return (command as ICustomCommand).execute(channel, userState, message);
    
    }

    async parseWhisper (channel:string, userState: Object, message: string): Promise<ICommandResponse> {
        message = message.toLowerCase();
        const messageTokens = message.trim().split(' ');
        const commandID = messageTokens[0];

        const command = this.whisperCommandDirectory[commandID];
        if (isNullOrUndefined(command)) return Promise.resolve({result: replaceMessageData(CommandMessages.INEXISTENT_COMMAND, commandID), whisper: true});
        
        if('data' in command) 
            return Promise.resolve({
                result: (command as ISimpleCommand).data,
                whisper: true
            });
        else
            return (command as ICustomCommand).execute(channel, userState, message);
    }
}

export interface ICommandDirectory {
    [index: string]: CommandType
}