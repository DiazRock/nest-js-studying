import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
import { Payment } from './Payment';
  
  @Entity({ name: 'users' })
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false, unique: true })
    username: string;
  
    @Column({ nullable: false })
    email: string;
  
    @Column({ nullable: true })
    displayName?: string;
  
    @OneToMany(() => Payment, (payment) => payment.user)
    @JoinColumn()
    payments: Payment[];

    @Column({ nullable: false })
    role: string;

    @Column({ nullable: false, default: 'admin' })
    password: string;

    @Column({ type: 'text' })
    permissions: string;
  }