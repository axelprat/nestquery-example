import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    ObjectType as OrmType,
} from 'typeorm';
import { FilterableField } from "@nestjs-query/query-graphql";
import { ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { AuthorEntity } from "./author.entity";

@Entity({
    name: "post",
})
@ObjectType('Post')
export class PostEntity {

    @PrimaryGeneratedColumn()
    @FilterableField(() => ID)
    id: number;

    @Column()
    @FilterableField()
    title: string;

    @Column()
    @FilterableField()
    content: string;

    @Column({ type: "float" })
    @FilterableField(() => Float)
    rank: number;

    @Column({ type: "int" })
    @FilterableField(() => Int)
    upvote: number;

    @Column({ name: "authorId" })
    @FilterableField(() => Int)
    authorId: number;

    @ManyToOne(
        (): OrmType<AuthorEntity> => AuthorEntity,
        author => author.posts,
        { onDelete: 'CASCADE' }
    )
    // @FilterableField(() => AuthorEntity)
    author: AuthorEntity;

}
