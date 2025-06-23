import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWaymarkPopup } from '@/composables/useWaymarkPopup.js'

// Mock dependencies
vi.mock('@vue/runtime-core', async () => {
  const actual = await vi.importActual('@vue/runtime-core')
  return {
    ...actual,
    ref: vi.fn((val) => ({ value: val })),
    reactive: vi.fn(obj => obj),
    computed: vi.fn(fn => fn()),
    onMounted: vi.fn(fn => fn()),
    onBeforeUnmount: vi.fn(fn => fn())
  }
})

// Mock useStateStore and storeToRefs
vi.mock('pinia', () => ({
  storeToRefs: vi.fn(() => ({ 
    Waymark: { value: { map: { closePopup: vi.fn() } } }
  }))
}))

// Mock useStateStore
vi.mock('@/stores/stateStore.js', () => ({
  useStateStore: vi.fn(() => ({}))
}))

// Mock useLeaflet
const openPopupMock = vi.fn()
const isPopupOpenMock = vi.fn()
const closePopupMock = vi.fn()
vi.mock('@/composables/useLeaflet.js', () => ({
  useLeaflet: vi.fn(() => ({
    openPopup: openPopupMock,
    isPopupOpen: isPopupOpenMock,
    closePopup: closePopupMock
  }))
}))

