下面这条，我们专门搞一个 **`@nestjs/mongoose` 的“知识点 & 用法大全 + 经典代码模板合集”**。你可以当作速查手册，直接抄代码改类名就能用。

---

## 一、整体概念：@nestjs/mongoose 到底干嘛的？

* 本质：**Nest 对 mongoose 的一层封装**，主要做两件事：

  1. 把 mongoose 的 Model/Schema 接进 Nest 的 **依赖注入（DI）** 体系；
  2. 提供一套装饰器：`@Schema()`、`@Prop()`、`SchemaFactory.createForClass()`，用 **类 + 装饰器** 来定义 Schema，更符合 Nest 风格。([NestJS 文档][1])

* 底层还是原生 mongoose，所以：

  * 所有 mongoose 的配置、查询、population、transaction 基本都能用；
  * Nest 只是在“怎么组织代码、怎么注入 model”上帮你规范了套路。([Mongoose][2])

---

## 二、安装与全局配置（MongooseModule）

### 1. 安装依赖

```bash
npm i @nestjs/mongoose mongoose
```

`@nestjs/mongoose` 实际上直接依赖 mongoose 最新版本。([npm][3])

### 2. 在 AppModule 里配置连接（forRoot / forRootAsync）

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // 简单版：写死连接串
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'),

    // 实战推荐：结合 ConfigModule 动态配置
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     uri: config.get<string>('MONGODB_URI'),
    //   }),
    // }),
  ],
})
export class AppModule {}
```

* `forRoot` 只在**根模块**调一次，为整个 app 建立连接。([NestJS 文档][1])
* 复杂场景可配置：

  * `uri`
  * `dbName`
  * `user` / `pass` / `authSource`
  * `autoIndex`、`maxPoolSize` 等 mongoose 原生配置项

### 3. 多数据库连接（多租户场景）

```ts
MongooseModule.forRoot('mongodb://host1:27017/db1', {
  connectionName: 'db1',
});
MongooseModule.forRoot('mongodb://host2:27017/db2', {
  connectionName: 'db2',
});
```

在具体模块中 `forFeature` 时传对应 `connectionName` 即可。([NestJS 文档][1])

---

## 三、定义 Schema：@Schema + @Prop + SchemaFactory

> 官方推荐方式：用类 + 装饰器来定义 schema，再通过 `SchemaFactory.createForClass()` 转成 mongoose schema。([NestJS 文档][1])

### 1. 最经典的 Cat 示例（完整写法）

```ts
// cats/schemas/cat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema({
  timestamps: true,       // 自动生成 createdAt / updatedAt
  versionKey: false,      // 去掉 __v
  collection: 'cats',     // 自定义集合名（不写则默认类名小写+s）
})
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop({ min: 0 })
  age: number;

  @Prop({ default: 'mixed' })
  breed: string;

  @Prop({ index: true, unique: true })
  tag: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
```

> `HydratedDocument<T>` 是 Nest 官方文档推荐的新写法，表示一个“有 mongoose 实例方法的文档类型”。([NestJS 文档][1])

### 2. @Prop 常见配置

`@Prop()` 支持的选项基本等同于 mongoose SchemaType 的配置：([Stack Overflow][4])

```ts
@Prop({ required: true })           // 必填
@Prop({ default: Date.now })        // 默认值
@Prop({ unique: true })             // 唯一索引
@Prop({ enum: ['a', 'b'] })         // 枚举
@Prop({ type: [String] })           // 数组
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) // 关联
@Prop({ index: true })              // 普通索引
```

### 3. 子文档 / 嵌套对象

用 **class + @Schema({ _id: false })** 定义子文档，然后在父文档里 `@Prop({ type: SubClass })` 或数组类型。([Stack Overflow][5])

```ts
// address.schema.ts
@Schema({ _id: false })
export class Address {
  @Prop()
  city: string;

  @Prop()
  street: string;
}

