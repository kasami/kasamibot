import {Role} from "../enums/role";

export function makeRoleName(role: Role): string {
    return Role[role];
}

export function makeRandomCreepId(): string
{
    var text = "";
    var possibleHighcase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var possibleLowcase = "abcdefghijklmnopqrstuvwxyz";
    text += possibleHighcase.charAt(Math.floor(Math.random() * possibleHighcase.length));

    for( var i=1; i < 3; i++ )
        text += possibleLowcase.charAt(Math.floor(Math.random() * possibleLowcase.length));

    return text;
}
