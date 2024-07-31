import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  import { Payment } from './Payments';
  
  @Entity({ name: 'users' })
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false })
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

    @Column({ type: 'boolean' })
    canRead: boolean;

    @Column({ type: 'boolean' })
    canWrite: boolean;

    @Column ({type: 'float', default: 500})
    balance: number;
  }