// user.schema.ts
@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ type: Address })         // 单个子文档
  address: Address;

  @Prop({ type: [Address] })       // 子文档数组
  addresses: Address[];
}
```

---

## 四、在模块中注册 Model：forFeature

### 1. 典型 CatsModule

```ts
// cats/cats.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './schemas/cat.schema';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
    ]),
  ],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // 若其他模块也要用
})
export class CatsModule {}
```

`forFeature()` 注册当前模块要用到的 Model。([NestJS 文档][1])

* 多连接时可以：

  ```ts
  MongooseModule.forFeature(
    [{ name: Cat.name, schema: CatSchema }],
    'db1',
  );
  ```

---

## 五、在 Service 中注入 Model 并写 CRUD

### 1. 注入 Model

```ts
// cats/cats.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Cat, CatDocument } from './schemas/cat.schema';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
  ) {}

  async create(data: Partial<Cat>): Promise<CatDocument> {
    const created = new this.catModel(data);
    return created.save();
  }

  async findAll(
    filter: FilterQuery<CatDocument> = {},
    limit = 20,
    page = 1,
  ) {
    return this.catModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()        // 返回普通 JS 对象，提高性能
      .exec();
  }

  async findOne(id: string): Promise<CatDocument> {
    const cat = await this.catModel.findById(id).exec();
    if (!cat) throw new NotFoundException('Cat not found');
    return cat;
  }

  async update(id: string, data: Partial<Cat>): Promise<CatDocument> {
    const updated = await this.catModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Cat not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.catModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Cat not found');
    return res;
  }
}
```

* 这里所有查询基本都和 mongoose 原生写法一致。Nest 文档就是强调：**model 注入后，你就按 mongoose 的思维写就行**。([NestJS 文档][1])

---

## 六、文档之间的关联 & populate

### 1. 定义关联字段（User / Post 示例）

```ts
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

// post.schema.ts
import { Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  // 关联到 User
  @Prop({ type: Types.ObjectId, ref: User.name })
  author: Types.ObjectId; // 或者 author: User;
}
export const PostSchema = SchemaFactory.createForClass(Post);
```

> `ref` 写的是 mongoose 模型名（默认用类名），用 `Types.ObjectId` 存储 ObjectId。([DEV Community][6])

### 2. 在 Service 中使用 populate

```ts
// posts.service.ts
@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async findOneWithAuthor(id: string) {
    return this.postModel
      .findById(id)
      .populate('author', 'name')  // populate author 字段，只取 name
      .exec();
  }

  async findAllWithAuthor() {
    return this.postModel
      .find()
      .populate('author')          // 全字段
      .lean()
      .exec();
  }
}
```

* `populate(field, select)` 是 mongoose 的方法，Nest 不做额外封装。([Mongoose][2])

---

## 七、Schema 中间件（pre/post hooks）、方法、statics

> 这一块 Nest 也是直接复用 mongoose 的能力，只是要在 `SchemaFactory.createForClass` 之后来挂。([NestJS 文档][1])

### 1. pre / post 中间件（比如保存前 hash 密码）

```ts
// user.schema.ts
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

// 挂 pre hook
UserSchema.pre('save', async function (next) {
  const doc = this as Document & { password: string };

  if (!doc.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  doc.password = await bcrypt.hash(doc.password, salt);
  next();
});
```

### 2. 实例方法 / 静态方法

```ts
// 实例方法
UserSchema.methods.comparePassword = function (plain: string) {
  return bcrypt.compare(plain, this.password);
};

// 静态方法
UserSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username });
};
```

在 Service 中：

```ts
const user = await this.userModel.findById(id);
const ok = await user.comparePassword('123456');

const found = await this.userModel['findByUsername']('john');
```

> 官方 issues 里也有类似建议：通过在 SchemaFactory 生成出来的 schema 上挂 methods/statics。([GitHub][7])

---

## 八、索引、唯一约束与性能

### 1. 字段上直接声明索引

```ts
@Prop({ index: true })
email: string;

@Prop({ unique: true })
username: string;
```

> `unique` 本质是在数据库创建唯一索引，不是业务级检查。([Mongoose][2])

### 2. 复合索引

```ts
export const OrderSchema = SchemaFactory.createForClass(Order);

