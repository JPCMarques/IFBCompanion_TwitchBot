import { IGenericMessage } from "../utils";

export class CommandMessages {
    static readonly COMMAND_NO_ARGS: IGenericMessage = {
        expectedArguments: 2,
        message: 'Invalid call to $0. $1'
    };

    static readonly UNRECOGNIZED_ARG: IGenericMessage = {
        expectedArguments: 1,
        message: 'Unrecognized argument(s): $0'
    };

    static readonly MOD_CONTROL_SUCCESS: IGenericMessage = {
        expectedArguments: 1,
        message: 'Mod control successful. Mod permissions are now $0'
    };

    static readonly INEXISTENT_COMMAND: IGenericMessage = {
        expectedArguments: 1,
        message: 'Inexistent command: $0'
    };

    static readonly BOSS_VOTE_STOP_SUCCESS: IGenericMessage = {
        expectedArguments: 2,
        message: 'Vote stopped successfully! The winner was $0 with $1 votes.'
    };

    static readonly BOSS_VOTE_CAST: IGenericMessage = {
        expectedArguments: 1,
        message: 'Vote cast on $0.'
    };

    static readonly BOSS_VOTE_DBLCAST: IGenericMessage = {
        expectedArguments: 1,
        message: 'You already voted on $0.'
    };

    static readonly BOSS_VOTE_MISSING_BOSS: IGenericMessage = {
        expectedArguments: 1,
        message: 'Boss not found: $0'
    }
}

export enum CommandConstants {
    MOD_CONTROL_DISPLAY = 'Mod Control',
    MOD_CONTROL_EXPECTED_ARGS = 'Expected one of "enable", "disable" or "toggle".',

    JOIN_SUCCESS = 'Bot successfully joined your channel.',
    JOIN_FAIL = 'Bot is already in your channel.',
    JOIN_MEME = 'OR IS IT? DUN.............. DUUN.... DUUUUUUUUUUUUUUUUUUUUUUN!',

    LEAVE_SUCCESS = 'Bot successfully left your channel.',
    LEAVE_FAIL = 'Bot is not in your channel, so it can\'t leave.',
    LEAVE_MEME = 'OR CAN IT? DUN.............. DUUN.... DUUUUUUUUUUUUUUUUUUUUUUN!',

    BOSS_VOTE_START_SUCCESS = 'Vote started successfully!',
    BOSS_VOTE_START_FAIL = 'You already have an ongoing vote.',
    BOSS_VOTE_STOP_FAIL = 'You don\'t have an ongoing vote.',
    BOSS_VOTE_CLOSED = 'The channel does not have an open vote.'
}