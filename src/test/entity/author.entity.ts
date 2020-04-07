import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany, ManyToOne,
} from 'typeorm';
import { FilterableField } from "@nestjs-query/query-graphql";
import { ObjectType, ID, GraphQLISODateTime, Field, Int } from '@nestjs/graphql';
import { PostEntity } from "./post.entity";
import { Status } from "../enum/status";
import { ObjectType as OrmType } from "typeorm/common/ObjectType";
import { UserEntity } from "../../second/entity/user.entity";

@Entity({
    name: "author",

})
@ObjectType('Author')
export class AuthorEntity {

    @PrimaryGeneratedColumn()
    @FilterableField(() => ID)
    id: number;

    @Column({ name: "first_name" })
    @FilterableField()
    firstName: string;

    @Column({ name: "last_name" })
    @FilterableField()
    lastName: string;

    @Column({ type: "enum", enum: Status })
    @FilterableField()
    @Field(() => Status)
    status: Status;

    @OneToMany(() => PostEntity, post => post.author)
    posts: PostEntity[];

    @CreateDateColumn()
    @FilterableField(() => GraphQLISODateTime)
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @Column({ name: "userId" })
    @FilterableField(() => Int)
    userId: number;

    // // This one don't work
    // @ManyToOne((): OrmType<UserEntity> => UserEntity)
    // user: UserEntity;

}
