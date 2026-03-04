import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import PhotoWall from '../views/PhotoWall.vue'

// Mock data
const mockPhotos = [
  {
    id: 'p1',
    familyId: 'fam1',
    urls: ['https://example.com/photo1.jpg'],
    type: 'image',
    title: '测试照片1',
    description: '描述1',
    uploadedBy: 'user1',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'p2',
    familyId: 'fam1',
    urls: ['https://example.com/photo2.jpg'],
    type: 'image',
    title: '测试照片2',
    uploadedBy: 'user1',
    createdAt: '2024-01-10T10:00:00Z'
  }
]

describe('PhotoWall', () => {
  it('renders empty state when no photos', () => {
    const wrapper = mount(PhotoWall, {
      props: {
        photos: [],
        canUpload: true
      }
    })
    
    expect(wrapper.text()).toContain('还没有照片')
  })

  it('renders photos correctly', () => {
    const wrapper = mount(PhotoWall, {
      props: {
        photos: mockPhotos,
        canUpload: true
      }
    })
    
    expect(wrapper.text()).toContain('2 张照片')
  })

  it('shows family name when provided', () => {
    const wrapper = mount(PhotoWall, {
      props: {
        photos: mockPhotos,
        familyName: '测试家族',
        canUpload: true
      }
    })
    
    expect(wrapper.text()).toContain('测试家族')
  })

  it('shows upload button when canUpload is true', () => {
    const wrapper = mount(PhotoWall, {
      props: {
        photos: [],
        canUpload: true
      }
    })
    
    const button = wrapper.find('button[aria-label="上传照片"]')
    expect(button.exists()).toBe(true)
  })

  it('hides upload button when canUpload is false', () => {
    const wrapper = mount(PhotoWall, {
      props: {
        photos: [],
        canUpload: false
      }
    })
    
    const button = wrapper.find('button[aria-label="上传照片"]')
    expect(button.exists()).toBe(false)
  })

  it('emits selectPhoto event when clicking photo', async () => {
    const wrapper = mount(PhotoWall, {
      props: {
        photos: mockPhotos,
        canUpload: true
      }
    })
    
    const photoCards = wrapper.findAll('.grid > div')
    await photoCards[0].trigger('click')
    
    expect(wrapper.emitted('selectPhoto')).toBeTruthy()
  })
})
