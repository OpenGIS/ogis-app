import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MarkerEditor from '@/components/UI/Types/MarkerEditor.vue'
import { ref } from 'vue'

// Mock the dependencies
vi.mock('@/composables/useWaymark.js', () => ({
  useWaymark: () => ({
    redrawData: vi.fn()
  })
}))

// Mock State class
vi.mock('@/classes/State.js', () => ({
  State: class State {
    constructor(params) {
      this.config = params.config
      this.features = params.features
    }
    getFeatures() {
      return []
    }
  }
}))

// Mock store
vi.mock('@/stores/stateStore.js', () => {
  return {
    useStateStore: vi.fn(() => ({
      Waymark: ref({
        type_preview: vi.fn().mockReturnValue('<div>Marker Preview</div>'),
        parse_type: vi.fn().mockReturnValue({})
      }),
      state: ref({
        getMarkerTypes: vi.fn().mockReturnValue([
          {
            marker_title: 'Test Marker',
            marker_shape: 'marker',
            marker_size: 'medium',
            marker_colour: '#ff0000',
            icon_type: 'icon',
            marker_icon: 'ion-flag',
            icon_colour: '#ffffff'
          }
        ]),
        getConfig: vi.fn().mockReturnValue({
          clone: vi.fn().mockReturnValue({
            setMapOption: vi.fn()
          })
        }),
        getFeatures: vi.fn().mockReturnValue([])
      }),
      isReady: ref(true)
    }))
  }
})

describe('MarkerEditor.vue', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
  })

  it('renders the marker editor table with marker types', () => {
    const wrapper = mount(MarkerEditor)
    
    // Check if the component is rendered
    expect(wrapper.exists()).toBe(true)
    
    // Check if the table is rendered
    expect(wrapper.find('table.marker-types').exists()).toBe(true)
    
    // Check table headers
    const headers = wrapper.findAll('th')
    expect(headers.length).toBe(8)
    expect(headers[0].text()).toBe('Preview')
    expect(headers[1].text()).toBe('Title')
    expect(headers[2].text()).toBe('Shape')
    expect(headers[3].text()).toBe('Size')
    expect(headers[4].text()).toBe('Colour')
    expect(headers[5].text()).toBe('Icon Type')
    expect(headers[6].text()).toBe('Icon')
    expect(headers[7].text()).toBe('Icon Colour')
  })
})
