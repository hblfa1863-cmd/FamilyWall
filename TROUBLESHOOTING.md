# FamilyWall 疑难杂症总结

## 2026-03-05 构建缓存与版本不更新问题

### 问题：GitHub Pages 部署后网页显示旧版本

**现象：** 每次推送新代码后，GitHub Pages 打开仍是旧内容，即使构建成功了也不更新。

### 解决方案

每次代码修改后执行：

```bash
# 1. 清理所有缓存
rm -rf dist .vite

# 2. 删除 index.html（让 Vite 重新生成）
rm -f index.html

# 3. 重新构建
pnpm build

# 4. 检查 dist/index.html 内容
cat dist/index.html

# 5. 复制到根目录
cp -r dist/* .

# 6. 推送到 GitHub
git add -A
git commit -m "build: Build_XX"
git push origin main
```

### 关键点

1. index.html 必须是从 dist 目录复制过来的最新版本
2. 不能用 Git 追踪的旧版本 index.html
3. 使用 Build 号标识版本，方便确认是否加载新版本
