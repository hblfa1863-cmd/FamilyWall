<template>
  <div class="map-page">
    <!-- 地图容器 -->
    <div id="amap-container" class="map-page__map"></div>
    
    <!-- 顶部搜索 -->
    <div class="map-page__search">
      <div class="map-page__search-box" @click="showSearch = true">
        <span>🔍</span>
        <span>搜索位置</span>
      </div>
    </div>
    
    <!-- 添加按钮 -->
    <button class="map-page__add-btn" @click="handleAddLocation">
      <span>+</span>
    </button>
    
    <!-- 位置搜索面板 -->
    <Transition name="slide-down">
      <div v-if="showSearch" class="map-page__search-panel">
        <div class="map-page__search-header">
          <div class="map-page__search-input-wrap">
            <span>🔍</span>
            <input 
              v-model="searchKeyword" 
              type="text" 
              placeholder="搜索地点"
              class="map-page__search-input"
              @input="handleSearch"
            />
          </div>
          <button class="map-page__search-close" @click="showSearch = false">取消</button>
        </div>
        
        <div class="map-page__search-results">
          <div 
            v-for="poi in searchResults" 
            :key="poi.id"
            class="map-page__search-result"
            @click="selectLocation(poi)"
          >
            <span class="map-page__result-icon">📍</span>
            <div class="map-page__result-info">
              <span class="map-page__result-name">{{ poi.name }}</span>
              <span class="map-page__result-address">{{ poi.address }}</span>
            </div>
          </div>
          
          <div v-if="searching" class="map-page__search-loading">
            搜索中...
          </div>
          
          <div v-if="!searching && searchResults.length === 0 && searchKeyword" class="map-page__search-empty">
            未找到相关地点
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- 位置详情卡片 -->
    <Transition name="slide-up">
      <div v-if="selectedLocation" class="map-page__card">
        <div class="map-page__card-header">
          <h3>{{ selectedLocation.name }}</h3>
          <button class="map-page__card-close" @click="selectedLocation = null">×</button>
        </div>
        
        <div class="map-page__card-images" v-if="selectedLocation.images && selectedLocation.images.length > 0">
          <img 
            v-for="(img, idx) in selectedLocation.images.slice(0, 3)" 
            :key="idx"
            :src="img" 
            class="map-page__card-image"
          />
        </div>
        
        <div class="map-page__card-meta">
          <span>📅 {{ selectedLocation.date }}</span>
          <span>👤 {{ selectedLocation.author }}</span>
        </div>
        
        <div class="map-page__card-actions">
          <button class="map-page__card-action" @click="goToNote(selectedLocation.noteId)">
            查看详情
          </button>
          <button class="map-page__card-action map-page__card-action--primary" @click="navigateTo(selectedLocation)">
            导航
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface LocationPOI {
  id: string;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
}

interface Location {
  id: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  date: string;
  author: string;
  images: string[];
  noteId: number;
}

const showSearch = ref(false);
const searchKeyword = ref('');
const searchResults = ref<LocationPOI[]>([]);
const searching = ref(false);
const selectedLocation = ref<Location | null>(null);
let map: any = null;
let markers: any[] = [];

const locations = ref<Location[]>([
  {
    id: 1,
    name: '春节团圆饭',
    address: '北京市朝阳区某餐厅',
    longitude: 116.397428,
    latitude: 39.90923,
    date: '2024-02-10',
    author: '张三',
    images: ['https://picsum.photos/200/200?random=1'],
    noteId: 1,
  },
  {
    id: 2,
    name: '清明踏青',
    address: '北京市海淀区某公园',
    longitude: 116.397428,
    latitude: 39.92923,
    date: '2024-04-04',
    author: '李四',
    images: ['https://picsum.photos/200/200?random=2'],
    noteId: 2,
  },
]);

onMounted(() => {
  // 初始化高德地图
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.destroy();
  }
});

const initMap = () => {
  // 这里需要引入高德地图 JS API
  // 实际项目中需要在 public/index.html 中引入高德地图 SDK
  // <script src="https://webapi.amap.com/maps?v=2.0&key=YOUR_KEY"></script>
  
  console.log('初始化高德地图...');
  
  // 模拟创建标记点
  locations.value.forEach(loc => {
    createMarker(loc);
  });
};

