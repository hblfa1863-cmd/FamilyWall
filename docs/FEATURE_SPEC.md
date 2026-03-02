# FamilyWall 完整功能规格文档

> 版本：v2.0
> 日期：2026-03-02

---

## 一、用户权限体系

### 1.1 角色定义

| 角色 | 描述 | 创建方式 |
|------|------|----------|
| 超级管理员 | 平台最高权限，可管理所有家族 | 系统初始化 |
| 家族管理员 | 管理特定家族的成员、权限、相册 | 家族创建者或被授予 |
| 维护员 | 负责相册管理 | 管理员授予 |
| 普通成员 | 家族基本成员 | 被邀请加入 |

### 1.2 权限矩阵

| 功能 | 超级管理员 | 家族管理员 | 维护员 | 普通成员 |
|------|:----------:|:----------:|:------:|:--------:|
| 创建家族 | ✅ | ❌ | ❌ | ❌ |
| 解散家族 | ✅ | ✅(自己的家族) | ❌ | ❌ |
| 退出家族 | ✅ | ✅ | ✅ | ✅ |
| 邀请成员 | ✅ | ✅ | ✅ | ✅(需审批) |
| 移除成员 | ✅ | ✅ | ❌ | ❌ |
| 修改成员权限 | ✅ | ✅ | ❌ | ❌ |
| 创建相册 | ✅ | ✅ | ✅ | ❌ |
| 删除相册 | ✅ | ✅ | ✅ | ❌ |
| 上传照片 | ✅ | ✅ | ✅ | ✅ |
| 删除照片 | ✅ | ✅ | ✅ | ❌(自己的) |
| 评论照片 | ✅ | ✅ | ✅ | ✅ |
| 查看照片 | ✅ | ✅ | ✅ | ✅(受相册权限限制) |
| 审批加入 | ✅ | ✅ | ❌ | ❌ |
| 管理面板 | ✅ | ✅ | 部分 | ❌ |

---

## 二、核心功能模块

### 2.1 登录注册

#### 注册
```
- 用户名（唯一）
- 邮箱
- 密码
- 确认密码
- 邀请码（非必填，填写后自动加入对应家族）
```

#### 登录
- 邮箱/用户名 + 密码
- 记住我
- 忘记密码（邮件重置）

#### 会话管理
- Token 存储
- 自动登录
- 登出

---

### 2.2 家族群组

#### 创建家族
```
- 家族名称（必填，2-20字）
- 家族描述（选填，0-200字）
- 创建后创建者自动成为管理员
```

#### 家族管理
| 操作 | 权限要求 |
|------|----------|
| 解散家族 | 管理员 |
| 退出家族 | 所有成员（管理员需先转移权限） |
| 邀请加入 | 所有成员（需审批） |
| 生成邀请码 | 生成随机邀请码（字母+数字+符号），可复制分享 |
| 移除成员 | 管理员 |
| 转让管理员 | 管理员 |

#### 家族切换
- 顶部导航显示当前家族名称
- 下拉菜单切换家族
- 快速切换按钮

---

### 2.3 相册功能

#### 相册属性
```typescript
interface Album {
  id: string
  name: string           // 相册名称
  description: string    // 相册描述
  cover: string          // 封面图
  familyId: string       // 所属家族
  privacy: PrivacyType   // 可见性
  allowedMembers?: string[] // 允许查看的成员ID（privacy=partial时）
  createdBy: string      // 创建者
  createdAt: Date
  updatedAt: Date
}
```

#### 可见性类型
| 类型 | 说明 |
|------|------|
| public | 完全公开，家族内所有成员可见 |
| private | 完全隐藏，仅管理员和维护员可见 |
| partial | 部分成员可见，需要勾选成员 |

#### 相册操作
| 操作 | 管理员 | 维护员 | 普通成员 |
|------|:------:|:------:|:--------:|
| 新建 | ✅ | ✅ | ❌ |
| 编辑 | ✅ | ✅ | ❌ |
| 删除 | ✅ | ✅ | ❌ |
| 查看 | ✅ | ✅ | ✅(受权限限制) |

---

### 2.4 照片功能

#### 照片属性
```typescript
interface Photo {
  id: string
  familyId: string       // 所属家族
  albumId?: string       // 所属相册（可选）
  urls: string[]         // 图片/视频URL数组（支持多张）
  type: 'image' | 'video'
  title: string          // 标题
  description: string   // 描述
  uploadedBy: string     // 上传者
  uploadedAt: Date
  comments: Comment[]
}
```