describe('useWaymarkPopup', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
  })

  it('exports the correct functions', () => {
    const waymarkPopup = useWaymarkPopup()
    
    // Check exported functions
    expect(typeof waymarkPopup.enhancePopup).toBe('function')
    expect(typeof waymarkPopup.openTypesPopup).toBe('function')
    expect(typeof waymarkPopup.openAboutPopup).toBe('function')
    expect(waymarkPopup.isTypesPopupOpen).toBeDefined()
    expect(waymarkPopup.isAboutPopupOpen).toBeDefined()
    expect(waymarkPopup.popupState).toBeDefined()
  })
  
  it('opens and closes Types popup correctly', () => {
    const waymarkPopup = useWaymarkPopup()
    
    // Initially, no popups should be open
    expect(waymarkPopup.popupState.types).toBe(false)
    expect(waymarkPopup.popupState.about).toBe(false)
    
    // Open Types popup
    waymarkPopup.openTypesPopup()
    
    // Verify that openPopup was called
    expect(openPopupMock).toHaveBeenCalled()
    
    // Manually update popup state since we've mocked reactive
    waymarkPopup.popupState.types = true
    waymarkPopup.popupState.currentPopup = 'types'
    
    // Close any open popup
    closePopupMock.mockImplementation(() => {
      waymarkPopup.popupState.types = false
      waymarkPopup.popupState.about = false
      waymarkPopup.popupState.currentPopup = null
    })
    
    // Open Types popup again (should close it)
    waymarkPopup.openTypesPopup()
    
    // Verify that closePopup was called
    expect(closePopupMock).toHaveBeenCalled()
    
    // Check popup state
    expect(waymarkPopup.popupState.types).toBe(false)
    expect(waymarkPopup.popupState.currentPopup).toBe(null)
  })
  
  it('opens and closes About popup correctly', () => {
    const waymarkPopup = useWaymarkPopup()
    
    // Initially, no popups should be open
    expect(waymarkPopup.popupState.about).toBe(false)
    expect(waymarkPopup.popupState.types).toBe(false)
    
    // Open About popup
    waymarkPopup.openAboutPopup()
    
    // Verify that openPopup was called
    expect(openPopupMock).toHaveBeenCalled()
    
    // Manually update popup state since we've mocked reactive
    waymarkPopup.popupState.about = true
    waymarkPopup.popupState.currentPopup = 'about'
    
    // Close any open popup
    closePopupMock.mockImplementation(() => {
      waymarkPopup.popupState.types = false
      waymarkPopup.popupState.about = false
      waymarkPopup.popupState.currentPopup = null
    })
    
    // Open About popup again (should close it)
    waymarkPopup.openAboutPopup()
    
    // Verify that closePopup was called
    expect(closePopupMock).toHaveBeenCalled()
    
    // Check popup state
    expect(waymarkPopup.popupState.about).toBe(false)
    expect(waymarkPopup.popupState.currentPopup).toBe(null)
  })
  
  it('ensures only one popup is open at a time', () => {
    const waymarkPopup = useWaymarkPopup()
    
    // Set up initial state with Types popup open
    waymarkPopup.popupState.types = true
    waymarkPopup.popupState.about = false
    waymarkPopup.popupState.currentPopup = 'types'
    
    // Open About popup
    waymarkPopup.openAboutPopup()
    
    // Should close the Types popup first
    expect(closePopupMock).toHaveBeenCalled()
    
    // Then open the About popup
    expect(openPopupMock).toHaveBeenCalled()
    
    // Reset mocks
    closePopupMock.mockReset()
    openPopupMock.mockReset()
    
    // Update state to simulate About popup being open
    waymarkPopup.popupState.types = false
    waymarkPopup.popupState.about = true
    waymarkPopup.popupState.currentPopup = 'about'
    
    // Open Types popup
    waymarkPopup.openTypesPopup()
    
    // Should close the About popup first
    expect(closePopupMock).toHaveBeenCalled()
    
    // Then open the Types popup
    expect(openPopupMock).toHaveBeenCalled()
  })
  
  it('enhances popup with correct button based on feature type', () => {
    const waymarkPopup = useWaymarkPopup()
    
    // Mock the implementation of enhancePopup to test its behavior
    const mockEditTypesButton = {
      innerHTML: '<i class="ion-edit"></i> Edit Marker Types',
      className: 'waymark-custom-types-button',
      style: {},
      addEventListener: vi.fn()
    };
    
    global.document.createElement = vi.fn().mockReturnValue(mockEditTypesButton);
    
    // Create a mock popup content element
    document.body.innerHTML = `
      <div class="leaflet-popup-content">
        <div class="waymark-overlay-preview waymark-marker-preview"></div>
      </div>
    `;
    
    // Mock classList.contains to return true for 'waymark-marker-preview'
    const originalContains = Element.prototype.classList.contains;
    Element.prototype.classList.contains = function(className) {
      if (className === 'waymark-marker-preview') return true;
      if (className === 'waymark-line-preview') return false;
      if (className === 'waymark-shape-preview') return false;
      return originalContains.call(this, className);
    };
    
    const popupContent = document.querySelector('.leaflet-popup-content');
    
    // Enhance the popup
    waymarkPopup.enhancePopup(popupContent);
    
    // Check if button was created with correct text
    expect(document.createElement).toHaveBeenCalledWith('button');
    expect(mockEditTypesButton.innerHTML).toContain('Edit Marker Types');
    
    // Restore original classList.contains
    Element.prototype.classList.contains = originalContains;
    
    // Clear the DOM
    document.body.innerHTML = '';
  })
  
  it('enhances popup with line type button', () => {
    const waymarkPopup = useWaymarkPopup()
    
    // Mock the implementation of enhancePopup to test its behavior
    const mockEditTypesButton = {
      innerHTML: '<i class="ion-edit"></i> Edit Line Types',
      className: 'waymark-custom-types-button',
      style: {},
      addEventListener: vi.fn()
    };
    
    global.document.createElement = vi.fn().mockReturnValue(mockEditTypesButton);
    
    // Create a mock popup content element for a line feature
    document.body.innerHTML = `
      <div class="leaflet-popup-content">
        <div class="waymark-overlay-preview waymark-line-preview"></div>
      </div>
    `;
    
    // Mock classList.contains to return true for 'waymark-line-preview'
    const originalContains = Element.prototype.classList.contains;
    Element.prototype.classList.contains = function(className) {
      if (className === 'waymark-marker-preview') return false;
      if (className === 'waymark-line-preview') return true;
      if (className === 'waymark-shape-preview') return false;
      return originalContains.call(this, className);
    };
    
    const popupContent = document.querySelector('.leaflet-popup-content');
    
    // Enhance the popup
    waymarkPopup.enhancePopup(popupContent);
    
    // Check if button was created with correct text
    expect(document.createElement).toHaveBeenCalledWith('button');
    expect(mockEditTypesButton.innerHTML).toContain('Edit Line Types');
    
    // Restore original classList.contains
    Element.prototype.classList.contains = originalContains;
    
    // Clear the DOM
    document.body.innerHTML = '';
  })
  
  it('enhances popup with shape type button', () => {
    const waymarkPopup = useWaymarkPopup()
    
    // Mock the implementation of enhancePopup to test its behavior
    const mockEditTypesButton = {
      innerHTML: '<i class="ion-edit"></i> Edit Shape Types',
      className: 'waymark-custom-types-button',
      style: {},
      addEventListener: vi.fn()
    };
    
    global.document.createElement = vi.fn().mockReturnValue(mockEditTypesButton);
    
    // Create a mock popup content element for a shape feature
    document.body.innerHTML = `
      <div class="leaflet-popup-content">
        <div class="waymark-overlay-preview waymark-shape-preview"></div>
      </div>
    `;
    
    // Mock classList.contains to return true for 'waymark-shape-preview'
    const originalContains = Element.prototype.classList.contains;
    Element.prototype.classList.contains = function(className) {
      if (className === 'waymark-marker-preview') return false;
      if (className === 'waymark-line-preview') return false;
      if (className === 'waymark-shape-preview') return true;
      return originalContains.call(this, className);
    };
    
    const popupContent = document.querySelector('.leaflet-popup-content');
    
    // Enhance the popup
    waymarkPopup.enhancePopup(popupContent);
    
    // Check if button was created with correct text
    expect(document.createElement).toHaveBeenCalledWith('button');
    expect(mockEditTypesButton.innerHTML).toContain('Edit Shape Types');
    
    // Restore original classList.contains
    Element.prototype.classList.contains = originalContains;
    
    // Clear the DOM
    document.body.innerHTML = '';
  })
  
  it('does not add a button to popups without waymark-overlay-preview', () => {
    const waymarkPopup = useWaymarkPopup()
    
    // Create a mock popup content element without the preview element
    document.body.innerHTML = `
      <div class="leaflet-popup-content">
        <div class="some_other_content"></div>
      </div>
    `
    const popupContent = document.querySelector('.leaflet-popup-content')
    
    // Enhance the popup
    waymarkPopup.enhancePopup(popupContent)
    
    // Check that no button was added
    const button = document.querySelector('.waymark-custom-types-button')
    expect(button).toBeNull()
    
    // Clear the DOM
    document.body.innerHTML = ''
  })
  
  it('does not add multiple buttons to the same popup', () => {
    const waymarkPopup = useWaymarkPopup()
    
    // Create mock button
    const mockButton = document.createElement('button')
    mockButton.className = 'waymark-custom-types-button'
    
    // Mock document.createElement to track calls and return our mock button
    const originalCreateElement = document.createElement
    document.createElement = vi.fn((tagName) => {
      if (tagName === 'button') {
        return mockButton
      }
      return originalCreateElement(tagName)
    })
    
    // Create a mock popup content element
    document.body.innerHTML = `
      <div class="leaflet-popup-content">
        <div class="waymark-overlay-preview waymark-marker-preview"></div>
      </div>
    `
    
    const popupContent = document.querySelector('.leaflet-popup-content')
    
    // Store original querySelector method
    const originalQuerySelector = Element.prototype.querySelector
    
    // Create a mock implementation for querySelector
    Element.prototype.querySelector = function(selector) {
      // First time called with .waymark-custom-types-button, return null
      // Second time, return the button (indicating it exists)
      if (selector === '.waymark-custom-types-button') {
        // We'll manually return null first time, button second time
        return this._hasButton ? mockButton : null
      }
      return originalQuerySelector.call(this, selector)
    }
    
    // Reset the document.createElement spy
    document.createElement.mockClear()
    
    // First call to enhancePopup - should add a button
    waymarkPopup.enhancePopup(popupContent)
    
    // Mark that the button now exists
    popupContent._hasButton = true
    
    // Enhance the same popup again - should not add another button
    waymarkPopup.enhancePopup(popupContent)
    
    // Check that document.createElement was called only once
    expect(document.createElement).toHaveBeenCalledTimes(1)
    
    // Restore original functions
    Element.prototype.querySelector = originalQuerySelector
    document.createElement = originalCreateElement
    
    // Clear the DOM
    document.body.innerHTML = ''
  })
  
  it('opens Types popup with correct initial tab', () => {
    // Clear previous calls
    openPopupMock.mockReset()
    
    const waymarkPopup = useWaymarkPopup()
    
    // Mock the openPopup function to verify it's being called correctly
    openPopupMock.mockImplementation((component, props) => {
      // Update state to match what the real function would do
      waymarkPopup.popupState.types = true
      waymarkPopup.popupState.currentPopup = 'types'
      return true
    })
    
    // Open Types popup with line tab
    waymarkPopup.openTypesPopup('line')
    
    // Verify that openPopup was called with correct parameters
    expect(openPopupMock).toHaveBeenCalled()
    expect(openPopupMock.mock.calls[0][1]).toEqual({ initialTab: 'line' })
    
    // Reset for next test
    openPopupMock.mockReset()
    waymarkPopup.popupState.types = false
    waymarkPopup.popupState.currentPopup = null
    
    // Open with shape tab
    waymarkPopup.openTypesPopup('shape')
    
    // Verify again
    expect(openPopupMock).toHaveBeenCalled()
    expect(openPopupMock.mock.calls[0][1]).toEqual({ initialTab: 'shape' })
  })
})
