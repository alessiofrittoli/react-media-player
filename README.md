<h1 align="center">React Node Module Starter ✇</h1>
<p align="center">
  Starter repository for developing React node_modules
</p>
<p align="center">
  <a href="https://npmjs.org/package/@alessiofrittoli/react-node-module-starter">
    <img src="https://img.shields.io/npm/v/@alessiofrittoli/react-node-module-starter" alt="Latest version"/>
  </a>
  <a href="https://coveralls.io/github/alessiofrittoli/react-node-module-starter">
    <img src="https://coveralls.io/repos/github/alessiofrittoli/react-node-module-starter/badge.svg" alt="Test coverage"/>
  </a>
  <a href="https://socket.dev/npm/package/@alessiofrittoli/react-node-module-starter/overview">
    <img src="https://socket.dev/api/badge/npm/package/@alessiofrittoli/react-node-module-starter" alt="Socket Security score"/>
  </a>
  <a href="https://npmjs.org/package/@alessiofrittoli/react-node-module-starter">
    <img src="https://img.shields.io/npm/dm/@alessiofrittoli/react-node-module-starter.svg" alt="npm downloads"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/react-node-module-starter">
    <img src="https://badgen.net/bundlephobia/dependency-count/@alessiofrittoli/react-node-module-starter" alt="Dependencies"/>
  </a>
  <a href="https://libraries.io/npm/%40alessiofrittoli%2Freact-node-module-starter">
    <img src="https://img.shields.io/librariesio/release/npm/@alessiofrittoli/react-node-module-starter" alt="Dependencies status"/>
  </a>
</p>
<p align="center">
  <a href="https://bundlephobia.com/package/@alessiofrittoli/react-node-module-starter">
    <img src="https://badgen.net/bundlephobia/min/@alessiofrittoli/react-node-module-starter" alt="minified"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/react-node-module-starter">
    <img src="https://badgen.net/bundlephobia/minzip/@alessiofrittoli/react-node-module-starter" alt="minizipped"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/react-node-module-starter">
    <img src="https://badgen.net/bundlephobia/tree-shaking/@alessiofrittoli/react-node-module-starter" alt="Tree shakable"/>
  </a>
</p>
<p align="center">
  <a href="https://github.com/sponsors/alessiofrittoli">
    <img src="https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2" alt="Fund this package"/>
  </a>
  <a href="https://github.com/sponsors/alessiofrittoli">
    <img src="https://img.shields.io/github/sponsors/alessiofrittoli?label=Sponsor&logo=GitHub" alt="Currently sponsoring this project"/>
  </a>
</p>