#### 照片上传
```
- 标题（非必填，0-50字）
- 描述（非必填，0-500字）
- 照片/视频URL（必填，支持多URL，每行一个）
- 所属相册（可选选择）
```

#### 照片详情
- 大图预览（支持多张横向滑动）
- 视频播放（支持多个）
- 标题/描述展示
- 评论功能
- 删除功能（仅上传者和管理员）

#### 横向切换
- 左右箭头按钮
- 键盘左右键支持
- 底部缩略图指示器
- 平滑过渡动画

---

### 2.5 成员管理

#### 成员列表
- 头像/昵称
- 角色标识
- 加入时间
- 操作（管理员）

#### 权限修改
- 管理员可修改其他成员角色
- 角色：管理员、维护员、普通成员

#### 成员审批
- 待审批列表（管理员可见）
- 批准/拒绝操作

---

### 2.6 管理面板

#### 显示规则
| 角色 | 显示内容 |
|------|----------|
| 普通成员 | 不显示 |
| 维护员 | 相册管理 |
| 管理员 | 成员管理 + 相册管理 + 家族设置 |

#### 管理功能

**1. 成员管理**
- 查看成员列表
- 搜索成员
- 移除成员
- 修改权限
- 审批加入申请

**2. 相册管理**
- 创建相册
- 编辑相册
- 删除相册
- 设置可见性

**3. 家族设置**
- 修改家族名称/描述
- 解散家族
- 转让管理员

---

## 三、数据库设计（概念）

### 用户表 users
```sql
id, username, email, password_hash, avatar, created_at
```

### 家族表 families
```sql
id, name, description, created_by, created_at
```

### 家族成员表 family_members
```sql
id, family_id, user_id, role, joined_at
```

### 相册表 albums
```sql
id, family_id, name, description, cover, privacy, allowed_members, created_by, created_at
```

### 照片表 photos
```sql
id, family_id, album_id, urls, type, title, description, uploaded_by, created_at
```

### 评论表 comments
```sql
id, photo_id, user_id, content, created_at
```

---

## 四、API 接口设计（REST）

### 认证
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### 家族
- GET /api/families
- POST /api/families
- GET /api/families/:id
- PUT /api/families/:id
- DELETE /api/families/:id
- POST /api/families/:id/join
- POST /api/families/:id/leave
- POST /api/families/:id/invite

### 成员
- GET /api/families/:id/members
- PUT /api/families/:id/members/:userId/role
- DELETE /api/families/:id/members/:userId
- GET /api/families/:id/join-requests
- POST /api/families/:id/join-requests/:id/approve
- POST /api/families/:id/join-requests/:id/reject

### 相册
- GET /api/families/:id/albums
- POST /api/families/:id/albums
- PUT /api/albums/:id
- DELETE /api/albums/:id

### 照片
- GET /api/albums/:id/photos
- POST /api/families/:id/photos
- GET /api/photos/:id
- DELETE /api/photos/:id

### 评论
- GET /api/photos/:id/comments
- POST /api/photos/:id/comments
- DELETE /api/comments/:id

---

## 五、前端页面结构

```
/                           # 首页（未登录引导）
/login                     # 登录
/register                  # 注册
/families                  # 家族列表
/families/:id              # 家族照片墙
/families/:id/albums       # 相册列表
/families/:id/albums/:albumId  # 相册详情
/photos/:id                # 照片详情
/profile                   # 个人资料
/admin                     # 管理面板（权限控制）
```

---

## 六、技术实现建议

### 前端
- Vue 3 + TypeScript
- Vue Router（路由）
- Pinia（状态管理）
- TailwindCSS
- 图片/视频预览组件

### 后端（待定）
- Node.js/Express 或 NestJS
- PostgreSQL/MySQL
- JWT 认证

---

## 七、开发优先级

### Phase 1: 基础框架
1. 项目初始化
2. 路由配置
3. 状态管理
4. UI 组件库

### Phase 2: 认证系统
1. 登录/注册页面
2. Token 管理
3. 权限守卫

### Phase 3: 核心功能
1. 家族管理
2. 成员管理
3. 相册功能

### Phase 4: 照片功能
1. 照片上传
2. 照片展示
3. 照片详情（横向切换）

### Phase 5: 管理面板
1. 权限控制
2. 管理界面

---

*文档版本：1.0*
