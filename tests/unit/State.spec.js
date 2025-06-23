import { describe, it, expect, beforeEach } from 'vitest'
import { State } from '@/classes/State.js'
import { Waymark_Config } from '@/classes/Waymark_Config.js'

describe('State class', () => {
  let state
  
  beforeEach(() => {
    // Create a fresh state instance for each test
    state = new State()
  })
  
  it('creates a new state with default values', () => {
    expect(state.type).toBe('FeatureCollection')
    expect(state.features).toEqual([])
    expect(state.properties.waymark_config).toBeInstanceOf(Waymark_Config)
  })
  
  it('can be initialized with features and config', () => {
    const features = [
      { type: 'Feature', geometry: { type: 'Point' } }
    ]
    const config = new Waymark_Config()
    
    state = new State({ features, config })
    
    expect(state.features).toEqual(features)
    expect(state.properties.waymark_config).toBe(config)
  })
  
  it('can get and set features', () => {
    const features = [
      { type: 'Feature', geometry: { type: 'Point' } },
      { type: 'Feature', geometry: { type: 'LineString' } }
    ]
    
    state.setFeatures(features)
    
    expect(state.getFeatures()).toEqual(features)
  })
  
  it('can get a feature by ID', () => {
    const feature1 = { id: 'feature1', type: 'Feature', geometry: { type: 'Point' } }
    const feature2 = { id: 'feature2', type: 'Feature', geometry: { type: 'LineString' } }
    
    state.setFeatures([feature1, feature2])
    
    expect(state.getFeatureById('feature1')).toEqual(feature1)
    expect(state.getFeatureById('feature2')).toEqual(feature2)
    expect(state.getFeatureById('nonexistent')).toBeNull()
  })
  
  it('can update a specific feature', () => {
    const feature1 = { id: 'feature1', type: 'Feature', geometry: { type: 'Point' } }
    const feature2 = { id: 'feature2', type: 'Feature', geometry: { type: 'LineString' } }
    
    state.setFeatures([feature1, feature2])
    
    const updatedFeature = { 
      id: 'feature1', 
      type: 'Feature', 
      geometry: { type: 'Point', coordinates: [10, 20] } 
    }
    
    expect(state.updateFeature('feature1', updatedFeature)).toBe(true)
    expect(state.getFeatureById('feature1')).toEqual(updatedFeature)
    
    // Try to update a non-existent feature
    expect(state.updateFeature('nonexistent', updatedFeature)).toBe(false)
  })
  
  it('can update feature properties', () => {
    const feature = { 
      id: 'feature1', 
      type: 'Feature', 
      geometry: { type: 'Point' },
      properties: { color: 'red' }
    }
    
    state.setFeatures([feature])
    
    const newProperties = { color: 'blue', name: 'Point of Interest' }
    
    expect(state.updateFeatureProperties('feature1', newProperties)).toBe(true)
    expect(state.getFeatureById('feature1').properties).toEqual(newProperties)
    
    // Try to update a non-existent feature
    expect(state.updateFeatureProperties('nonexistent', newProperties)).toBe(false)
  })
  
  it('can add a new feature', () => {
    const feature = { 
      id: 'feature1', 
      type: 'Feature', 
      geometry: { type: 'Point' } 
    }
    
    state.addFeature(feature)
    
    expect(state.getFeatures()).toEqual([feature])
    expect(state.getFeatures().length).toBe(1)
  })
  
  it('can remove a feature by ID', () => {
    const feature1 = { id: 'feature1', type: 'Feature', geometry: { type: 'Point' } }
    const feature2 = { id: 'feature2', type: 'Feature', geometry: { type: 'LineString' } }
    
    state.setFeatures([feature1, feature2])
    
    expect(state.removeFeature('feature1')).toBe(true)
    expect(state.getFeatures()).toEqual([feature2])
    
    // Try to remove a non-existent feature
    expect(state.removeFeature('nonexistent')).toBe(false)
    expect(state.getFeatures().length).toBe(1)
  })
  
  it('can access and modify the configuration', () => {
    // Get the default config
    const config = state.getConfig()
    expect(config).toBeInstanceOf(Waymark_Config)
    
    // Create a new config and set it
    const newConfig = new Waymark_Config()
    state.setConfig(newConfig)
    
    expect(state.getConfig()).toBe(newConfig)
  })
  
  it('can get and set marker types', () => {
    const markerTypes = [
      { marker_title: 'Type 1', marker_colour: '#ff0000' },
      { marker_title: 'Type 2', marker_colour: '#00ff00' }
    ]
    
    state.setMarkerTypes(markerTypes)
    
    expect(state.getMarkerTypes()).toEqual(markerTypes)
  })
  
  it('can get and set line types', () => {
    const lineTypes = [
      { line_title: 'Type 1', line_colour: '#ff0000' },
      { line_title: 'Type 2', line_colour: '#00ff00' }
    ]
    
    state.setLineTypes(lineTypes)
    
    expect(state.getLineTypes()).toEqual(lineTypes)
  })
  
  it('can get and set shape types', () => {
    const shapeTypes = [
      { shape_title: 'Type 1', shape_colour: '#ff0000' },
      { shape_title: 'Type 2', shape_colour: '#00ff00' }
    ]
    
    state.setShapeTypes(shapeTypes)
    
    expect(state.getShapeTypes()).toEqual(shapeTypes)
  })
  
  it('can clone itself', () => {
    const features = [
      { id: 'feature1', type: 'Feature', geometry: { type: 'Point' } }
    ]
    
    state.setFeatures(features)
    state.setMarkerTypes([{ marker_title: 'Test' }])
    
    const clone = state.clone()
    
    // Check that it's a new instance
    expect(clone).not.toBe(state)
    
    // Check that the data is the same
    expect(clone.getFeatures()).toEqual(state.getFeatures())
    expect(clone.getMarkerTypes()).toEqual(state.getMarkerTypes())
    
    // Verify it's a deep clone by modifying the original
    state.getFeatures()[0].id = 'modified'
    expect(clone.getFeatures()[0].id).toBe('feature1')
  })
  
  it('can convert to JSON', () => {
    const features = [
      { id: 'feature1', type: 'Feature', geometry: { type: 'Point' } }
    ]
    
    state.setFeatures(features)
    
    const json = state.toJSON()
    
    expect(json.type).toBe('FeatureCollection')
    expect(json.features).toEqual(features)
    expect(json.properties.waymark_config).toEqual(state.getConfig())
  })
  
  it('can create a State from GeoJSON', () => {
    const geoJSON = {
      type: 'FeatureCollection',
      features: [
        { id: 'feature1', type: 'Feature', geometry: { type: 'Point' } }
      ],
      properties: {
        waymark_config: new Waymark_Config()
      }
    }
    
    const stateFromGeoJSON = State.fromGeoJSON(geoJSON)
    
    expect(stateFromGeoJSON).toBeInstanceOf(State)
    expect(stateFromGeoJSON.getFeatures()).toEqual(geoJSON.features)
    expect(stateFromGeoJSON.getConfig()).toBeInstanceOf(Waymark_Config)
  })
  
  it('checks if it has features', () => {
    expect(state.hasFeatures()).toBe(false)
    
    state.addFeature({ type: 'Feature', geometry: { type: 'Point' } })
    
    expect(state.hasFeatures()).toBe(true)
  })
})
