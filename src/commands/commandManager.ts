import { CommandType, IDataStore, CommandList, ISimpleCommand, ICustomCommand, ICommandResponse } from "../shared/dataStore";
import { BossVote } from "./pvm/bossVoting";

export class CommandManager {
    private commandDirectory: ICommandDirectory = {}

    constructor () {
        this.buildSimpleCommands();
        this.registerCommand(new BossVote());
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

    async parseMessage (channel: string, userState: Object, message: string) : Promise<ICommandResponse> {
        const messageTokens = message.trim().split(' ');
        const commandID = messageTokens[0];

        const command = this.commandDirectory[commandID];
        if (command === undefined || command === null) return Promise.reject('Non-existant command: ' + commandID);
        
        const commandType: string = typeof command;
        console.log(JSON.stringify(commandType));

        if('data' in command) 
            return Promise.resolve({
                result: (command as ISimpleCommand).data,
                whisper: command.isWhisper
            });
        else
            return (command as ICustomCommand).execute(channel, userState, message);
    
    }
}

export interface ICommandDirectory {
    [index: string]: CommandType
}