import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Types from '@/components/UI/Types.vue'
import MarkerEditor from '@/components/UI/Types/MarkerEditor.vue'
import LineEditor from '@/components/UI/Types/LineEditor.vue'
import ShapeEditor from '@/components/UI/Types/ShapeEditor.vue'
import { ref } from 'vue'

// Mock the child components
vi.mock('@/components/UI/Types/MarkerEditor.vue', () => ({
  default: {
    name: 'MarkerEditor',
    template: '<div class="marker-editor"></div>'
  }
}))

vi.mock('@/components/UI/Types/LineEditor.vue', () => ({
  default: {
    name: 'LineEditor',
    template: '<div class="line-editor"></div>'
  }
}))

vi.mock('@/components/UI/Types/ShapeEditor.vue', () => ({
  default: {
    name: 'ShapeEditor',
    template: '<div class="shape-editor"></div>'
  }
}))

// Mock state store
vi.mock('@/stores/stateStore.js', () => ({
  useStateStore: () => ({
    isReady: ref(true)
  })
}))

describe('Types.vue', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
  })

  it('renders the component with default tab (marker)', () => {
    const wrapper = mount(Types, {
      global: {
        stubs: {
          MarkerEditor: true,
          LineEditor: true,
          ShapeEditor: true
        }
      }
    })
    
    // Check if the component is rendered
    expect(wrapper.exists()).toBe(true)
    
    // Check if tabs are rendered
    expect(wrapper.find('.tab-navigation').exists()).toBe(true)
    expect(wrapper.findAll('.tab-button').length).toBe(3)
    
    // Check if the marker tab is active by default
    const tabButtons = wrapper.findAll('.tab-button')
    expect(tabButtons[0].classes()).toContain('active')
    
    // Since we're using stubs and v-show, we need to check active tab instead
    expect(wrapper.vm.activeTab).toBe('marker')
  })

  it('renders the component with initialTab prop set to line', () => {
    const wrapper = mount(Types, {
      props: {
        initialTab: 'line'
      },
      global: {
        stubs: {
          MarkerEditor: true,
          LineEditor: true,
          ShapeEditor: true
        }
      }
    })
    
    // Check if the line tab is active
    const tabButtons = wrapper.findAll('.tab-button')
    expect(tabButtons[1].classes()).toContain('active')
    
    // Since we're using stubs and v-show, we need to check active tab instead
    expect(wrapper.vm.activeTab).toBe('line')
  })

  it('renders the component with initialTab prop set to shape', () => {
    const wrapper = mount(Types, {
      props: {
        initialTab: 'shape'
      },
      global: {
        stubs: {
          MarkerEditor: true,
          LineEditor: true,
          ShapeEditor: true
        }
      }
    })
    
    // Check if the shape tab is active
    const tabButtons = wrapper.findAll('.tab-button')
    expect(tabButtons[2].classes()).toContain('active')
    
    // Since we're using stubs and v-show, we need to check active tab instead
    expect(wrapper.vm.activeTab).toBe('shape')
  })

  it('switches tab when a tab button is clicked', async () => {
    const wrapper = mount(Types, {
      global: {
        stubs: {
          MarkerEditor: true,
          LineEditor: true,
          ShapeEditor: true
        }
      }
    })
    
    // Initially, marker tab should be active
    const tabButtons = wrapper.findAll('.tab-button')
    expect(tabButtons[0].classes()).toContain('active')
    expect(wrapper.vm.activeTab).toBe('marker')
    
    // Click on the line tab
    await tabButtons[1].trigger('click')
    
    // Line tab should now be active
    expect(tabButtons[1].classes()).toContain('active')
    expect(tabButtons[0].classes()).not.toContain('active')
    expect(wrapper.vm.activeTab).toBe('line')
    
    // Click on the shape tab
    await tabButtons[2].trigger('click')
    
    // Shape tab should now be active
    expect(tabButtons[2].classes()).toContain('active')
    expect(tabButtons[1].classes()).not.toContain('active')
    expect(wrapper.vm.activeTab).toBe('shape')
  })

  it('updates active tab when initialTab prop changes', async () => {
    const wrapper = mount(Types, {
      props: {
        initialTab: 'marker'
      },
      global: {
        stubs: {
          MarkerEditor: true,
          LineEditor: true,
          ShapeEditor: true
        }
      }
    })
    
    // Initially, marker tab should be active
    const tabButtons = wrapper.findAll('.tab-button')
    expect(tabButtons[0].classes()).toContain('active')
    
    // Update the initialTab prop
    await wrapper.setProps({ initialTab: 'line' })
    
    // Line tab should now be active
    expect(tabButtons[1].classes()).toContain('active')
    expect(tabButtons[0].classes()).not.toContain('active')
    
    // Update the initialTab prop again
    await wrapper.setProps({ initialTab: 'shape' })
    
    // Shape tab should now be active
    expect(tabButtons[2].classes()).toContain('active')
    expect(tabButtons[1].classes()).not.toContain('active')
  })
})
