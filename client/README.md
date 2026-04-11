# Sin Fronteras - Client

## Deploy en subcarpeta (Hostinger u otro hosting)

Si la app no está en la raíz del dominio sino en una subcarpeta (ej: `/demos/sinfronteras`), hay que configurar dos archivos:

### 1. `vite.config.js`
```js
export default defineConfig({
  plugins: [react()],
  base: '/demos/sinfronteras/', // <-- ruta de la subcarpeta
})
```

### 2. `src/App.jsx`
```jsx
<BrowserRouter basename="/demos/sinfronteras"> // <-- misma ruta, sin la barra final
```

Ambos valores tienen que coincidir con la carpeta real donde se sube el contenido de `dist/`.

Después correr:
```bash
npm run build
```
Y subir el contenido de `dist/` a `public_html/demos/sinfronteras/`.
