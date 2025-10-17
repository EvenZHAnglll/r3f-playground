# 3D Tiles Renderer Demo

这个演示页面展示了如何在 React Three Fiber 项目中集成 NASA 的 3DTilesRendererJS 库。

## 功能特性

- ✅ 3D Tiles 格式支持
- ✅ React Three Fiber 集成
- ✅ 相机控制 (OrbitControls)
- ✅ 自动视图适配
- ✅ 加载状态显示
- ✅ 错误处理和降级显示

## 已实现的组件

### 1. `/src/app/3d-tiles/page.tsx`

- 主要页面组件
- 包含控制说明和信息面板

### 2. `/src/app/3d-tiles/canvas3D.tsx`

- 3D Canvas 容器
- 设置相机、光照和控制器
- 集成 TilesRenderer3D 组件

### 3. `/src/components/r3f/tilesRenderer.tsx`

- 核心 3D Tiles 渲染组件
- 封装 3DTilesRendererJS 为 React 组件
- 提供降级几何体展示

## 使用的数据源

### 主要数据源

- NASA 官方示例数据集
- 支持多种 3D Tiles 格式 (B3DM, I3DM, PNTS, etc.)

### 备选数据源 (在代码中注释)

- Google 3D Tiles
- Cesium Ion 数据集
- 其他公开的 3D Tileset

## 控制说明

- **左键拖拽**: 旋转相机
- **右键拖拽**: 平移相机
- **滚轮**: 缩放
- **双击**: 自动适配视图

## 技术栈

- React Three Fiber (@react-three/fiber)
- 3DTilesRendererJS (3d-tiles-renderer)
- Three.js
- Next.js 15
- TypeScript
- Tailwind CSS

## 访问地址

开发服务器启动后，访问: `http://localhost:3000/3d-tiles`
