import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Area } from '../area/area.entity';

@Entity({
  name: 'clubs'
})
export class Club {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {nullable: false})
  name: string

  @Column('text')
  shortName: string
  
  @Column('text', {nullable: false})
  tla: string

  @ManyToOne(() => Area, area => area.id, {eager: true})
  @JoinColumn({name: 'countryID'})
  area: Area

  @Column('text', {nullable: false})
  crestUrl: string

  @Column('text', {nullable: false})
  address: string

  @Column('text')
  phone: string
  
  @Column('text')
  website: string

  @Column('text', {nullable: false})
  email: string

  @Column('integer', {nullable: false})
  founded: number
  
  @Column('text')
  clubColors: string

  @Column('text')
  venue: string

  @Column('integer', {default: 1})
  active: 0 | 1

  @Column('text', {default: new Date().toDateString()})
  createdAt: string

  @Column('text', {default: new Date().toDateString()})
  updatedAt: string
}