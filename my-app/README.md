# Next.js Project File Extension Guidelines

This document outlines the recommended file extensions for different types of files in our Next.js project.

## `.tsx` Extension Usage

Use `.tsx` for files that contain React components or JSX syntax:

### Pages
- `page.tsx` (Main page)
- `layout.tsx` (Layout)
- `loading.tsx` (Loading UI)
- `error.tsx` (Error page)
- `not-found.tsx` (404 page)

### Components
- `Button.tsx`
- `Card.tsx`
- `Header.tsx`
- `Footer.tsx`
- `Modal.tsx`
- `Form.tsx`

### Special Pages
- `template.tsx`
- `default.tsx`

## `.ts` Extension Usage

Use `.ts` for files that contain pure TypeScript code without React components:

### API Related
- `route.ts` (API routes)
- `middleware.ts`

### Type Definitions
- `types.ts`
- `interfaces.ts`
- `enums.ts`

### Utility Functions
- `utils.ts`
- `helpers.ts`
- `constants.ts`

### Service Logic
- `api.ts`
- `service.ts`
- `repository.ts`

### Configuration
- `config.ts`
- `env.ts`

### Styling
- `styles.ts` (for styled-components or emotion)
- `theme.ts`

### Testing
- `test.ts`
- `mock.ts`

## Benefits of This Structure

1. Clear code organization
2. Better type checking
3. Improved code readability
4. Easier maintenance
5. Better developer experience

## Example

```typescript
// app/page.tsx - React component
export default function Page() {
  return <div>Hello World</div>
}

// app/api/route.ts - API handler
export async function GET() {
  return Response.json({ message: 'Hello' })
} 