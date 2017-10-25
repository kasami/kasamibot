import {OperationType} from "../enums/operationtypes";

export interface IOperationData {
    operationtype: OperationType;
    active: boolean;
    victoryCondition: number;
    victoryValue: any;
}
