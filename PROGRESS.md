# Ralph Mode: FamilyWall Phase 1 开发

## 状态：进行中 🔄

## Sprint 1: 照片管理增强

### 任务 1.1: 照片批量选择功能
- [x] 完成 ✅

### 任务 1.2: 照片批量删除
- [x] 完成 ✅

### 任务 1.3: 照片排序
- [x] 完成 ✅
  - 支持最新/最早/名称排序

### 任务 1.4: 相册内照片筛选
- [x] 完成 ✅
  - 使用排序下拉框

---

## Sprint 2: 评论与互动优化

### 任务 2.1: 评论头像显示
- [x] 完成 ✅
  - 根据用户名生成渐变头像

### 任务 2.2: 评论时间格式优化
- [x] 完成 ✅
  - 相对时间显示（刚刚、X分钟前、X小时前等）

### 任务 2.3: 空状态优化
- [x] 完成 ✅
  - 添加"抢沙发"提示

---

## Sprint 3: 用户体验细节

### 任务 3.1: Toast 提示组件
- [x] 完成 ✅

### 任务 3.2: 骨架屏加载状态
- [x] 完成 ✅

---

## Sprint 4: 响应式与无障碍
- [ ] 待处理

---

## 已修改文件
- `src/views/PhotoWall.vue` - 批量选择、排序
- `src/components/PhotoDetail.vue` - 评论优化
- `src/components/Toast.vue` - 新增
- `src/components/PhotoSkeleton.vue` - 新增
- `src/api.ts` - 批量删除API
- `src/App.vue` - 事件处理
