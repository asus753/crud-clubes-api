import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'countries' 
})
export class Area {

  @PrimaryGeneratedColumn({})
  id: number

  @Column('text')
  name: string
}