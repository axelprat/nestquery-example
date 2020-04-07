import { registerEnumType } from "@nestjs/graphql";

export enum Status {
    'created' = 'created',
    'pending' = 'pending',
    'validated' = 'validated',
    'deleted' = 'deleted',
}

registerEnumType(Status, {
    name: 'Status',
});