const createMarker = (location: Location) => {
  // 创建标记点
  const markerContent = document.createElement('div');
  markerContent.className = 'map-page__marker';
  markerContent.innerHTML = `
    <div class="map-page__marker-dot">
      <div class="map-page__marker-pulse"></div>
    </div>
  `;
  
  markerContent.addEventListener('click', () => {
    selectedLocation.value = location;
  });
};

const handleSearch = () => {
  if (!searchKeyword.value) {
    searchResults.value = [];
    return;
  }
  
  searching.value = true;
  
  // 模拟搜索
  setTimeout(() => {
    searchResults.value = [
      {
        id: '1',
        name: searchKeyword.value + '测试地点1',
        address: '北京市朝阳区测试路1号',
        longitude: 116.397428,
        latitude: 39.90923,
      },
      {
        id: '2',
        name: searchKeyword.value + '测试地点2',
        address: '北京市朝阳区测试路2号',
        longitude: 116.397428,
        latitude: 39.91923,
      },
    ];
    searching.value = false;
  }, 500);
};

const selectLocation = (poi: LocationPOI) => {
  showSearch.value = false;
  searchKeyword.value = '';
  searchResults.value = [];
  
  // 移动地图到选中位置
  console.log('选中位置:', poi);
};

const handleAddLocation = () => {
  // 跳转创建位置页面
  router.push('/locations/new');
};

const goToNote = (noteId: number) => {
  router.push(`/notes/${noteId}`);
};

const navigateTo = (location: Location) => {
  // 调用高德导航
  window.open(`https://uri.amap.com/marker?position=${location.longitude},${location.latitude}&name=${location.name}&coordinate=gaode&callnative=1`);
};
</script>

<style scoped>
.map-page {
  position: relative;
  height: 100vh;
  background: var(--color-background);
}

.map-page__map {
  width: 100%;
  height: 100%;
  background: #E5E5E5;
}

/* 搜索框 */
.map-page__search {
  position: absolute;
  top: env(safe-area-inset-top);
  left: 0;
  right: 0;
  padding: var(--spacing-md);
  z-index: 100;
}

.map-page__search-box {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-body-sm);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
}

/* 添加按钮 */
.map-page__add-btn {
  position: absolute;
  right: var(--spacing-lg);
  bottom: calc(var(--spacing-lg) + var(--tabbar-height) + 80px;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: white;
  font-size: 32px;
  border: none;
  box-shadow: var(--shadow-xl);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all var(--transition-normal);
}

.map-page__add-btn:hover {
  transform: scale(1.1);
}

/* 搜索面板 */
.map-page__search-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-surface);
  z-index: 200;
  display: flex;
  flex-direction: column;
}

.map-page__search-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  padding-top: calc(var(--spacing-md) + env(safe-area-inset-top));
  border-bottom: 1px solid var(--color-border);
}

.map-page__search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
}

.map-page__search-input {
  flex: 1;
  border: none;
  background: none;
  font-size: var(--font-size-body);
  outline: none;
}

.map-page__search-close {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-body);
  cursor: pointer;
}

.map-page__search-results {
  flex: 1;
  overflow-y: auto;
}

.map-page__search-result {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  cursor: pointer;
}

.map-page__search-result:hover {
  background: var(--color-background);
}

.map-page__result-icon {
  font-size: 20px;
}

.map-page__result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.map-page__result-name {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
}

.map-page__result-address {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
}

.map-page__search-loading,
.map-page__search-empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-tertiary);
}

/* 位置详情卡片 */
.map-page__card {
  position: absolute;
  left: var(--spacing-md);
  right: var(--spacing-md);
  bottom: calc(var(--spacing-lg) + var(--tabbar-height));
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-xl);
  z-index: 100;
}

.map-page__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.map-page__card-header h3 {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.map-page__card-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--color-text-tertiary);
  cursor: pointer;
}

.map-page__card-images {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.map-page__card-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.map-page__card-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-md);
}

.map-page__card-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.map-page__card-action {
  flex: 1;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  font-size: var(--font-size-body-sm);
  cursor: pointer;
}

.map-page__card-action--primary {
  background: var(--color-primary);
  color: white;
  border: none;
}

/* 动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform var(--transition-normal);
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 地图标记点样式 */
.map-page__marker {
  cursor: pointer;
}

.map-page__marker-dot {
  width: 32px;
  height: 32px;
  background: var(--color-danger);
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.map-page__marker-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--color-danger);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
