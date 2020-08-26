import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Area } from '../area/area.entity';

@Entity({
  name: 'clubs',
})
export class Club {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {nullable: false})
  name: string

  @Column('text', {name: 'short_name'})
  shortName: string
  
  @Column('text', {nullable: false})
  tla: string

  @ManyToOne(() => Area, area => area.id, {eager: true})
  @JoinColumn({name: 'fk_country'})
  area: Area

  @Column('text', {nullable: false, name: 'crest_url'})
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
  
  @Column('text', {name: 'club_colors'})
  clubColors: string

  @Column('text')
  venue: string

  @Column('integer', {default: 1})
  active: 0 | 1

  @Column('text', {default: () => "datetime('now')", name: 'created_at'})
  createdAt: string

  @Column('text', {default: () => "datetime('now')", name: 'updated_at'})
  updatedAt: string
}