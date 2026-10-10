import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseTimeEntity {
  // INSERT 시점에 한 번만 채워지고 이후 바뀌지 않습니다.
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // 저장될 때마다 TypeORM이 현재 시각으로 다시 채워줍니다.
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}