# FamilyWall 照片墙 - 功能与逻辑文档

## 一、项目概述

**项目名称**: FamilyWall 照片墙  
**技术栈**: Vue 3 + TypeScript + Vite + TailwindCSS  
**后端**: https://family-wall-backend.vercel.app/api  
**部署**: GitHub Pages

---

## 二、核心功能模块

### 1. 用户认证模块

| 功能 | 说明 | 组件/函数 |
|------|------|----------|
| 用户注册 | 支持用户名、邮箱、密码、邀请码 | `RegisterView.vue`, `auth.register()` |
| 用户登录 | 邮箱+密码登录 | `LoginView.vue`, `auth.login()` |
| 自动登录 | 刷新页面保持登录状态 | `auth.isLoggedIn()`, `auth.getMe()` |
| 退出登录 | 清除本地存储的token | `auth.logout()` |

**数据流**:
```
RegisterView → emit('register') → handleRegister() → auth.register() 
→ API调用 → 保存token到localStorage → loadFamilies() → view = 'wall'
```

---

### 2. 家族管理模块

| 功能 | 说明 | 组件/函数 |
|------|------|----------|
| 创建家族 | 新用户引导创建第一个家族 | `CreateFamilyModal.vue`, `families.create()` |
| 家族列表 | 显示用户所有家族 | `Header.vue` 下拉选择 |
| 切换家族 | 不同家族间切换数据 | `switchFamily()` |
| 邀请码 | 生成/查看家族邀请码 | `families.getInviteCode()` |
| 加入家族 | 输入邀请码加入 | (待完善) |
| 退出家族 | 离开当前家族 | `families.leave()` |
| 删除家族 | 删除整个家族(仅管理员) | `families.delete()` |

**家族角色**:
- `admin` - 管理员，可删除家族、管理成员
- `maintainer` - 维护者，可创建相册
- `member` - 普通成员

---

### 3. 相册管理模块

| 功能 | 说明 | 组件/函数 |
|------|------|----------|
| 相册列表 | 网格展示所有相册 | `AlbumList.vue` |
| 创建相册 | 新建相册(名称/描述/隐私) | `AlbumModal.vue`, `albums.create()` |
| 删除相册 | 删除相册及其中照片 | `albums.delete()` |
| 相册隐私 | public/private/protected | 相册属性 |

**相册点击逻辑** (问题修复点):
```javascript
// AlbumList.vue 发出 openAlbum 事件
@click="emit('openAlbum', album)"

// App.vue 监听事件
@openAlbum="(album) => loadAlbumPhotos(album.id, album.name)"
@open-album="(album) => loadAlbumPhotos(album.id, album.name)"
```

---

### 4. 照片模块

| 功能 | 说明 | 组件/函数 |
|------|------|----------|
| 照片墙 | 瀑布流展示照片 | `PhotoWall.vue` |
| 时光轴 | 按月份分组展示 | `Timeline.vue` |
| 上传照片 | 多图上传 | `UploadModal.vue`, `photos.upload()` |
| 删除照片 | 批量删除 | `photos.deleteMany()` |
| 照片详情 | 大图查看/评论/点赞 | `PhotoDetail.vue` |
| 相册详情 | 查看相册内照片 | `AlbumDetail.vue` |

---

### 5. 社交互动模块

| 功能 | 说明 | 组件/函数 |
|------|------|----------|
| 点赞/取消点赞 | 照片点赞 | `photos.toggleLike()` |
| 评论 | 照片评论 | `photos.addComment()` |
| 好友列表 | 好友管理 | `FriendsList.vue` |
| 添加好友 | 搜索并添加 | `friends.add()` |
| 好友请求 | 接受/拒绝 | `friends.respond()` |
| 通知 | 点赞/评论/好友请求 | `Notifications.vue` |

---

### 6. 设置与个人中心

| 功能 | 说明 | 组件/函数 |
|------|------|----------|
| 个人资料 | 修改用户名/邮箱 | `ProfileModal.vue` |
| 语言切换 | 中文/English | `setLocale()`, `ProfileModal`, `SettingsModal` |
| 安全设置 | 账户安全 | `SecuritySettings.vue` |
| 分享 | 分享照片/相册 | `ShareModal.vue` |
| 测试数据 | 添加12个月测试照片 | `SettingsModal.addTestData()` |

**语言切换逻辑** (问题修复点):
```javascript
// App.vue - 提供locale状态
const locale = ref<Locale>('zh')
provide('locale', locale)
function setLocale(newLocale) {
  locale.value = newLocale
}

// 模态框 - 使用computed响应式
const currentLocale = computed(() => props.currentLocale || 'zh')

// 关键：添加key强制重新渲染
<SettingsModal :key="'settings-' + locale" :locale="locale" />
```

