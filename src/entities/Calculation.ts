import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('calculations')
export class Calculation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({ type: 'text' })
  items!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  shipping!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
