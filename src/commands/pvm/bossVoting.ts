import { IDataStore, ICustomCommand, IMonster, MonsterList, ICommandResponse } from "../../shared/dataStore";

export class BossVote implements ICustomCommand{
    aliases = ['!bossvote', '!bvote', '!bv'];
    isWhisper = false;

    ongoingVotes = new Map<string, IChannelVotes>();

    execute(channel: string, userState: Object, message: string): Promise<ICommandResponse> {
        message = message.substring(message.indexOf(' ') + 1);
        const isChannelOwner = '#' + userState['username'] === channel;
        const hasOngoingVote = this.ongoingVotes.has(channel);
        const messageTokens = message.split(' ');
        switch(messageTokens[0]){
            case BossVoteCommands.START:
                console.log(hasOngoingVote + "\n" + isChannelOwner);
                if (!hasOngoingVote && isChannelOwner){
                    this.ongoingVotes.set(channel, {bossVotes: [], voters: []});
                    return Promise.resolve({
                        result: 'Vote started successfully!',
                        whisper: this.isWhisper
                    });
                }
                else if (hasOngoingVote && isChannelOwner){
                    return Promise.reject(`You already have an ongoing vote, and can't start a new one until you finish the old one - use '${this.aliases[0]} stop' to stop a vote.`)    
                }
                else if (!isChannelOwner){
                    return Promise.reject('You are not a channel owner and therefore can\'t start a vote.');
                }
                break;
            case BossVoteCommands.STOP:
                if (hasOngoingVote && isChannelOwner){
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
                        result: 'Vote stopped successfully! The winner was: ' + highestVote.displayName + ` with ${highestVoteCount} votes.`,
                        whisper: this.isWhisper
                    });
                }
                else if (!hasOngoingVote && isChannelOwner){
                    return Promise.reject(`You already don't an ongoing vote - use '${this.aliases[0]} start' to start a new vote.`);    
                }
                if (!isChannelOwner){
                    return Promise.reject('You are not a channelOwner and therefore can\'t stop a vote.');
                }
                else return Promise.reject("Channel has no ongoing vote");
                
            default:
                if(hasOngoingVote) {
                    const voted = this.ongoingVotes.get(channel).voters.indexOf(userState['username']) !== -1;
                    if (voted) return Promise.reject('User already voted.');

                    for (var i = 0; i < MonsterList.length; i++){
                        const bossToken = message.toLowerCase();
                        if (MonsterList[i].aliases.indexOf(bossToken) !== -1) {
                            this.ongoingVotes.get(channel).voters.push(userState['username']);
                            this.ongoingVotes.get(channel).bossVotes.push(MonsterList[i]);
                            return Promise.resolve({
                                result: "Vote registered: " + MonsterList[i].displayName,
                                whisper: this.isWhisper
                            });
                        }
                    }
                    return Promise.reject("Boss not found: " + message.toLowerCase());
                }
                else {
                    return Promise.reject("The channel does not have an open vote.");
                }
                
        }
    }

    constructor() {

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