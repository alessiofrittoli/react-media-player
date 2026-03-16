<h1 align="center">React Media Player 🎥</h1>
<p align="center">
  Handle media players with ease
</p>
<p align="center">
  <a href="https://npmjs.org/package/@alessiofrittoli/react-media-player">
    <img src="https://img.shields.io/npm/v/@alessiofrittoli/react-media-player" alt="Latest version"/>
  </a>
  <a href="https://coveralls.io/github/alessiofrittoli/react-media-player">
    <img src="https://coveralls.io/repos/github/alessiofrittoli/react-media-player/badge.svg" alt="Test coverage"/>
  </a>
  <a href="https://socket.dev/npm/package/@alessiofrittoli/react-media-player/overview">
    <img src="https://socket.dev/api/badge/npm/package/@alessiofrittoli/react-media-player" alt="Socket Security score"/>
  </a>
  <a href="https://npmjs.org/package/@alessiofrittoli/react-media-player">
    <img src="https://img.shields.io/npm/dm/@alessiofrittoli/react-media-player.svg" alt="npm downloads"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/react-media-player">
    <img src="https://badgen.net/bundlephobia/dependency-count/@alessiofrittoli/react-media-player" alt="Dependencies"/>
  </a>
  <a href="https://libraries.io/npm/%40alessiofrittoli%2Freact-media-player">
    <img src="https://img.shields.io/librariesio/release/npm/@alessiofrittoli/react-media-player" alt="Dependencies status"/>
  </a>
</p>
<p align="center">
  <a href="https://bundlephobia.com/package/@alessiofrittoli/react-media-player">
    <img src="https://badgen.net/bundlephobia/min/@alessiofrittoli/react-media-player" alt="minified"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/react-media-player">
    <img src="https://badgen.net/bundlephobia/minzip/@alessiofrittoli/react-media-player" alt="minizipped"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/react-media-player">
    <img src="https://badgen.net/bundlephobia/tree-shaking/@alessiofrittoli/react-media-player" alt="Tree shakable"/>
  </a>
</p>
<p align="center">
  <a href="https://github.com/sponsors/alessiofrittoli">
    <img src="https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2" alt="Fund this package"/>
  </a>
</p>

