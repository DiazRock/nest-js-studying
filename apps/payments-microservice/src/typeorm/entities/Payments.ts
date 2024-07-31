import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  amount: number;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text')
  label: string;
}