---

## 三、视图与路由

| 视图 | 路径 | 说明 |
|------|------|------|
| 登录 | `view === 'login'` | LoginView.vue |
| 注册 | `view === 'register'` | RegisterView.vue |
| 照片墙 | `view === 'wall'` | PhotoWall.vue (默认) |
| 时光轴 | `view === 'timeline'` | Timeline.vue |
| 相册管理 | `view === 'albums'` | AlbumList.vue |
| 相册详情 | `viewingAlbum` | AlbumDetail.vue |

**视图切换**:
- 顶部导航按钮切换 view 值
- 相册点击设置 viewingAlbum 值

---

## 四、API 接口汇总

### 认证 API
```
POST /api/auth/login          - 登录
POST /api/auth/register      - 注册
GET  /api/auth/me            - 获取当前用户
```

### 家族 API
```
GET    /api/families                    - 获取家族列表
POST   /api/families                    - 创建家族
GET    /api/families/:id/members        - 获取成员列表
GET    /api/families/:id/invite-code    - 获取邀请码
POST   /api/families/:id/leave          - 退出家族
DELETE /api/families/:id                - 删除家族
```

### 相册 API
```
GET    /api/families/:id/albums         - 获取相册列表
POST   /api/families/:id/albums         - 创建相册
DELETE /api/albums/:id                  - 删除相册
```

### 照片 API
```
GET    /api/families/:id/photos        - 获取照片列表
POST   /api/families/:id/photos        - 上传照片
DELETE /api/photos/:id                 - 删除照片
POST   /api/photos/:id/like            - 点赞
GET    /api/photos/:id/likes           - 获取点赞列表
POST   /api/photos/:id/comments        - 添加评论
```

### 社交 API
```
GET    /api/friends                     - 好友列表
POST   /api/friends/:id                 - 添加好友
PUT    /api/friends/:id/respond         - 响应好友请求
GET    /api/users/search                - 搜索用户
GET    /api/notifications               - 通知列表
```

---

## 五、状态管理

### 主要 Ref 状态
```typescript
const user = ref<User | null>(null)           // 当前用户
const familiesList = ref<Family[]>([])        // 家族列表
const currentFamilyId = ref('')                // 当前家族ID
const albumsList = ref<Album[]>([])           // 相册列表
const photosList = ref<Photo[]>([])           // 照片列表
const view = ref<'wall'|'timeline'|'albums'> // 当前视图
const locale = ref<'zh'|'en'>                // 当前语言
```

### Computed 状态
```typescript
const currentFamily = computed(() => ...)     // 当前家族对象
const canCreateAlbum = computed(() => ...)    // 是否有创建相册权限
const canManageMembers = computed(() => ...)  // 是否有管理成员权限
const needsFamilyGuide = computed(() => ...) // 是否需要引导创建家族
```

---

## 六、已知问题与修复记录

### Build_54 修复内容
1. **注册报错** - 添加 API 响应日志排查
2. **语言切换** - 添加 `:key` 强制重新渲染组件
3. **相册点击** - 同时监听 `openAlbum` 和 `open-album` 事件

### 部署流程 (重要!)
```bash
# 1. 清理并构建
rm -rf assets/ dist .vite
pnpm build

# 2. 复制dist到根目录 (关键步骤!)
rm -rf assets/
cp -r dist/assets/ .
cp dist/index.html .

# 3. 提交推送
git add -A
git commit -m "build: Build_XX"
git push origin main
```

---

## 七、项目结构

```
FamilyWall/
├── src/
│   ├── api.ts              # 所有API调用
│   ├── i18n.ts             # 多语言配置
│   ├── types.ts            # TypeScript类型定义
│   ├── App.vue             # 主应用组件
│   ├── main.ts             # 入口文件
│   ├── views/              # 页面视图
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── PhotoWall.vue
│   │   ├── Timeline.vue
│   │   └── AlbumList.vue
│   └── components/         # 复用组件
│       ├── Header.vue
│       ├── UploadModal.vue
│       ├── AlbumModal.vue
│       ├── AlbumDetail.vue
│       ├── PhotoDetail.vue
│       ├── ProfileModal.vue
│       ├── SettingsModal.vue
│       ├── CreateFamilyModal.vue
│       ├── InviteModal.vue
│       ├── FriendsList.vue
│       ├── Notifications.vue
│       ├── ShareModal.vue
│       └── SecuritySettings.vue
├── index.html
├── vite.config.ts
└── package.json
```

---

*最后更新: 2026-03-06 Build_54*
