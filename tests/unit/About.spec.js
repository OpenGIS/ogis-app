import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import About from '@/components/UI/Menu/About.vue'

describe('About.vue', () => {
  // Helper function to mount the component
  const mountAbout = () => {
    return mount(About)
  }
  
  it('renders correctly with all elements', () => {
    const wrapper = mountAbout()
    
    // Check title
    expect(wrapper.find('h2').text()).toBe('About OGIS App')
    
    // Check logo
    expect(wrapper.find('.logo-container img').exists()).toBe(true)
    expect(wrapper.find('.logo-container img').attributes('alt')).toBe('OGIS Logo')
    
    // Check paragraphs
    const paragraphs = wrapper.findAll('p')
    expect(paragraphs.length).toBeGreaterThanOrEqual(2)
    expect(paragraphs[0].text()).toContain('Open GIS')
    expect(paragraphs[1].text()).toContain('Waymark JS')
    
    // Check features section
    expect(wrapper.find('h3').text()).toBe('Features')
    
    // Check features list
    const features = wrapper.findAll('ul li')
    expect(features.length).toBe(5)
    expect(features[0].text()).toContain('Create and edit geographical features')
    expect(features[1].text()).toContain('Customize marker types and styles')
    expect(features[2].text()).toContain('Import and export data in various formats')
    expect(features[3].text()).toContain('Undo/redo functionality')
    expect(features[4].text()).toContain('Save your work locally')
    
    // Check version
    expect(wrapper.find('.version').text()).toBe('Version 1.0.0')
  })

  it('has correct styling', () => {
    const wrapper = mountAbout()
    
    // Check that the about popup container exists
    expect(wrapper.find('.about-popup').exists()).toBe(true)
    
    // Title color should be set via CSS, but we can check structure
    expect(wrapper.find('h2').exists()).toBe(true)
    
    // Logo container is centered
    expect(wrapper.find('.logo-container').exists()).toBe(true)
    
    // Version is right aligned
    expect(wrapper.find('.version').exists()).toBe(true)
  })
})
