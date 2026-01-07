# FormsDialogBuilder - Visual Dialog Builder

A Bubble-style drag-and-drop visual builder for creating and editing FormsDialog components. This no-code tool allows users to visually design complex dialogs that are stored in Postgres and rendered by your existing FormsDialog component.

## Features

✨ **Drag & Drop Interface** - Intuitive component palette with all available input types  
📋 **Component Palette** - Text inputs, numbers, dates, checkboxes, color pickers, dropdowns, lookups, tables, trees, grids, and actions  
⚙️ **Property Inspector** - Edit all field properties: labels, validation, visibility, layout, parameters, and conditions  
📑 **Multi-Tab Support** - Create dialogs with multiple tabs  
🔄 **Real-time Preview** - Preview your dialog using the actual FormsDialog renderer  
💾 **Postgres Integration** - Save/load directly to your existing database structure  
↕️ **Reorder Fields** - Drag fields to reorder them within tabs  
🎯 **Field Selection** - Click fields to edit their properties  

## Installation

### Dependencies Already Included

This builder uses your existing dependencies:
- ✅ `@react-spring/web` - Already in your project for animations
- ✅ `@use-gesture/react` - Already in your project for drag interactions
- ✅ `@emotion/styled` - Already in your project for styling
- ✅ `uuid` - Already in your project for ID generation

**No additional npm packages needed!** 🎉
### Add to Your Exports


Add to your main `index.ts`:

```typescript
export * from '@ly_forms/FormsDialogBuilder';
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { DialogBuilderWrapper } from '@ly_forms/FormsDialogBuilder';

function App() {
    return (
        <DialogBuilderWrapper
            dialogID={123} // Optional: load existing dialog
            onClose={() => console.log('Builder closed')}
        />
    );
}
```

### Advanced Usage

```tsx
import React, { useCallback } from 'react';
import { DialogBuilder } from '@ly_forms/FormsDialogBuilder';
import { IBuilderState } from '@ly_forms/FormsDialogBuilder';
import { saveDialogToDatabase } from '@ly_forms/FormsDialogBuilder';
import { useAppContext } from '@ly_context/AppProvider';

function CustomDialogBuilder() {
    const { appsProperties, modulesProperties } = useAppContext();

    const handleSave = useCallback(async (state: IBuilderState) => {
        const result = await saveDialogToDatabase({
            builderState: state,
            appsProperties,
            modulesProperties,
        });
        console.log('Saved dialog ID:', result.dialogID);
    }, [appsProperties, modulesProperties]);

    const handlePreview = useCallback((state: IBuilderState) => {
        console.log('Preview state:', state);
        // Show preview modal
    }, []);

    return (
        <DialogBuilder
            dialogID={undefined} // Create new dialog
            onSave={handleSave}
            onPreview={handlePreview}
        />
    );
}
```

## Database Structure

The builder expects the following Postgres tables (which you already have):

### Dialog Header Table
```sql
CREATE TABLE dialog_headers (
    FRM_ID SERIAL PRIMARY KEY,
    FRM_LABEL VARCHAR(255),
    QUERY_POOL VARCHAR(50),
    FRM_QUERY_ID INTEGER,
    LANGUAGE_ID VARCHAR(10)
);
```

### Dialog Details Table
```sql
CREATE TABLE dialog_details (
    FRM_ID INTEGER REFERENCES dialog_headers(FRM_ID),
    COL_ID VARCHAR(100),
    TAB_SEQ VARCHAR(10),
    COL_SEQ INTEGER,
    LANGUAGE_ID VARCHAR(10),
    COL_COMPONENT VARCHAR(50),
    COL_COMPONENT_ID INTEGER,
    COL_DD_ID VARCHAR(100),
    COL_LABEL VARCHAR(255),
    COL_TYPE VARCHAR(50),
    COL_RULES VARCHAR(100),
    COL_RULES_VALUES VARCHAR(255),
    COL_DEFAULT VARCHAR(255),
    COL_TARGET VARCHAR(100),
    COL_VISIBLE CHAR(1),
    COL_DISABLED CHAR(1),
    COL_REQUIRED CHAR(1),
    COL_KEY CHAR(1),
    COL_COLSPAN INTEGER,
    DYNAMIC_PARAMS TEXT,
    FIXED_PARAMS TEXT,
    POOL_PARAMS VARCHAR(100),
    OUTPUT_PARAMS TEXT,
    COL_CDN_ID INTEGER,
    CDN_DYNAMIC_PARAMS TEXT,
    CDN_FIXED_PARAMS TEXT
);
```

### Dialog Tabs Table
```sql
CREATE TABLE dialog_tabs (
    FRM_ID INTEGER REFERENCES dialog_headers(FRM_ID),
    TAB_ID VARCHAR(50),
    TAB_SEQ INTEGER,
    TAB_LABEL VARCHAR(255),
    TAB_COLS INTEGER,
    TAB_HIDDEN BOOLEAN
);
```

## Required API Queries

Add these query names to your `lyApi` configuration:

- `GET_DIALOG_HEADER` - Load dialog header by FRM_ID
- `GET_DIALOG_DETAILS` - Load dialog fields by FRM_ID
- `GET_DIALOG_TABS` - Load dialog tabs by FRM_ID
- `INSERT_DIALOG_HEADER` - Create new dialog header
- `UPDATE_DIALOG_HEADER` - Update existing dialog header
- `INSERT_DIALOG_DETAIL` - Insert dialog field
- `INSERT_DIALOG_TAB` - Insert dialog tab
- `DELETE_DIALOG_DETAILS` - Delete all fields for a dialog
- `DELETE_DIALOG_TABS` - Delete all tabs for a dialog

## Component Architecture

```
FormsDialogBuilder/
├── DialogBuilder.tsx              # Main builder component
├── DialogBuilderWrapper.tsx       # Example wrapper with preview
├── types/
│   └── builderTypes.ts           # TypeScript definitions
├── config/
│   └── paletteConfig.ts          # Available components configuration
├── components/
│   ├── ComponentPalette.tsx      # Left panel - draggable components
│   ├── BuilderCanvas.tsx         # Center - drop zone and fields
│   ├── PropertyPanel.tsx         # Right panel - property editor
│   ├── CanvasField.tsx           # Individual field component
│   └── PaletteItem.tsx          # Individual palette item
└── utils/
    └── builderApi.ts             # Postgres integration utilities
```

## Available Components

### Input Components
- **Text Input** - Standard text field
- **Number Input** - Numeric input with validation
- **Date Picker** - Date selection
- **Checkbox** - Boolean toggle
- **Color Picker** - Color selection widget
- **Dropdown (Enum)** - Dropdown from enum table
- **Lookup** - Autocomplete lookup field
- **Password** - Masked password input
- **Text Area** - Multi-line text input

### Data Components
- **Table** - Embedded data table (FormsTable)
- **Tree** - Hierarchical tree view (FormsTree)
- **List** - List view (FormsList)
- **Grid** - Grid view (FormsGrid)

### Actions
- **Action Button** - Trigger workflows/actions (InputAction)

## Field Properties

Each field can be configured with:

### Basic Properties
- **Field ID** - Unique identifier
- **Dictionary ID** - Link to data dictionary
- **Label** - Display label
- **Target Field** - Database column name

### Layout
- **Column Span** - Width (1-4 columns)
- **Sequence** - Order within tab

### Behavior
- **Visible** - Show/hide field
- **Disabled** - Enable/disable editing
- **Required** - Make field mandatory
- **Key Field** - Mark as primary key

### Validation
- **Rules** - Validation rule type
- **Rules Values** - Rule configuration (e.g., enum ID)
- **Default Value** - Initial value

### Parameters
- **Dynamic Params** - Runtime parameters
- **Fixed Params** - Static parameters
- **Pool Params** - Query pool override
- **Output Params** - Output field mapping

### Conditions
- **Condition ID** - Link to condition logic
- **Condition Params** - Condition parameters

## Workflow

1. **Create/Load Dialog**
   - Start with new dialog or load existing from database

2. **Design Interface**
   - Drag components from palette to canvas
   - Organize fields across multiple tabs
   - Reorder fields by dragging

3. **Configure Properties**
   - Click field to select
   - Edit properties in right panel
   - Set validation, visibility, parameters

4. **Preview**
   - Click Preview to see rendered dialog
   - Uses actual FormsDialog component

5. **Save**
   - Click Save to persist to Postgres
   - All tabs, fields, and properties saved

6. **Use in App**
   - Load dialog using existing FormsDialog
   - No code changes needed!

## Integration with Existing Code

The builder generates the exact same data structure your FormsDialog already uses:

```typescript
// Builder creates this:
const builderState = {
    dialogID: 123,
    dialogLabel: 'Customer Form',
    tabs: [...],
    // ...
};

// Which converts to:
const { header, details, tabs } = builderStateToDialogDetails(builderState);

// Which your FormsDialog already renders!
<FormsDialog componentProperties={...} />
```

No changes needed to FormsDialog - it just works! 🎉

## Benefits

- **No-Code Creation** - Business users can create forms
- **Faster Development** - Visual design vs. manual coding
- **Consistent Structure** - All dialogs follow same patterns
- **Version Control** - Store designs in database
- **Easy Maintenance** - Update forms without code changes
- **Reusability** - Copy/modify existing dialogs

## Future Enhancements

- [ ] Template library for common dialog patterns
- [ ] Undo/redo functionality
- [ ] Copy/paste fields between tabs
- [ ] Field validation preview
- [ ] Export/import dialog definitions (JSON)
- [ ] Keyboard shortcuts
- [ ] Field grouping/sections
- [ ] Conditional visibility rules editor
- [ ] Formula builder for calculated fields

## Troubleshooting

### Builder doesn't load
- Check that `react-dnd` and `uuid` are installed
- Verify AppContext provides required properties

### Save fails
- Verify database queries are configured in lyApi
- Check Postgres table structure matches expected schema
- Review browser console for API errors

### Preview doesn't work
- Ensure FormsDialog is properly imported
- Check that dialogDetailsRef structure is correct
- Verify component properties are valid

## Support

For issues or questions:
1. Check this README
2. Review the example code in `DialogBuilderWrapper.tsx`
3. Inspect the types in `builderTypes.ts`
4. Contact your development team

---

**Built for Liberty Core Framework** - A powerful no-code solution for enterprise applications.