[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

### Table of Contents

- [Getting started](#getting-started)
- [Development](#development)
  - [Install depenendencies](#install-depenendencies)
  - [Build the source code](#build-the-source-code)
  - [ESLint](#eslint)
  - [Jest](#jest)
- [Contributing](#contributing)
- [Security](#security)
- [Credits](#made-with-)

---

### Getting started (delete once cloned in your project)

Run the following command to start using `react-node-module-starter` for your projects:

```bash
git clone git@github.com:alessiofrittoli/react-node-module-starter.git && git remote remove origin
```

install dependencies

```bash
pnpm i
```

Read the [Creating a repository from a template - GitHub Docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) for more in-detail informations about creating a new Repository from a template using GitHub web interface.

#### Pre-configured exports

##### React Components

- in order to quickly export React Components from this library with no configuration you need to follow this structure

```css
library
├── src
│   ├── components
│   │   ├── MyComponent
│   │   │   ├── MySubComponent
│   │   │   │   └── index.tsx
│   │   │   └── index.tsx
│   │   │
│   │   └── MyOtherComponent
│   │       └── index.tsx
│   │
```

- then import them like so:

```ts
import { MyComponent } from "library/components/MyComponent";
import { MySubComponent } from "library/components/MyComponent/MySubComponent";
import { MyOtherComponent } from "library/components/MyOtherComponent";
```

> [!WARNING]
> Please note that there is no limit about nested folders.

---

##### React Hooks

- in order to quickly export React Components from this library with no configuration you need to follow this structure

```css
library
├── src
│   ├── components
│   │   └── ...
│   │
│   ├── hooks
│   │   ├── nested-folder
│   │   │   ├── useSomeGroupedHook.ts
│   │   │   └── useAnotherGroupedHook.ts
│   │   │
│   │   ├── useSomeHook.ts
│   │   └── useSomeOtherHook.ts
│   │
```

- then import them like so

```ts
import { useSomeHook } from "library/hooks/useSomeHook";
import { useSomeOtherHook } from "library/hooks/useSomeOtherHook";
import { useSomeGroupedHook } from "library/hooks/nested-folder/useSomeOtherHook";
import { useAnotherGroupedHook } from "library/hooks/nested-folder/useAnotherGroupedHook";
```

> [!WARNING]
> Please note that there is no limit about nested folders.

---

##### React Context API

The `store` folder has no quick configured export configuration but we suggest to follow the documented workflow below in order to achieve the quickiest configuration.

- create your Context API following this folder structure

```css
library
├── src
│   ├── components
│   │   └── ...
│   │
│   ├── hooks
│   │   └── ...
│   │
│   ├── store
│   │   ├── MyStore
│   │   │   ├── MyStoreContext.ts
│   │   │   ├── MyStoreProvider.tsx
│   │   │   └── useMyStore.ts
│   │   │
│   │   └── AnotherStore
│   │       ├── AnotherStoreContext.ts
│   │       ├── AnotherStoreProvider.tsx
│   │       └── useAnotherStore.ts
│   │
```

- update the `exports` in the `package.json` like so (this need to be updated whenever a new store is added)

```json
{
  ...
  "exports": {
    ...
    "./store/MyStore/*": {
      "types": "./dist/store/MyStore/*.d.mts",
      "default": "./dist/store/MyStore/*.mjs"
    },
    "./store/AnotherStore/*": {
      "types": "./dist/store/AnotherStore/*.d.mts",
      "default": "./dist/store/AnotherStore/*.mjs"
    }
  }
  ...
}
```

- then import them like so

```ts
import { myStoreContext } from "library/store/MyStore/MyStoreContext";
import { MyStoreProvider } from "library/store/MyStore/MyStoreProvider";
import { useMyStore } from "library/store/MyStore/useMyStore";

import { anotherStoreContext } from "library/store/AnotherStore/AnotherStoreContext";
import { AnotherStoreProvider } from "library/store/AnotherStore/AnotherStoreProvider";
import { useAnotherStore } from "library/store/AnotherStore/useAnotherStore";
```

---

### Getting started (customize based on your project needs)

Run the following command to start using `{package_name}` in your projects:

```bash
npm i {package_name}
```

or using `pnpm`

```bash
pnpm i {package_name}
```

---

### Development

#### Install depenendencies

```bash
npm install
```

or using `pnpm`

```bash
pnpm i
```

#### Build the source code

Run the following command to test and build code for distribution.

```bash
pnpm build
```

#### [ESLint](https://www.npmjs.com/package/eslint)

warnings / errors check.

```bash
pnpm lint
```

#### [Jest](https://npmjs.com/package/jest)

Run all the defined test suites by running the following:

```bash
# Run tests and watch file changes.
pnpm test:watch

# Run tests in a CI environment.
pnpm test:ci
```

- See [`package.json`](./package.json) file scripts for more info.

Run tests with coverage.

An HTTP server is then started to serve coverage files from `./coverage` folder.

⚠️ You may see a blank page the first time you run this command. Simply refresh the browser to see the updates.

```bash
test:coverage:serve
```

---

### Contributing

Contributions are truly welcome!

Please refer to the [Contributing Doc](./CONTRIBUTING.md) for more information on how to start contributing to this project.

Help keep this project up to date with [GitHub Sponsor][sponsor-url].

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

---

### Security

If you believe you have found a security vulnerability, we encourage you to **_responsibly disclose this and NOT open a public issue_**. We will investigate all legitimate reports. Email `security@alessiofrittoli.it` to disclose any security vulnerabilities.

### Made with ☕

<table style='display:flex;gap:20px;'>
  <tbody>
    <tr>
      <td>
        <img alt="avatar" src='https://avatars.githubusercontent.com/u/35973186' style='width:60px;border-radius:50%;object-fit:contain;'>
      </td>
      <td>
        <table style='display:flex;gap:2px;flex-direction:column;'>
          <tbody>
              <tr>
                <td>
                  <a href='https://github.com/alessiofrittoli' target='_blank' rel='noopener'>Alessio Frittoli</a>
                </td>
              </tr>
              <tr>
                <td>
                  <small>
                    <a href='https://alessiofrittoli.it' target='_blank' rel='noopener'>https://alessiofrittoli.it</a> |
                    <a href='mailto:info@alessiofrittoli.it' target='_blank' rel='noopener'>info@alessiofrittoli.it</a>
                  </small>
                </td>
              </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