[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

### Table of Contents

- [Getting started](#getting-started)
- [API Reference](#api-reference)
  - [React Hooks](#react-hooks)
    - [`useVolume`](#usevolume)
    - [`useMediaPlayerController`](#usemediaplayercontroller)
- [Development](#development)
  - [Install depenendencies](#install-depenendencies)
  - [Build the source code](#build-the-source-code)
  - [ESLint](#eslint)
  - [Jest](#jest)
- [Contributing](#contributing)
- [Security](#security)
- [Credits](#made-with-)

---

### Getting started

Run the following command to start using `react-media-player` in your projects:

```bash
npm i @alessiofrittoli/react-media-player
```

or using `pnpm`

```bash
pnpm i @alessiofrittoli/react-media-player
```

---

### API Reference

#### React Hooks

##### `useVolume`

Manage audio volume control.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter                 | Type               | Default | Description                                             |
| ------------------------- | ------------------ | ------- | ------------------------------------------------------- |
| `options`                 | `UseVolumeOptions` | -       | Configuration options for the volume hook.              |
| `options.media`           | `HTMLMediaElement` | -       | The `HTMLMediaElement`.                                 |
| `options.volume`          | `number`           | `1`     | The master volume [0-1].                                |
| `options.normalizeVolume` | `boolean`          | `true`  | Normalize master volume.                                |
| `options.fade`            | `number`           | `200`   | Volume fade in milliseconds applied when toggling mute. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseVolume`

An object providing volume control functionality including volume management, mute toggling, and volume normalization for media players.

| Property          | Type                      | Description                                                                             |
| ----------------- | ------------------------- | --------------------------------------------------------------------------------------- |
| `volumeRef`       | `React.RefObject<number>` | A React RefObject that stores the master volume value [0-1].                            |
|                   |                           | This value may stores the normalized value if `normalizeVolume` has been set to `true`. |
| `initialVolume`   | `number`                  | The initial master volume [0-1].                                                        |
| `normalizeVolume` | `boolean`                 | Indicates whether volume normalization is applied.                                      |
| `setVolume`       | `ChangeHandler`           | Set volume.                                                                             |
| `toggleMute`      | `ToggleMuteHandler`       | Toggle mute.                                                                            |
|                   |                           | Returns `0` if muting, otherwise the volume value before the mute was activated.        |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```ts
import { useVolume } from "@alessiofrittoli/react-media-player";

const { setVolume, toggleMute, volumeRef } = useVolume({
  media: HTMLAudioElement | HTMLVideoElement,
  volume: 0.8,
  normalizeVolume: true,
  fade: 300,
});
```

</details>

---

##### `useMediaPlayerController`

React media player controller state.

<details>

<summary style="cursor:pointer">Type parameters</summary>

| Parameter | Type                      | Description            |
| --------- | ------------------------- | ---------------------- |
| `T`       | `T extends Queue = Queue` | The type of the queue. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter                       | Type                                 | Default | Description                                                                            |
| ------------------------------- | ------------------------------------ | ------- | -------------------------------------------------------------------------------------- |
| `options`                       | `UseMediaPlayerControllerOptions<T>` | -       | An object defining media player controller options.                                    |
| `options.volumeRef`             | `React.RefObject<number>`            | -       | A React RefObject that stores the master volume value [0-1].                           |
|                                 |                                      | -       | Compatible with `volumeRef` returned by [`useVolume`](#usevolume) hook.                |
| `options.repeat`                | `boolean`                            | `true`  | Indicates whether repeatition of the given queue is initially active.                  |
| `options.media`                 | `HTMLMediaElement`                   | -       | The `HTMLMediaElement`.                                                                |
| `options.queue`                 | `T`                                  | -       | An object describing the queue.                                                        |
| `options.initialMedia`          | `InitialMedia<QueuedItemType<T>>`    | -       | Defines the initial queue media to load.                                               |
| `options.restartThreshold`      | `number\|false`                      | `5000`  | Indicates time in milliseconds after that the media restart to `0`                     |
|                                 |                                      |         | rather than playing the previous one.                                                  |
|                                 |                                      |         | This only take effect when `previous()` method is called.                              |
|                                 |                                      |         | You can opt-out by this functionality by setting `restartThreshold` to `false` or `0`. |
| `options.playPauseFadeDuration` | `number`                             | `200`   | Volume fade in milliseconds applied when soundtrack start playing/get paused.          |
| `options.onMediaChange`         | `MediaChangeHandler<T>`              | -       | A callback executed when media player is playing and transitioning to another media.   |
| `options.onPlaybackError`       | `PlaybackErrorHandler`               | -       | A callback executed when an error occurs when playing a media.                         |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseMediaPlayerController<T>`

An object defining media player state and utilities.

- extends and exposes [`useQueue`](https://npmjs.com/package/@alessiofrittoli/react-hooks#usequeue) APIs.
  it may be worthy to take a look at undocumented returned properties in the [`useQueue`](https://npmjs.com/package/@alessiofrittoli/react-hooks#usequeue) documentation.

| Properties        | Type                         | Description                                                                          |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| `state`           | `PlayerState`                | Defines the current media player state.                                              |
|                   |                              | It could be one of the following:                                                    |
|                   |                              | - `playing` \| The media player is currently playing.                                |
|                   |                              | - `paused` \| The media player is currently paused.                                  |
|                   |                              | - `stopped` \| The media player hasn't been started yet or has been stopped.         |
| `isPlaying`       | `boolean`                    | Defines whether the media player is currently playing.                               |
| `playPause`       | `PlayPauseHandler<T>`        | Play/pause/stop the media player or start another media.                             |
|                   |                              | - Returns: The queued item being played.                                             |
| `togglePlayPause` | `UtilityPlayPauseHandler<T>` | Toggle play/pause.                                                                   |
|                   |                              | - Returns: The queued item being played/paused.                                      |
| `stop`            | `UtilityPlayPauseHandler<T>` | Stop media player.                                                                   |
|                   |                              | - Returns: The queued item that was playing before stopping the media player if any. |
| `previous`        | `UtilityPlayPauseHandler<T>` | Play previous queued media.                                                          |
|                   |                              | - Returns: The queued item being played if any.                                      |
| `next`            | `UtilityPlayPauseHandler<T>` | Play next queued media.                                                              |
|                   |                              | - Returns: The queued item being played if any.                                      |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Defining the queue

```ts
import { addItemsUUID } from "@alessiofrittoli/react-media-player/utils";
import type { Media, Queue } from "@alessiofrittoli/react-media-player";

interface PlaylistMedia extends Media {
  customProp: boolean;
}

interface Playlist extends Queue<PlaylistMedia> {
  name?: string;
}

const queue: Playlist = {
  name: "Playlist name",
  items: addItemsUUID<PlaylistMedia>([
    {
      src: "/song.mp3",
      type: "audio",
      title: "Song title",
      album: "Album name",
      artist: "Artist name",
      customProp: true,
      fade: { in: 1000, out: 1000 },
      artwork: [
        { src: "/artwork-96.png", sizes: 96, type: "image/png" },
        { src: "/artwork-128.png", sizes: 128, type: "image/png" },
        { src: "/artwork-192.png", sizes: 192, type: "image/png" },
        { src: "/artwork-256.png", sizes: 256, type: "image/png" },
        { src: "/artwork-384.png", sizes: 384, type: "image/png" },
        { src: "/artwork-512.png", sizes: 512, type: "image/png" },
      ],
      videoArtwork: [{ src: "/video-artwork.mp4", type: "video/mp4" }],
    },
    {
      src: "/song-2.mp3",
      type: "audio",
      title: "Song title 2",
      album: "Album name",
      artist: "Artist name",
      customProp: true,
      fade: { in: 1000, out: 1000 },
      artwork: [
        { src: "/artwork-96.png", sizes: 96, type: "image/png" },
        { src: "/artwork-128.png", sizes: 128, type: "image/png" },
        { src: "/artwork-192.png", sizes: 192, type: "image/png" },
        { src: "/artwork-256.png", sizes: 256, type: "image/png" },
        { src: "/artwork-384.png", sizes: 384, type: "image/png" },
        { src: "/artwork-512.png", sizes: 512, type: "image/png" },
      ],
      videoArtwork: [{ src: "/video-artwork.mp4", type: "video/mp4" }],
    },
  ]),
};
```

---

###### Toggle play/pause

```tsx
"use client";

import { useMediaPlayerController } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const { isPlaying, togglePlayPause } = useMediaPlayerController({ queue });

  return (
    <button onClick={togglePlayPause}>{!isPlaying ? "Play" : "Pause"}</button>
  );
};
```

---

###### Play previous media

```tsx
"use client";

import { useMediaPlayerController } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const { hasPrevious, previous } = useMediaPlayerController({
    queue,
    repeat: false,
  });

  return hasPrevious && <button onClick={previous}>Previous song</button>;
};
```

---

###### Play next media

```tsx
"use client";

import { useMediaPlayerController } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const { hasNext, next } = useMediaPlayerController({ queue, repeat: false });

  return hasNext && <button onClick={next}>Next song</button>;
};
```

---

###### Play a queued media matching given UUID

```tsx
import { useMediaPlayerController } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const { playPause } = useMediaPlayerController({ queue });

  return (
    <button
      onClick={() => {
        playPause({ uuid: queue.items.at(1)?.uuid });
      }}
    >
      Play {queue.items.at(1)?.title}
    </button>
  );
};
```

---

###### Update queue and play a queued media matching given UUID

```tsx
import { useMediaPlayerController } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const { playPause } = useMediaPlayerController({ queue });

  return (
    <button
      onClick={() => {
        playPause({ queue: queue2, uuid: queue2.items.at(1)?.uuid });
      }}
    >
      Play {queue2.items.at(1)?.title}
    </button>
  );
};
```

</details>

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
