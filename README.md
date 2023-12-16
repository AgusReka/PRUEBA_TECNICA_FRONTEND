# PRUEBA TECNICA MEDILINE

Esta es una prueba tecnica hecha con typesscript, react, node.js usando diferentes frameworks y librerias.

Para correr el proyecto se deberea poner el comando:

- `npm i` Para instalar las dependencias
- `npm run dev` Para correr vite

[Github Backend en SpringBoot](https://github.com/AgusReka/PRUEBA_TECNICA_BACKEND_SPRING)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
