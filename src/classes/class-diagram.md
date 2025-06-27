# Class Diagram: State and Waymark_Config

```mermaid
classDiagram
    class State {
        -String type
        -Array~Object~ features
        -Object properties
        
        +constructor(data: Object)
        +getFeatures() Array~Object~
        +setFeatures(features: Array) void
        +getFeatureById(id: String) Object
        +updateFeature(id: String, updatedFeature: Object) Boolean
        +updateFeatureProperties(id: String, properties: Object) Boolean
        +addFeature(feature: Object) State
        +removeFeature(id: String) Boolean
        +getConfig() Waymark_Config
        +setConfig(config: Waymark_Config) void
        +getConfigOption(key: String) Any
        +setConfigOption(key: String, value: Any) State
        +getMarkerTypes() Array
        +getLineTypes() Array
        +getShapeTypes() Array
        +setMarkerTypes(markerTypes: Array) State
        +setLineTypes(lineTypes: Array) State
        +setShapeTypes(shapeTypes: Array) State
        +addMarkerType() State
        +addLineType() State
        +addShapeType() State
        +deleteMarkerType(index: Number) State
        +deleteLineType(index: Number) State
        +deleteShapeType(index: Number) State
        +toJSON() Object
        +clone() State
        +hasFeatures() Boolean
        +fromGeoJSON(geoJSON: Object)$ State
    }
    
    class Waymark_Config {
        -Object map_options
        
        +constructor(config: Object)
        +updateConfig(config: Object) void
        +getMapOption(key: String) Any
        +getMapOptionKeys() Array~String~
        +setMapOption(key: String, value: Any) void
        +clone() Waymark_Config
        +toString() String
    }
    
    State "1" *-- "1" Waymark_Config : contains
    
    note for State "Represents the complete application state\nincluding GeoJSON FeatureCollection\nand Waymark_Config instance.\nActs as single source of truth."
    
    note for Waymark_Config "Defines configuration options\nfor Waymark JS maps.\nManages marker types, line types,\nand tile layers."
```

## Class Relationships

- **State** has a **composition** relationship with **Waymark_Config**
  - The State class contains a Waymark_Config instance in its properties
  - The lifecycle of Waymark_Config is managed by State
  - State provides methods to access and modify the configuration

## Key Features

### State Class
- **Data Management**: Manages GeoJSON features and application configuration
- **Reactivity Support**: Methods create new array/object references for Vue reactivity
- **Feature Operations**: CRUD operations for map features
- **Configuration Access**: Proxy methods to access Waymark_Config options
- **Serialization**: JSON conversion and cloning capabilities
- **Factory Method**: Static method to create State from GeoJSON

### Waymark_Config Class
- **Configuration Management**: Stores map options including marker types, line types, and tile layers
- **Default Values**: Provides sensible defaults for map configuration
- **Deep Cloning**: Ensures configuration independence through deep copying
- **Flexible Access**: Get/set methods for configuration options
