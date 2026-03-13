import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores';

// 路由懒加载
const LoginView = () => import('@/views/LoginView.vue');
const RegisterView = () => import('@/views/RegisterView.vue');
const ForgotPassword = () => import('@/views/ForgotPassword.vue');
const PhotoWall = () => import('@/views/PhotoWall.vue');
const Timeline = () => import('@/views/Timeline.vue');
const MapView = () => import('@/views/MapView.vue');
const NoteDetail = () => import('@/views/NoteDetail.vue');
const NotificationsView = () => import('@/views/NotificationsView.vue');
const MyFamilies = () => import('@/views/MyFamilies.vue');
const FamilyDetail = () => import('@/views/FamilyDetail.vue');
const CreateFamily = () => import('@/views/CreateFamily.vue');
const JoinFamily = () => import('@/views/JoinFamily.vue');
const MyClans = () => import('@/views/MyClans.vue');
const ClansView = () => import('@/views/ClansView.vue');
const ClanDetail = () => import('@/views/ClanDetail.vue');
const CreateClan = () => import('@/views/CreateClan.vue');
const CreateNote = () => import('@/views/CreateNote.vue');
const SearchView = () => import('@/views/SearchView.vue');
const ProfileView = () => import('@/views/ProfileView.vue');
const SettingsView = () => import('@/views/SettingsView.vue');
const PrivacyView = () => import('@/views/PrivacyView.vue');
const TermsView = () => import('@/views/TermsView.vue');
const AboutView = () => import('@/views/AboutView.vue');
const SetupView = () => import('@/views/SetupView.vue');

// 路由守卫
const requiresAuth = async (to: any, from: any, next: any) => {
  const authStore = useAuthStore();
  
  if (!authStore.token) {
    // 未登录，跳转登录页
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }
  
  // 已登录但无用户信息，获取一下
  if (!authStore.user) {
    await authStore.fetchProfile();
  }
  
  next();
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: PhotoWall,
    meta: { title: '照片墙' },
  },
  {
    path: '/setup',
    name: 'setup',
    component: SetupView,
    meta: { title: '设置服务器', guest: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: '登录', guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { title: '注册', guest: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: { title: '忘记密码', guest: true },
  },
  {
    path: '/photo-wall',
    name: 'photo-wall',
    component: PhotoWall,
    meta: { title: '照片墙' },
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: Timeline,
    meta: { title: '时光轴' },
  },
  {
    path: '/map',
    name: 'map',
    component: MapView,
    meta: { title: '地图' },
  },
  {
    path: '/notes/:id',
    name: 'note-detail',
    component: NoteDetail,
    meta: { title: '笔记详情' },
  },
  {
    path: '/notes/create',
    name: 'create-note',
    component: CreateNote,
    meta: { title: '创建笔记', requiresAuth: true },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsView,
    meta: { title: '通知', requiresAuth: true },
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { title: '搜索' },
  },
  // 家庭
  {
    path: '/families',
    name: 'my-families',
    component: MyFamilies,
    meta: { title: '我的家庭', requiresAuth: true },
  },
  {
    path: '/families/new',
    name: 'create-family',
    component: CreateFamily,
    meta: { title: '创建家庭', requiresAuth: true },
  },
  {
    path: '/families/join',
    name: 'join-family',
    component: JoinFamily,
    meta: { title: '加入家庭', requiresAuth: true },
  },
  {
    path: '/families/:id',
    name: 'family-detail',
    component: FamilyDetail,
    meta: { title: '家庭详情', requiresAuth: true },
  },
  // 家族
  {
    path: '/clans',
    name: 'my-clans',
    component: MyClans,
    meta: { title: '我的家族', requiresAuth: true },
  },
  {
    path: '/clans/public',
    name: 'clans-square',
    component: ClansView,
    meta: { title: '家族广场' },
  },
  {
    path: '/clans/new',
    name: 'create-clan',
    component: CreateClan,
    meta: { title: '创建家族', requiresAuth: true },
  },
  {
    path: '/clans/:id',
    name: 'clan-detail',
    component: ClanDetail,
    meta: { title: '家族详情' },
  },
  // 个人
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { title: '个人中心', requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { title: '设置', requiresAuth: true },
  },
  // 静态页面
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyView,
    meta: { title: '隐私政策' },
  },
  {
    path: '/terms',
    name: 'terms',
    component: TermsView,
    meta: { title: '用户协议' },
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: '关于我们' },
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  document.title = (to.meta.title as string) || 'FamilyWall';
  
  const authStore = useAuthStore();
  
  // 检查是否配置了 API 地址 (setup 页面不需要检查)
  const apiUrl = localStorage.getItem('api_url');
  if (!apiUrl && to.name !== 'setup' && to.name !== 'login' && to.name !== 'register') {
    next({ name: 'setup' });
    return;
  }
  
  // 需要认证的页面
  if (to.meta.requiresAuth) {
    if (!authStore.token) {
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }
    if (!authStore.user) {
      await authStore.fetchProfile();
    }
  }
  
  // 游客-only 页面 (如已登录跳转首页)
  if (to.meta.guest && authStore.isLoggedIn) {
    next({ name: 'home' });
    return;
  }
  
  next();
});

export default router;
