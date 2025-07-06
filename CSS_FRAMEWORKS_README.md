# CSS Frameworks Setup Guide

This project now supports multiple CSS frameworks to give you flexibility in choosing the right styling approach for your bus booking application.

## 🎨 Available Frameworks

### 1. **Tailwind CSS** (Recommended)
- **Type**: Utility-first CSS framework
- **Bundle Size**: Small
- **Learning Curve**: Medium
- **Best For**: Custom designs, rapid prototyping
- **Example**: `/examples/tailwind-example`

**Features:**
- Utility classes for rapid development
- Highly customizable
- Responsive design utilities
- Small bundle size
- Modern design system

### 2. **Chakra UI**
- **Type**: Component library
- **Bundle Size**: Medium
- **Learning Curve**: Low
- **Best For**: Accessible applications, modern interfaces
- **Example**: `/examples/chakra-example`

**Features:**
- Accessible by default
- Themeable components
- Composable design system
- TypeScript support
- Built-in dark mode

### 3. **Material-UI (MUI)**
- **Type**: Material Design implementation
- **Bundle Size**: Large
- **Learning Curve**: Medium
- **Best For**: Material Design, enterprise applications
- **Example**: `/examples/mui-example`

**Features:**
- Google's Material Design
- Rich component library
- Advanced theming system
- Enterprise-ready
- Extensive documentation

### 4. **Ant Design**
- **Type**: Enterprise UI library
- **Bundle Size**: Large
- **Learning Curve**: Low
- **Best For**: Enterprise applications, admin dashboards
- **Example**: `/examples/antd-example`

**Features:**
- Enterprise-level components
- Form validation
- Data visualization
- Rich component ecosystem
- Business-focused design

## 🚀 Quick Start

### View Examples
Visit `/examples` to see all frameworks in action with the same bus booking interface.

### Choose Your Framework

1. **For Custom Designs**: Use **Tailwind CSS**
   ```tsx
   import { Button } from '@/components/ui/Button';
   import { Card } from '@/components/ui/Card';
   ```

2. **For Accessibility**: Use **Chakra UI**
   ```tsx
   import { Button, Card } from '@chakra-ui/react';
   ```

3. **For Material Design**: Use **Material-UI**
   ```tsx
   import { Button, Card } from '@mui/material';
   ```

4. **For Enterprise Apps**: Use **Ant Design**
   ```tsx
   import { Button, Card } from 'antd';
   ```

## 📁 Project Structure

```
app/
├── components/
│   ├── ui/                    # Tailwind CSS components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── ExamplesNav.tsx        # Framework navigation
├── examples/                  # Framework examples
│   ├── page.tsx              # Main examples page
│   ├── tailwind-example/
│   ├── chakra-example/
│   ├── mui-example/
│   └── antd-example/
├── providers/                 # Framework providers
│   ├── ChakraProvider.tsx
│   ├── MUIProvider.tsx
│   └── AntdProvider.tsx
├── lib/
│   └── utils.ts              # Utility functions
├── globals.css               # Global styles + Tailwind
└── layout.tsx                # Root layout
```

## 🛠️ Configuration Files

### Tailwind CSS
- `tailwind.config.js` - Tailwind configuration
- `app/globals.css` - Global styles with CSS variables
- `app/lib/utils.ts` - Utility functions

### Framework Providers
- `app/providers/ChakraProvider.tsx` - Chakra UI theme
- `app/providers/MUIProvider.tsx` - Material-UI theme
- `app/providers/AntdProvider.tsx` - Ant Design theme

## 🎯 Usage Examples

### Tailwind CSS Components
```tsx
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Chakra UI Components
```tsx
import { Button, Card, CardBody, CardHeader, Heading } from '@chakra-ui/react';

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">My Card</Heading>
      </CardHeader>
      <CardBody>
        <Button colorScheme="brand">Click me</Button>
      </CardBody>
    </Card>
  );
}
```

### Material-UI Components
```tsx
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';

export default function MyComponent() {
  return (
    <Card>
      <CardHeader title="My Card" />
      <CardContent>
        <Button variant="contained">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Ant Design Components
```tsx
import { Button, Card } from 'antd';

export default function MyComponent() {
  return (
    <Card title="My Card">
      <Button type="primary">Click me</Button>
    </Card>
  );
}
```

## 🎨 Theming

### Tailwind CSS
Uses CSS variables for theming. Colors are defined in `app/globals.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... more variables */
}
```

### Chakra UI
Theme is configured in `app/providers/ChakraProvider.tsx`:
```tsx
const theme = extendTheme({
  colors: {
    brand: {
      500: '#0ea5e9',
      // ... more colors
    }
  }
});
```

### Material-UI
Theme is configured in `app/providers/MUIProvider.tsx`:
```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#0ea5e9',
    }
  }
});
```

### Ant Design
Theme is configured in `app/providers/AntdProvider.tsx`:
```tsx
const theme = {
  token: {
    colorPrimary: '#0ea5e9',
  }
};
```

## 📱 Responsive Design

All frameworks support responsive design:

### Tailwind CSS
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Chakra UI
```tsx
<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}>
```

### Material-UI
```tsx
<Grid container spacing={2}>
  <Grid item xs={12} md={6} lg={4}>
```

### Ant Design
```tsx
<Row gutter={[16, 16]}>
  <Col xs={24} md={12} lg={8}>
```

## 🔧 Customization

### Adding New Components
1. Create components in `app/components/ui/` for Tailwind
2. Use framework-specific patterns for other frameworks
3. Follow the existing naming conventions

### Modifying Themes
1. Update the respective provider files
2. For Tailwind, modify `tailwind.config.js` and `globals.css`
3. Restart the development server

## 🚀 Performance Tips

1. **Bundle Size**: Tailwind CSS has the smallest bundle size
2. **Tree Shaking**: All frameworks support tree shaking
3. **Code Splitting**: Use dynamic imports for framework-specific components
4. **Caching**: Configure proper caching for CSS files

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Chakra UI Documentation](https://chakra-ui.com/docs)
- [Material-UI Documentation](https://mui.com/material-ui/)
- [Ant Design Documentation](https://ant.design/docs/react/introduce)

## 🤝 Contributing

When adding new components or modifying existing ones:
1. Follow the established patterns
2. Ensure accessibility standards
3. Test across different screen sizes
4. Update this documentation

---

**Happy coding! 🎉** 