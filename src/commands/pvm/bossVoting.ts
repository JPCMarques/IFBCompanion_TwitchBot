import { IDataStore, ICustomCommand, IMonster, MonsterList, ICommandResponse } from "../../util/dataStore";
import { isChannelMod, isChannelOwner } from "../util";
import { isUserAllowed } from "../../util/permissions";
import { CommandConstants, CommandMessages } from "../../util/staticData/commands";
import { replaceMessageData } from "../../util/utils";

export class BossVote implements ICustomCommand {
    aliases = ['!bossvote', '!bvote', '!bv'];
    isWhisper = false;

    constructor(private dataStore: IDataStore) {}

    ongoingVotes = new Map<string, IChannelVotes>();

    async execute(channel: string, userState: Object, message: string): Promise<ICommandResponse> {
        message = message.substring(message.indexOf(' ') + 1);
        let isAllowed: boolean;

        

        const hasOngoingVote = this.ongoingVotes.has(channel);
        const messageTokens = message.split(' ');
        switch(messageTokens[0]){
            case BossVoteCommands.START:
                await isUserAllowed(channel, userState, this.dataStore).catch ((err) => {
                    return Promise.resolve({
                        result: err,
                        whisper: true
                    });
                })
                if (!hasOngoingVote){
                    this.ongoingVotes.set(channel, {bossVotes: [], voters: []});
                    return Promise.resolve({
                        result: CommandConstants.BOSS_VOTE_START_SUCCESS,
                        whisper: this.isWhisper
                    });
                }
                else{
                    return Promise.resolve({
                        result: CommandConstants.BOSS_VOTE_START_FAIL,
                        whisper: true
                    })
                }
            case BossVoteCommands.STOP:
                await isUserAllowed(channel, userState, this.dataStore).catch((err) => {
                    return Promise.resolve({
                        result: err,
                        whisper: true
                    });
                })
                if (hasOngoingVote){
                    let monsters = [...this.ongoingVotes.get(channel).bossVotes];
                    let voteCounter = new Map<IMonster, number>();
                    
                    let highestVote: IMonster;
                    let highestVoteCount = 0;

                    this.ongoingVotes.delete(channel);
                    for(var i = 0; i < monsters.length; i++){
                        if (!voteCounter.has(monsters[i])) {
                            voteCounter.set(monsters[i], 1);
                        }
                        else {
                            voteCounter.set(monsters[i], voteCounter.get(monsters[i]) + 1)
                        }
                        if(voteCounter.get(monsters[i]) > highestVoteCount){
                            highestVote = monsters[i];
                            highestVoteCount =  voteCounter.get(monsters[i]);
                        }
                    }

                    return Promise.resolve({
                        result: replaceMessageData(CommandMessages.BOSS_VOTE_STOP_SUCCESS, highestVote.displayName, highestVoteCount),
                        whisper: this.isWhisper
                    });
                }
                else{
                    return Promise.resolve({
                        result: CommandConstants.BOSS_VOTE_STOP_FAIL,
                        whisper: true
                    });
                }
                
            default:
                if(hasOngoingVote) {
                    const voterIndex = this.ongoingVotes.get(channel).voters.indexOf(userState['username']);
                    if (voterIndex !== -1) return Promise.resolve({
                        result: replaceMessageData(CommandMessages.BOSS_VOTE_DBLCAST, this.ongoingVotes.get(channel).bossVotes[voterIndex].displayName),
                        whisper: true
                    });
                    const channelOwner = channel.replace('#', '');
                    const channelData = this.dataStore.channelData[channelOwner];
                    const bossToken = message.toLowerCase();
                        
                    for (var i = 0; i < channelData.normalList.length; i++){
                        if (channelData.normalList[i].aliases.indexOf(bossToken) !== -1){
                            const monster = channelData.normalList[i];
                            return this.vote(channel, userState, monster, monster.displayName, 1);
                        }
                    }

                    for (var i = 0; i < channelData.preferList.length; i++){
                        if (channelData.preferList[i].aliases.indexOf(bossToken) !== -1){
                            const monster = channelData.preferList[i];
                            return this.vote(channel, userState, monster, monster.displayName, 2);
                        }
                    }

                    for (var i = 0; i < channelData.banList.length; i++){
                        if (channelData.banList[i].aliases.indexOf(bossToken) !== -1){
                            const monster = channelData.banList[i];
                            return Promise.resolve({
                                result: replaceMessageData(CommandMessages.BOSS_VOTE_BANNED_BOSS, monster.displayName),
                                whisper: this.isWhisper
                            });
                        }
                    }

                    return Promise.resolve({
                        result: replaceMessageData(CommandMessages.MISSING_BOSS, message.toLowerCase()), 
                        whisper: true
                    });
                }
                else {
                    return Promise.resolve({
                        result: CommandConstants.BOSS_VOTE_CLOSED,
                        whisper: true
                    });
                }
                
        }
    }

    private vote(channel: string, userState: Object, monsterData: IMonster, monsterDisplayName: string, votes: number): Promise<ICommandResponse> {
        this.ongoingVotes.get(channel).voters.push(userState['username']);
        for(var i = 0; i < votes; i++) {
            this.ongoingVotes.get(channel).bossVotes.push(monsterData);
        }
        return Promise.resolve({
            result: replaceMessageData(CommandMessages.BOSS_VOTE_CAST, monsterDisplayName),
            whisper: this.isWhisper
        });
    }

}

export enum BossVoteCommands {
    START = 'start',
    STOP = 'stop',
    VOTE = 'vote'
}

export interface IChannelVotes {
    bossVotes: IMonster[];
    voters: string[];
}