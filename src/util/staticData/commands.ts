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
}

export enum CommandConstants {
    MOD_CONTROL_DISPLAY = 'Mod Control',
    MOD_CONTROL_EXPECTED_ARGS = 'Expected one of "enable", "disable" or "toggle".',
    JOIN_SUCCESS = 'Bot successfully joined your channel.',
    JOIN_FAIL = 'Bot is already in your channel.',
    JOIN_MEME = 'OR IS IT? DUN.............. DUUN.... DUUUUUUUUUUUUUUUUUUUUUUN!',
    LEAVE_SUCCESS = 'Bot successfully left your channel.',
    LEAVE_FAIL = 'Bot is not in your channel, so it can\'t leave.',
    LEAVE_MEME = 'OR CAN IT? DUN.............. DUUN.... DUUUUUUUUUUUUUUUUUUUUUUN!'
}