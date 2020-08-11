import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({
  name: 'clubs'
})
export class Club {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @Column()
  shortName: string
  
  @Column()
  tla: string

  //@OneToMany() dessarollar area entity

  @Column()
  crestUrl: string

  @Column()
  address: string

  @Column()
  phone: string
  
  @Column()
  website: string

  @Column()
  email: string

  @Column()
  founded: number
  
  @Column()
  clubColors: string

  @Column()
  venue: string

  @Column()
  active: 0 | 1

  @Column()
  createdAt: string

  @Column()
  updatedAt: string
}