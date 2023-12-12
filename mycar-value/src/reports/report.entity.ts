import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  maker: string;

  @Column()
  model: string;

  @Column()
  year: number;

  // longitude 경도
  @Column()
  lng: number;

  // latitude 위도
  @Column()
  lat: number;

  // 운행 km
  @Column()
  mileage: number;
}
