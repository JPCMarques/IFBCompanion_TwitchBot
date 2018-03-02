import { CommandType, IDataStore, CommandList, ISimpleCommand, ICustomCommand, ICommandResponse, WhisperCommandList } from "../util/dataStore";
import { BossVote } from "./pvm/bossVoting";
import { ModControl } from "./remoteData/modControl";
import { isNullOrUndefined, isNull } from "util";
import { replaceMessageData } from "../util/utils";
import { CommandMessages } from "../util/staticData/commands";
import { Join } from "./remoteData/join";
import { Leave } from "./remoteData/leave";
import { BanBoss } from "./pvm/bossManagement/banBoss";
import { PreferBoss } from "./pvm/bossManagement/preferBoss";
import { ResetBoss } from "./pvm/bossManagement/resetBoss";
import { ResetAllBosses } from "./pvm/bossManagement/resetAllBosses";
import { preCleanMessage } from "./util";
import { Import } from "./remoteData/import";
import { Export } from "./remoteData/export";

export class CommandManager {
    private commandDirectory: ICommandDirectory = {}
    private whisperCommandDirectory: ICommandDirectory = {}

    constructor (private dataStore: IDataStore) {
        this.buildSimpleCommands();
        this.buildWhisperSimpleCommands();

        this.registerCommands(new BossVote(dataStore));

        this.registerWhisperCommands(new Join(dataStore),
                                     new Leave(dataStore),
                                     new Import(dataStore),
                                     new Export(dataStore));

        this.registerSharedCommands(new BanBoss(dataStore),
                                    new PreferBoss(dataStore),
                                    new ResetBoss(dataStore),
                                    new ModControl(dataStore),
                                    new ResetAllBosses(dataStore));
    } 
    
    buildSimpleCommands () : void {
        CommandList.forEach(command => {
            command.aliases.forEach(alias => {
                this.commandDirectory[alias] = command;
            });
        });
    }

    buildWhisperSimpleCommands(): void {
        WhisperCommandList.forEach(command => {
            command.aliases.forEach(alias => {
                this.whisperCommandDirectory[alias] = command;
            });
        });
    }

    registerCommands (...commands: CommandType[]): void {
        commands.forEach(command => {
            command.aliases.forEach(alias => {
                this.commandDirectory[alias] = command
            });
        });
    }

    registerWhisperCommands (...commands: CommandType[]): void {
        commands.forEach(command => {
            command.aliases.forEach(alias => {
                this.whisperCommandDirectory[alias] = command;
            });
        });
    }

    registerSharedCommands(...commands: CommandType[]): void {
        commands.forEach(command => {
            command.aliases.forEach(alias => {
                this.commandDirectory[alias] = command;
                this.whisperCommandDirectory[alias] = command;
            });
            if(!isNullOrUndefined(command.extraWhisperAliases)) command.extraWhisperAliases.forEach(alias => {
                this.whisperCommandDirectory[alias] = command;
            });
            if(!isNullOrUndefined(command.extraChatAliases)) command.extraChatAliases.forEach(alias => {
                this.commandDirectory[alias] = command;
            });
        });
    }

    async parseMessage (channel: string, userState: Object, message: string) : Promise<ICommandResponse> {
        message = preCleanMessage(message);
        const messageTokens = message.split(' ');
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
        message = preCleanMessage(message);
        const messageTokens = message.split(' ');
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