# **Liberty Core**

## In progress
I'm currently migrate components used in Liberty Framework to be standalone component and npm installable. This work is in progress, any contributions is welcome
 - Documentation and preview of components are available at : [https://docs.nomana-it.fr/liberty-core/](https://docs.nomana-it.fr/liberty-core/)
 - More components will come very soon, they are already in the framework but overridable functions have to be implemented. 

## Announcements
I'm happy to announce that Advanced Grid is now part of Liberty Core components. Advanced Grid contains a lots of feature like 
Editable rows with validation
Dynamic context menus
Column visibility toggles
Filtering, sorting, searching, grouping
Batch selection and clipboard integration
Exporting, importing, and inline editing

If you are are looking for alternative to MUI Datagrid or AG-Grid, this component is free and will stay free for all features included. You can preview this component in the documentation https://docs.nomana-it.fr/liberty-core/. (Forms Component / Advanced Grid)

- **Release 1.0.10**: Issue with focus on input lookup when opening search dialog
- **Release 1.0.9**: Add Authorization for API call
- **Release 1.0.8**: include Advanced List and Upload Table

## Try It Online!
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/fblettner/liberty-test)

## **Overview**
**Liberty Core** is a reusable component library designed for React applications. It provides a collection of UI components, utilities, and styles to streamline development. This package includes pre-styled components, utility functions, and common types, making it an essential part of the Liberty Framework.
This is not just a component library but a package all functionalities to develop a web and responsive application

## **Features**
- 🎨 **Theme & Styling**: Centralized theme management.
- 🏗️ **Prebuilt UI Components**: Includes buttons, dialogs, typography, tables, alerts, and more.
- ⚙️ **Utility Functions**: Common helper functions for improved developer experience.
- 🛠️ **Type Definitions**: Predefined TypeScript types for consistent data handling.
- 🔌 **Easy Integration**: Works seamlessly with any React project.

This is not just a components library, this is also predefined integration that manage all states between component, implement API for CRUD operations, integrate Sentry for log management, integrate OIDC for authentication...

## **Installation**
To install **Liberty Core**, run the following command:

```sh
npm install @nomana-it/liberty-core
```

## **Usage**

### **1. Import Components**
You can import and use any component from **Liberty Core** directly in your React app:

```tsx
import { Button, Dialog, Alert } from "liberty-core";

const App = () => {
  return (
    <div>
      <Alert variant="success">This is a success alert!</Alert>
      <Button onClick={() => console.log("Clicked!")}>Click Me</Button>
      <Dialog title="Example Dialog">This is a sample dialog.</Dialog>
    </div>
  );
};

export default App;
```

### **2. Theming**
Liberty Core provides a customizable theme. Wrap your application in a `ThemeProvider` to apply the default or custom theme:

```tsx
import { ThemeProvider, theme } from "liberty-core";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <YourAppComponents />
    </ThemeProvider>
  );
};
```

### **3. Utility Functions**
Liberty Core includes common utility functions that can be used across your application:

```tsx
import { formatDate } from "liberty-core";

const date = formatDate(new Date());
console.log(date); // Output: Formatted date
```

## **Available Components**
Liberty Core exports various components categorized as **styles**, **common components**, and **utilities**.

### **🖌 Styles**
```ts
import {
  theme, icons, Button, Dialog, Div, IconButton, Main, Menus, Paper, Stack, Typography
} from "liberty-core";
```

### **📦 Common Components**
```ts
import {
  Alert, AlertMessage, Button, Card, Checkbox, CircularProgress, Collapse,
  ConfirmationDialog, Dialog, Divider, Flex, FlexAdvanced, Grid, IconButton,
  Input, List, LoadingIndicator, MarkDown, Menus, Popper, Select, Skeleton,
  SnackMessage, Tab, Table, Toggle, Tooltip, Tree, Typography, UseMediaQuery
} from "liberty-core";
```

### **⚙️ Utility Functions & Types**
```ts
import { commonUtils } from "liberty-core";
import { commonTypes } from "liberty-core";
```

## **License**
liberty-core is **open-source software** licensed under the **AGPL License**.  
```
Copyright (c) 2025 NOMANA-IT and/or its affiliates.
All rights reserved. Use is subject to license terms.
```

## 📧 Contact & Support  
If you have questions or need support:  
- **Email**: [franck.blettner@nomana-it.fr](mailto:franck.blettner@nomana-it.fr)  
- **GitHub Issues**: [Report an issue](https://github.com/fblettner/liberty-core/issues)  
- **Discussions**: Join the conversation in the **GitHub Discussions** section.  

---

### ⭐ If you find Liberty Core useful, consider giving it a star on GitHub!  
```bash
git clone https://github.com/fblettner/liberty-core.git
cd liberty-core
```

---

## 💖 Sponsorship  
If you find **Liberty Core** useful and would like to support its development, consider sponsoring us. Your contributions help maintain the project, add new features, and improve the documentation. Every contribution, big or small, is greatly appreciated!  

To sponsor, visit: **[GitHub Sponsors](https://github.com/sponsors/fblettner)** or reach out to us directly.  

---