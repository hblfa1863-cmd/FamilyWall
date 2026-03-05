// 多语言配置
export type Locale = 'zh' | 'en'

export interface LocaleMessages {
  [key: string]: string | LocaleMessages
}

export const messages: Record<Locale, LocaleMessages> = {
  zh: {
    // 通用
    app: {
      name: '照片墙',
      tagline: '记录每一刻珍贵回忆'
    },
    // 导航
    nav: {
      photoWall: '照片墙',
      timeline: '时光轴',
      albums: '相册管理',
      createFamily: '新建家族',
      inviteCode: '邀请码',
      share: '分享',
      friends: '好友',
      notifications: '通知',
      security: '安全设置',
      logout: '退出',
      profile: '个人资料'
    },
    // 操作
    actions: {
      upload: '上传',
      create: '创建',
      save: '保存',
      cancel: '取消',
      delete: '删除',
      edit: '编辑',
      confirm: '确认',
      close: '关闭',
      copy: '复制',
      copied: '已复制',
      share: '分享'
    },
    // 登录注册
    auth: {
      login: '登录',
      register: '注册',
      email: '邮箱地址',
      password: '密码',
      confirmPassword: '确认密码',
      username: '用户名',
      inviteCode: '邀请码（可选）',
      hasAccount: '已有账号?',
      noAccount: '没有账号?',
      loginSuccess: '登录成功',
      registerSuccess: '注册成功',
      passwordMinLength: '密码至少需要6位',
      passwordMismatch: '两次输入的密码不一致'
    },
    // 家族
    family: {
      title: '我的家族',
      create: '创建家族',
      createSuccess: '家族创建成功！',
      switchFamily: '切换家族',
      description: '家族描述（可选）',
      name: '家族名称',
      namePlaceholder: '例如：我的大家庭',
      createAlbum: '同时创建一个相册',
      albumName: '相册名称',
      albumNamePlaceholder: '例如：2024春节',
      noFamily: '还没有加入任何家族',
      createOrJoin: '创建或加入一个家族开始使用'
    },
    // 相册
    album: {
      title: '相册',
      create: '新建相册',
      createSuccess: '相册创建成功',
      name: '相册名称',
      namePlaceholder: '例如：2024春节聚会',
      description: '描述（可选）',
      privacy: '可见性',
      public: '公开',
      private: '私有',
      protected: '限定',
      empty: '还没有相册',
      emptyHint: '创建相册来整理你的照片',
      duplicateName: '相册名称已存在，请使用其他名称',
      noPermission: '没有权限创建相册'
    },
    // 照片
    photo: {
      title: '照片',
      upload: '上传照片',
      empty: '还没有照片',
      emptyHint: '上传第一张照片开始记录美好时光',
      selectAll: '全选',
      deselectAll: '取消全选',
      deleteSelected: '删除',
      sort: {
        newest: '最新优先',
        oldest: '最早优先',
        name: '按名称'
      }
    },
    // 时光轴
    timeline: {
      title: '时光轴',
      photos: '张照片',
      empty: '还没有照片',
      emptyHint: '上传照片开始记录时光'
    },
    // 分享
    share: {
      title: '分享',
      shareLink: '分享链接',
      shareTo: '分享到',
      sharePhoto: '分享照片',
      shareAlbum: '分享相册',
      platforms: {
        weibo: '微博',
        qq: 'QQ',
        weixin: '微信',
        telegram: 'Telegram',
        facebook: 'Facebook',
        whatsapp: 'WhatsApp',
        instagram: 'Instagram',
        pinterest: 'Pinterest',
        xiaohongshu: '小红书',
        douyin: '抖音',
        tiktok: 'TikTok'
      }
    },
    // 个人资料
    profile: {
      title: '个人资料',
      edit: '编辑资料',
      username: '用户名',
      email: '邮箱',
      avatar: '头像',
      saveSuccess: '保存成功',
      saveFailed: '保存失败'
    },
    // 通知
    notifications: {
      title: '通知',
      empty: '暂无通知',
      markRead: '标记已读'
    },
    // 好友
    friends: {
      title: '好友',
      add: '添加好友',
      search: '搜索用户',
      pending: '待确认',
      accepted: '已添加',
      empty: '暂无好友',
      emptyHint: '添加好友开始分享'
    },
    // 安全设置
    security: {
      title: '安全设置',
      tips: '安全建议',
      privacy: '隐私保护',
      loginSecurity: '登录安全',
      tipsList: [
        '使用强密码，定期更换',
        '不要向陌生人透露账户信息',
        '谨慎添加陌生人为好友',
        '及时举报违规内容'
      ],
      allowFriendsView: '允许好友查看我的照片',
      receiveNotifications: '接收点赞和评论通知',
      allowSearch: '允许通过邮箱搜索到我',
      loginProtection: '账户登录失败保护已开启'
    },
    // 错误
    error: {
      networkError: '网络错误，请稍后重试',
      unauthorized: '请先登录',
      forbidden: '没有权限',
      notFound: '内容不存在'
    }
  },
  en: {
    // Common
    app: {
      name: 'PhotoWall',
      tagline: 'Capture every precious moment'
    },
    // Navigation
    nav: {
      photoWall: 'Photo Wall',
      timeline: 'Timeline',
      albums: 'Albums',
      createFamily: 'New Family',
      inviteCode: 'Invite Code',
      share: 'Share',
      friends: 'Friends',
      notifications: 'Notifications',
      security: 'Security',
      logout: 'Logout',
      profile: 'Profile'
    },
    // Actions
    actions: {
      upload: 'Upload',
      create: 'Create',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
      close: 'Close',
      copy: 'Copy',
      copied: 'Copied',
      share: 'Share'
    },
    // Auth
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      username: 'Username',
      inviteCode: 'Invite Code (optional)',
      hasAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration successful',
      passwordMinLength: 'Password must be at least 6 characters',
      passwordMismatch: 'Passwords do not match'
    },
    // Family
    family: {
      title: 'My Families',
      create: 'Create Family',
      createSuccess: 'Family created successfully!',
      switchFamily: 'Switch Family',
      description: 'Description (optional)',
      name: 'Family Name',
      namePlaceholder: "e.g., My Family",
      createAlbum: 'Also create an album',
      albumName: 'Album Name',
      albumNamePlaceholder: "e.g., Chinese New Year 2024",
      noFamily: "You haven't joined any family",
      createOrJoin: 'Create or join a family to get started'
    },
    // Albums
    album: {
      title: 'Albums',
      create: 'New Album',
      createSuccess: 'Album created successfully',
      name: 'Album Name',
      namePlaceholder: "e.g., Chinese New Year 2024",
      description: 'Description (optional)',
      privacy: 'Privacy',
      public: 'Public',
      private: 'Private',
      protected: 'Protected',
      empty: 'No albums yet',
      emptyHint: 'Create albums to organize your photos',
      duplicateName: 'Album name already exists, please use another name',
      noPermission: 'No permission to create album'
    },
    // Photos
    photo: {
      title: 'Photos',
      upload: 'Upload Photos',
      empty: 'No photos yet',
      emptyHint: 'Upload your first photo to start capturing moments',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      deleteSelected: 'Delete',
      sort: {
        newest: 'Newest First',
        oldest: 'Oldest First',
        name: 'By Name'
      }
    },
    // Timeline
    timeline: {
      title: 'Timeline',
      photos: 'photos',
      empty: 'No photos yet',
      emptyHint: 'Upload photos to start recording memories'
    },
    // Share
    share: {
      title: 'Share',
      shareLink: 'Share Link',
      shareTo: 'Share to',
      sharePhoto: 'Share Photo',
      shareAlbum: 'Share Album',
      platforms: {
        weibo: 'Weibo',
        qq: 'QQ',
        weixin: 'WeChat',
        telegram: 'Telegram',
        facebook: 'Facebook',
        whatsapp: 'WhatsApp',
        instagram: 'Instagram',
        pinterest: 'Pinterest',
        xiaohongshu: 'Xiaohongshu',
        douyin: 'Douyin',
        tiktok: 'TikTok'
      }
    },
    // Profile
    profile: {
      title: 'Profile',
      edit: 'Edit Profile',
      username: 'Username',
      email: 'Email',
      avatar: 'Avatar',
      saveSuccess: 'Saved successfully',
      saveFailed: 'Failed to save'
    },
    // Notifications
    notifications: {
      title: 'Notifications',
      empty: 'No notifications',
      markRead: 'Mark as read'
    },
    // Friends
    friends: {
      title: 'Friends',
      add: 'Add Friend',
      search: 'Search Users',
      pending: 'Pending',
      accepted: 'Friends',
      empty: 'No friends yet',
      emptyHint: 'Add friends to start sharing'
    },
    // Security
    security: {
      title: 'Security Settings',
      tips: 'Security Tips',
      privacy: 'Privacy',
      loginSecurity: 'Login Security',
      tipsList: [
        'Use strong passwords and change them regularly',
        "Don't share account info with strangers",
        'Be careful when adding strangers as friends',
        'Report inappropriate content promptly'
      ],
      allowFriendsView: 'Allow friends to view my photos',
      receiveNotifications: 'Receive like and comment notifications',
      allowSearch: 'Allow being found by email',
      loginProtection: 'Login failure protection enabled'
    },
    // Errors
    error: {
      networkError: 'Network error, please try again later',
      unauthorized: 'Please login first',
      forbidden: 'No permission',
      notFound: 'Content not found'
    }
  }
}

// 获取翻译文本
export function t(key: string, locale: Locale = 'zh'): string {
  const keys = key.split('.')
  let value: any = messages[locale]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // 如果找不到翻译，回退到中文
      value = messages.zh
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key // 返回key如果都找不到
        }
      }
      break
    }
  }
  
  return typeof value === 'string' ? value : key
}
