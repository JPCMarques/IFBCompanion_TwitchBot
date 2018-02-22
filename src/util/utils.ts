export function replaceMessageData(genericMessage: IGenericMessage, ...args: any[]): string {
    let currentIteration = 0;
    let message = genericMessage.message;
    
    if (genericMessage.expectedArguments !== args.length){
        throw new Error(replaceMessageData(InvalidArgumentCount, genericMessage.expectedArguments, args.length, args));
    }
    while(message.indexOf('$' + currentIteration) !== -1){
        message = message.replace('$' + currentIteration, args[currentIteration++]);
    }
    
    return message;
}

export interface IGenericMessage {
    message: string;
    expectedArguments: number
}

const InvalidArgumentCount: IGenericMessage = {
    message: 'Invalid arguments. Expected $0 arguments, found $1: $3',
    expectedArguments: 3
}
