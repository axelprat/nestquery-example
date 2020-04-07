import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { FilterableField } from "@nestjs-query/query-graphql";
import { ObjectType, ID, GraphQLISODateTime } from '@nestjs/graphql';

@Entity({
    name: "user",
})
@ObjectType('User')
export class UserEntity {

    @PrimaryGeneratedColumn()
    @FilterableField(() => ID)
    id: number;

    @Column({ name: "first_name" })
    @FilterableField()
    firstName: string;

    @Column({ name: "last_name" })
    @FilterableField()
    lastName: string;

    @CreateDateColumn()
    @FilterableField(() => GraphQLISODateTime)
    created!: Date;

    @UpdateDateColumn()
    @FilterableField(() => GraphQLISODateTime)
    updated!: Date;

}