// 复合索引：user + status
OrderSchema.index({ userId: 1, status: 1 });
```

* 建议对频繁查询的字段组合建立适当索引，避免 collection scan。

---

## 九、事务（Transaction）与 Session

MongoDB 4+ 支持多文档事务（前提是 replica set）。在 Nest 中可以通过注入 `Connection` 或从 `model.db` 获取。([DEV Community][8])

### 1. 注入连接并开启事务

```ts
// orders.service.ts
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectConnection() private readonly connection: Connection, // 默认连接
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createOrderWithBalanceUpdate(userId: string, dto: CreateOrderDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const order = await this.orderModel.create(
        [{ ...dto, user: userId }],
        { session },
      );

      await this.userModel.updateOne(
        { _id: userId },
        { $inc: { balance: -dto.amount } },
        { session },
      );

      await session.commitTransaction();
      return order[0];
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
```

也可以用 `session.withTransaction(async () => { ... })` 简化。([Mongoose][2])

---

## 十、常见配套模式：DAO / Repository 层

不少实战文章会再封一层 DAO/Repository，用来隔离 Mongoose 细节：([Ayoub Khial][9])

* Controller 只调 Service
* Service 调 DAO（DAO 里才用 Model 访问数据库）
* 这样以后要换 ORM（比如 Prisma）、换数据源会更容易。

简单示例：

```ts
// cats/cats.dao.ts
@Injectable()
export class CatsDao {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
  ) {}

  create(data: Partial<Cat>) {
    return this.catModel.create(data);
  }

  findById(id: string) {
    return this.catModel.findById(id).exec();
  }

  // ...
}
```

---

## 十一、和 DTO / 校验的配合

* **DTO** 负责“请求输入结构 + class-validator 校验”
* **Schema** 负责“数据库文档结构 + 索引、默认值”等
* 两者并不必完全一致，可以通过 `class-transformer` 或手写 map 做映射。

典型写法：

```ts
// create-cat.dto.ts
export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsOptional()
  @IsString()
  breed?: string;
}

// cats.service.ts
async create(dto: CreateCatDto) {
  return this.catModel.create(dto); // 字段名刚好一样时可以直接传
}
```

---

## 十二、常见“坑点”与经验

1. **别在业务里直接用 `process.env`**

   * 用 ConfigModule + forRootAsync，把连接配置都放进配置层。([NestJS 文档][1])

2. **不要在 controller 里直接操作 Model**

   * 把 Model 注入到 Service/DAO，一致的架构更好维护。

3. **注意 `lean()` 的副作用**

   * `lean()` 返回的是 plain object，没有实例方法、虚拟字段 getter。

4. **调试 population 的坑**

   * `ref` 名和 Model 名不一致时，很容易 populate 不出来；
   * 确认 `@Prop({ ref: User.name })` 和 `MongooseModule.forFeature([{ name: User.name,... }])` 对得上。

5. **事务一定要确认 MongoDB 环境支持**

   * 本地单节点：用 `--replSet` 起 replica set；
   * 云服务（Atlas 等）一般默认支持。

---

### 一个“可直接抄”的组合示例（最小可用）

* `AppModule`：`MongooseModule.forRoot(...)`
* `Cat`：

  * `cat.schema.ts`：`@Schema + @Prop + SchemaFactory`
  * `cats.module.ts`：`MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])`
  * `cats.service.ts`：注入 `@InjectModel(Cat.name)` 写 CRUD
  * `cats.controller.ts`：定义 `GET/POST/PUT/DELETE`，调用 `CatsService`

只要跑通这条链，你基本就把 `@nestjs/mongoose` 的核心用法吃透了。

---

如果你愿意，可以告诉我你现在已经建好的 **某个实体（比如 User / Order）字段结构**，我可以直接帮你：

* 写一份完整的 `schema.ts`
* 对应的 `module + service CRUD 模板`
  一套复制进项目就能用。

