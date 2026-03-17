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
    - [`useAudioPlayer`](#useaudioplayer)
    - [`useAudioPlayerStore`](#useaudioplayerstore)
    - [`useVideoPlayer`](#usevideoplayer)
    - [`useVideoPlayerStore`](#usevideoplayerstore)
    - [`useMediaPlayer`](#usemediaplayer)
    - [`useVolume`](#usevolume)
    - [`useVolumeStore`](#usevolumestore)
    - [`useMediaPlayerController`](#usemediaplayercontroller)
    - [`useMediaPlayerLoading`](#usemediaplayerloading)
    - [`useMediaPreload`](#usemediapreload)
    - [`useMediaSession`](#usemediasession)
    - [`useMediaSessionPiP`](#usemediasessionpip)
  - [React Components](#react-components)
- [Development](#development)
  - [Install dependencies](#install-dependencies)
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

#### Defining the queue

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

#### React Hooks

##### `useAudioPlayer`

Easily handle React audio players.

This hook acts as a wrapper around [`useMediaPlayer`](#usemediaplayer) and it automatically creates `Audio` resource for you.

Please refer to [`useMediaPlayer`](#usemediaplayer) doc section for API reference.

<details>

<summary style="cursor:pointer">Usage</summary>

```ts
import { useAudioPlayer } from "@alessiofrittoli/react-media-player";
import type {
  MediaChangeHandler,
  PlaybackErrorHandler,
} from "@alessiofrittoli/react-media-player";

useAudioPlayer({
  queue,
  initialMedia: queue.items.at(2),
  normalizeVolume: true,
  playPauseFadeDuration: 500,
  preload: true,
  repeat: true,
  restartThreshold: 6000,
  volume: 1,
  onMediaChange: useCallback<MediaChangeHandler<T>>((media) => {}, []),
  onPlaybackError: useCallback<PlaybackErrorHandler>((error) => {}, []),
});
```

- See [Defining the queue](#defining-the-queue) for more info.

</details>

---

##### `useAudioPlayerStore`

Access [`useAudioPlayer`](#useaudioplayer) API exposed by [`<AudioPlayerProvider />`](#audioplayerprovider-) Component.

---

##### `useVideoPlayer`

Easily handle React video players.

This hook acts as a wrapper around [`useMediaPlayer`](#usemediaplayer) and it automatically creates a `React.RefObject` that
needs to be attached to a `<video />` JSX node.

Please refer to [`useMediaPlayer`](#usemediaplayer) doc section for API reference.

<details>

<summary style="cursor:pointer">Usage</summary>

```tsx
"use client";

import { useVideoPlayer } from "@alessiofrittoli/react-media-player";
import type {
  MediaChangeHandler,
  PlaybackErrorHandler,
} from "@alessiofrittoli/react-media-player";

export const VideoPlayer: React.FC = () => {
  const { videoRef } = useVideoPlayer({
    queue,
    initialMedia: queue.items.at(2),
    normalizeVolume: true,
    playPauseFadeDuration: 500,
    preload: true,
    repeat: true,
    restartThreshold: 6000,
    volume: 1,
    onMediaChange: useCallback<MediaChangeHandler<T>>((media) => {}, []),
    onPlaybackError: useCallback<PlaybackErrorHandler>((error) => {}, []),
  });

  return <video ref={videoRef} />;
};
```

- See [Defining the queue](#defining-the-queue) for more info.

</details>

---

##### `useVideoPlayerStore`

Access [`useVideoPlayer`](#usevideoplayer) API exposed by [`<VideoPlayerProvider />`](#videoplayerprovider-) Component.

---

##### `useMediaPlayer`

Easily handle React media players.

<details>

<summary style="cursor:pointer">Type parameters</summary>

| Parameter | Type                      | Description            |
| --------- | ------------------------- | ---------------------- |
| `T`       | `T extends Queue = Queue` | The type of the queue. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter         | Type                       | Default | Description                                                                                |
| ----------------- | -------------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `options`         | `UseMediaPlayerOptions<T>` | -       | An object defining media player options.                                                   |
|                   |                            |         | - extends [`UseVolumeOptions`](#usevolumeoptions) interface.                               |
|                   |                            |         | - extends [`UseMediaPlayerControllerOptions`](#usemediaplayercontrolleroptions) interface. |
| `options.preload` | `boolean`                  | `true`  | Indicates whether to preload next media when current media is about to end.                |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseMediaPlayer<T>`

An object defining media player state and utilities.

- extends [`UseVolume`](#usevolume-interface) interface.
- extends [`UseMediaPlayerController<T>`](#usemediaplayercontroller-interface) interface.
- extends [`UseMediaPreload`](#usemediapreload-interface) interface.
- extends [`UseMediaPlayerLoading`](#usemediaplayerloading-interface) interface.

| Property | Type               | Description                   |
| -------- | ------------------ | ----------------------------- |
| `media`  | `HTMLMediaElement` | The given `HTMLMediaElement`. |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```ts
import { useRef } from "react";
import { useMediaPlayer } from "@alessiofrittoli/react-media-player";
import type {
  MediaChangeHandler,
  PlaybackErrorHandler,
} from "@alessiofrittoli/react-media-player";

const media = useRef(typeof window !== "undefined" ? new Audio() : undefined);

useMediaPlayer({
  media: media.current,
  queue,
  initialMedia: queue.items.at(2),
  normalizeVolume: true,
  playPauseFadeDuration: 500,
  preload: true,
  repeat: true,
  restartThreshold: 6000,
  volume: 1,
  onMediaChange: useCallback<MediaChangeHandler<T>>((media) => {}, []),
  onPlaybackError: useCallback<PlaybackErrorHandler>((error) => {}, []),
});
```

- See [Defining the queue](#defining-the-queue) for more info.

</details>

---

##### `useVolume`

Manage audio volume control.

Please note that this hook doesn't update states to avoid useless overloads. This hook only handles `media` volume updates and relative normalizations.

UI state updates can be managed using [`useVolumeStore`](#usevolumestore) accessible inside [`<VolumeProvider />`](#volumeprovider-) Component children.

###### `UseVolumeOptions`

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

###### `UseVolume` interface

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

```tsx
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

##### `useVolumeStore`

Access [`useVolume`](#usevolume) API exposed by [`<VolumeProvider />`](#volumeprovider-) Component.

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

###### `UseMediaPlayerControllerOptions`

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter                       | Type                                 | Default | Description                                                                                  |
| ------------------------------- | ------------------------------------ | ------- | -------------------------------------------------------------------------------------------- |
| `options`                       | `UseMediaPlayerControllerOptions<T>` | -       | An object defining media player controller options.                                          |
| `options.volumeRef`             | `React.RefObject<number>`            | -       | A React RefObject that stores the master volume value [0-1].                                 |
|                                 |                                      | -       | Compatible with `volumeRef` returned by [`useVolume`](#usevolume) hook.                      |
| `options.repeat`                | `boolean`                            | `true`  | Indicates whether repeatition of the given queue is initially active.                        |
| `options.media`                 | `HTMLMediaElement`                   | -       | The `HTMLMediaElement`.                                                                      |
| `options.queue`                 | `T`                                  | -       | An object describing the queue. See [Defining the queue](#defining-the-queue) for more info. |
| `options.initialMedia`          | `InitialMedia<QueuedItemType<T>>`    | -       | Defines the initial queue media to load.                                                     |
| `options.restartThreshold`      | `number\|false`                      | `5000`  | Indicates time in milliseconds after that the media restart to `0`                           |
|                                 |                                      |         | rather than playing the previous one.                                                        |
|                                 |                                      |         | This only take effect when `previous()` method is called.                                    |
|                                 |                                      |         | You can opt-out by this functionality by setting `restartThreshold` to `false` or `0`.       |
| `options.playPauseFadeDuration` | `number`                             | `200`   | Volume fade in milliseconds applied when soundtrack start playing/get paused.                |
| `options.onMediaChange`         | `MediaChangeHandler<T>`              | -       | A callback executed when media player is playing and transitioning to another media.         |
| `options.onPlaybackError`       | `PlaybackErrorHandler`               | -       | A callback executed when an error occurs when playing a media.                               |

</details>

---

###### `UseMediaPlayerController` interface

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

###### Toggle play/pause

```tsx
"use client";

import { useRef } from "react";
import { useMediaPlayerController } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const media = useRef(typeof window !== "undefined" ? new Audio() : undefined);
  const { isPlaying, togglePlayPause } = useMediaPlayerController({
    queue,
    media,
  });

  return (
    <button onClick={togglePlayPause}>{!isPlaying ? "Play" : "Pause"}</button>
  );
};
```

---

###### Play previous media

```tsx
"use client";

import { useRef } from "react";
import { useMediaPlayerController } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const media = useRef(typeof window !== "undefined" ? new Audio() : undefined);
  const { hasPrevious, previous } = useMediaPlayerController({
    queue,
    media,
    repeat: false,
  });

  return hasPrevious && <button onClick={previous}>Previous song</button>;
};
```

---

###### Play next media

```tsx
"use client";

import { useRef } from "react";
import { useMediaPlayerController } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const media = useRef(typeof window !== "undefined" ? new Audio() : undefined);
  const { hasNext, next } = useMediaPlayerController({
    queue,
    media,
    repeat: false,
  });

  return hasNext && <button onClick={next}>Next song</button>;
};
```

---

###### Play a queued media matching given UUID

```tsx
"use client";

import { useRef } from "react";
import { useMediaPlayerController } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const media = useRef(typeof window !== "undefined" ? new Audio() : undefined);
  const { playPause } = useMediaPlayerController({ queue, media });

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
"use client";

import { useRef } from "react";
import { useMediaPlayerController } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const media = useRef(typeof window !== "undefined" ? new Audio() : undefined);
  const { playPause } = useMediaPlayerController({ queue, media });

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

##### `useMediaPlayerLoading`

Handle media loading and error states.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter       | Type                           | Description                                      |
| --------------- | ------------------------------ | ------------------------------------------------ |
| `options`       | `UseMediaPlayerLoadingOptions` | An object defining media player loading options. |
| `options.media` | `HTMLMediaElement`             | The `HTMLMediaElement`.                          |

</details>

---

###### `UseMediaPlayerLoading` interface

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseMediaPlayerLoading`

An object defining loading and error states.

| Parameter   | Type         | Description                                                                                                                                                                                 |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isLoading` | `boolean`    | Indicates whether the current media is loading.                                                                                                                                             |
| `error`     | `MediaError` | The `MediaError` interface represents an error which occurred while handling                                                                                                                |
|             |              | media in an HTML media element based on [`HTMLMediaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement),                                                            |
|             |              | such as [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio) or [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video). |
|             |              | - see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaError).                                                                                                         |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```tsx
"use client";

import { useEffect, useState } from "react";
import { useMediaPlayerLoading } from "@alessiofrittoli/react-media-player";

export const MyComponent: React.FC = () => {
  const [media, setMedia] = useState<HTMLAudioElement>();

  const { isLoading, error } = useMediaPlayerLoading({ media });

  useEffect(() => {
    setMedia(new Audio("/song.mp3"));
  }, []);

  return (
    <>
      {isLoading && <span>Loading...</span>}
      {!isLoading && !error && <span>Loaded</span>}
      {error?.code === MediaError?.MEDIA_ERR_ABORTED && (
        <span>
          The fetching of the associated resource was aborted by the user's
          request.
        </span>
      )}
      {error?.code === MediaError?.MEDIA_ERR_NETWORK && (
        <span>
          Some kind of network error occurred which prevented the media from
          being successfully fetched, despite having previously been available.
        </span>
      )}
      {error?.code === MediaError?.MEDIA_ERR_DECODE && (
        <span>
          Despite having previously been determined to be usable, an error
          occurred while trying to decode the media resource, resulting in an
          error.
        </span>
      )}
      {error?.code === MediaError?.MEDIA_ERR_SRC_NOT_SUPPORTED && (
        <span>
          The associated resource or media provider object (such as a
          MediaStream) has been found to be unsuitable.
        </span>
      )}
    </>
  );
};
```

</details>

---

##### `useMediaPreload`

Handle media preload.

<details>

<summary style="cursor:pointer">Type parameters</summary>

| Parameter | Type                      | Description            |
| --------- | ------------------------- | ---------------------- |
| `T`       | `T extends Queue = Queue` | The type of the queue. |

</details>

---

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter                 | Type                          | Default | Description                                                          |
| ------------------------- | ----------------------------- | ------- | -------------------------------------------------------------------- |
| `options`                 | `UseVolumeOptions`            | -       | Configuration options for the volume hook.                           |
| `options.controller`      | `UseMediaPlayerController<T>` | -       | The media player controller.                                         |
| `options.cacheEntries`    | `number`                      | `3`     | Defines the maximum cache entries.                                   |
| `options.checkConnection` | `boolean`                     | `true`  | Defines whether preload is enabled based on user connection quality. |

</details>

---

###### `UseMediaPreload` interface

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `UseMediaPreload`

An object containing preload functions.

| Property               | Type                           | Description             |
| ---------------------- | ------------------------------ | ----------------------- |
| `preloadMedia`         | `PreloadMediaHandler`          | Preload media.          |
| `preloadPreviousMedia` | `PreloadPreviousOrNextHandler` | Preload previous media. |
| `preloadNextMedia`     | `PreloadPreviousOrNextHandler` | Preload next media.     |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Basic usage

```tsx
"use client";

import { useEffect, useState } from "react";
import { addItemsUUID } from "@alessiofrittoli/react-media-player/utils";
import {
  useMediaPlayerController,
  useMediaPreload,
  type Media,
  type Queue,
} from "@alessiofrittoli/react-media-player";

interface Playlist extends Queue<Media> {
  name?: string;
}

const queue: Playlist = {
  name: "Playlist name",
  items: addItemsUUID<Media>([
    {
      src: "/song-1.mp3",
      type: "audio",
    },
    {
      src: "/song-2.mp3",
      type: "audio",
    },
  ]),
};

export const MyComponent: React.FC = () => {
  const [media, setMedia] = useState<HTMLAudioElement>();

  const controller = useMediaPlayerController({ queue, media });
  const { preloadPreviousMedia, preloadNextMedia } = useMediaPreload({
    controller,
  });
  const { isPlaying, hasPrevious, hasNext, previous, next, togglePlayPause } =
    controller;

  useEffect(() => {
    setMedia(new Audio());
  }, []);

  return (
    <>
      <button
        onMouseEnter={() => {
          if (!hasPrevious) return;
          preloadPreviousMedia();
        }}
        onClick={() => {
          if (!hasPrevious) return;
          previous();
        }}
      >
        Previous
      </button>
      <button onClick={togglePlayPause}>{!isPlaying ? "Play" : "Pause"}</button>
      <button
        onMouseEnter={() => {
          if (!hasNext) return;
          preloadNextMedia();
        }}
        onClick={() => {
          if (!hasNext) return;
          next();
        }}
      >
        Next
      </button>
    </>
  );
};
```

---

###### Override `checkConnection` option

Returns 'metadata' for slow-2g or 2g connections

```ts
import { useMediaPreload } from "@alessiofrittoli/react-media-player";

const { preloadNextMedia } = useMediaPreload({
  controller,
  checkConnection = true, // preload strategy may use `metadata` if connection is `slow-2g` or `2g`
});

preloadNextMedia(false); // preload strategy will be `auto` ignoring previously passed `checkConnection` option
```

</details>

---

##### `useMediaSession`

Hook into MediaSession API for controlling media playback through system controls.

Manages MediaSession state and action handlers for play, pause, stop, seek, previous, and next operations.
Synchronizes the native media element's playback state with the MediaSession API and handles user interactions
through system media controls (e.g., keyboard shortcuts, media control buttons).

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter                | Type                        | Description                                                                                                |
| ------------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `options`                | `UseMediaSessionOptions`    | An object defining options and callbacks.                                                                  |
| `options.media`          | `HTMLMediaElement`          | The `HTMLMediaElement`.                                                                                    |
| `options.register`       | `boolean`                   | Indicates whether to register the action handlers.                                                         |
|                          |                             | ⚠️ It is better to set `register` to `true` once and only after `media.play()` has been called.            |
| `options.onPlay`         | `MediaSessionActionHandler` | A custom callback executed once user requested to play the media through browser/device controls.          |
| `options.onPause`        | `MediaSessionActionHandler` | A custom callback executed once user requested to pause the media through browser/device controls.         |
| `options.onStop`         | `MediaSessionActionHandler` | A custom callback executed once user requested to stop the media through browser/device controls.          |
|                          |                             | ⚠️ Stop requests always depend on browser support.                                                         |
| `options.onPrev`         | `MediaSessionActionHandler` | A custom callback executed once user requested to play the previous media through browser/device controls. |
|                          |                             | ⚠️ Please note that if no `onPrev` function is given, the MediaSession functionality will not be enabled.  |
| `options.onNext`         | `MediaSessionActionHandler` | A custom callback executed once user requested to play the next media through browser/device controls.     |
|                          |                             | ⚠️ Please note that if no `onNext` function is given, the MediaSession functionality will not be enabled.  |
| `options.onSeekBackward` | `MediaSessionActionHandler` | A custom callback executed once user requested to seek backward through browser/device controls.           |
| `options.onSeekForward`  | `MediaSessionActionHandler` | A custom callback executed once user requested to seek forward through browser/device controls.            |
| `options.onSeekTo`       | `MediaSessionActionHandler` | A custom callback executed once user requested to seek to a specific time through browser/device controls. |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```ts
import {
  PlayerState,
  useMediaSession,
  useMediaPlayerController,
} from "@alessiofrittoli/react-media-player";

const { state, hasNext, hasPrevious, togglePlayPause, stop, previous, next } =
  useMediaPlayerController({ queue, media });

useMediaSession({
  media,
  register: state !== PlayerState.STOPPED,
  onPlay: togglePlayPause,
  onPause: togglePlayPause,
  onStop: stop,
  onPrev: hasPrevious ? previous : undefined,
  onNext: hasNext ? next : undefined,
});
```

</details>

---

##### `useMediaSessionPiP`

Hook into MediaSession Picture-in-Picture requests.

_Useful resources_

- [Document Picture-in-Picture API](https://npmjs.com/package/@alessiofrittoli/web-utils#document-picture-in-picture)
- [Media Artwork Picture-in-Picture API](https://www.npmjs.com/package/@alessiofrittoli/media-utils#openartworkpictureinpicture)

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter            | Type                        | Description                                                      |
| -------------------- | --------------------------- | ---------------------------------------------------------------- |
| `options`            | `UseMediaSessionPiPOptions` | An object defining options and callbacks.                        |
| `options.register`   | `boolean`                   | Indicates whether to register the action handler.                |
|                      |                             | ⚠️ Enter PiP requests always depends on browser support.         |
| `options.onEnterPiP` | `MediaSessionActionHandler` | A custom callback executed once the user requested to enter PiP. |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

```tsx
"use client";

import { useCallback, useState, type ReactPortal } from "react";
import {
  PlayerState,
  useMediaSessionPiP,
  useMediaPlayerController,
} from "@alessiofrittoli/react-media-player";
import {
  openDocumentPictureInPicture,
  isDocumentPictureInPictureSupported,
} from "@alessiofrittoli/web-utils";
import { openArtworkPictureInPicture } from "@alessiofrittoli/media-utils/picture-in-picture";

export const MyComponent: React.FC = () => {
  const [portal, setPortal] = useState<ReactPortal>();
  const { state } = useMediaPlayerController({ queue, media });

  const open = useCallback(async () => {
    if (isDocumentPictureInPictureSupported()) {
      const { window } = await openDocumentPictureInPicture();

      const reactNode = (
        <PictureInPictureWindowProvider window={window}>
          <PictureInPictureComponent />
        </PictureInPictureWindowProvider>
      );

      const portal = createPortal(reactNode, window.document.body);

      return;
    }

    await openArtworkPictureInPicture( ... );
  }, []);

  useMediaSessionPiP({
    register: state !== PlayerState.STOPPED,
    onEnterPiP: open,
  });

  return portal;
};
```

</details>

---

#### React Components

##### `<AudioPlayer />`

Creates a React Audio Player and exposes [`useAudioPlayer`](#useaudioplayer) API through React Context
with [`<AudioPlayerProvider />`](#audioplayerprovider-) and [`<VolumeProvider />`](#volumeprovider-).

This allows you to easily mix-up client and server components passed to the Component children.

<details>

<summary style="cursor:pointer">Component Props</summary>

- extends [`useAudioPlayer`](#useaudioplayer) options

| Property   | Type        | Description                                                                                                                                                                                                       |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children` | `ReactNode` | Any `ReactNode` which will get access to [`useAudioPlayer`](#useaudioplayer) API and volume UI states through [`useAudioPlayerStore`](#useaudioplayerstore) and [`useVolumeStore`](#usevolumestore) respectively. |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Basic usage

```tsx
import { AudioPlayer } from "@alessiofrittoli/react-media-player";

export const AppAudioPlayer: React.FC = () => (
  <AudioPlayer queue={queue}>
    <AudioPlayerControls />
  </AudioPlayer>
);
```

---

###### Accessing APIs in custom UI controls

```tsx
import { useCallback } from "react";
import { useUpdateEffect } from "@alessiofrittoli/react-hooks";
import { useAudioPlayerStore } from "@alessiofrittoli/react-media-player";

export const AudioPlayerControls: React.FC = () => {
  const { isPlaying, togglePlayPause } = useAudioPlayerStore();

  return (
    <>
      <button onClick={togglePlayPause}>{!isPlaying ? "Play" : "Pause"}</button>
    </>
  );
};
```

</details>

---

##### `<VideoPlayer />`

Creates a React Video Player and exposes [`useVideoPlayer`](#usevideoplayer) API through React Context
with [`<VideoPlayerProvider />`](#videoplayerprovider-) and [`<VolumeProvider />`](#volumeprovider-).

This allows you to easily mix-up client and server components passed to the Component children.

<details>

<summary style="cursor:pointer">Component Props</summary>

- extends [`useVideoPlayer`](#usevideoplayer) options

| Property    | Type                            | Description                                                                                                                                                                                                       |
| ----------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`  | `ReactNode`                     | Any `ReactNode` which will get access to [`useVideoPlayer`](#usevideoplayer) API and volume UI states through [`useVideoPlayerStore`](#usevideoplayerstore) and [`useVolumeStore`](#usevolumestore) respectively. |
| `htmlProps` | `React.ComponentProps<'video'>` | Props passed to the rendered `HTMLVideoElement`.                                                                                                                                                                  |

</details>

---

<details>

<summary style="cursor:pointer">Usage</summary>

###### Basic usage

```tsx
import { VideoPlayer } from "@alessiofrittoli/react-media-player";

export const AppVideoPlayer: React.FC = () => (
  <VideoPlayer queue={queue}>
    <VideoPlayerControls />
  </VideoPlayer>
);
```

---

###### Accessing APIs in custom UI controls

```tsx
"use client";

import { useCallback } from "react";
import { useUpdateEffect } from "@alessiofrittoli/react-hooks";
import { useVideoPlayerStore } from "@alessiofrittoli/react-media-player";

export const VideoPlayerControls: React.FC = () => {
  const { isPlaying, togglePlayPause } = useVideoPlayerStore();

  return (
    <>
      <button onClick={togglePlayPause}>{!isPlaying ? "Play" : "Pause"}</button>
    </>
  );
};
```

</details>

---

##### `<AudioPlayerProvider />`

Exposes [`useAudioPlayer`](#useaudioplayer) API.

---

##### `<VideoPlayerProvider />`

Exposes [`useVideoPlayer`](#usevideoplayer) API.

---

##### `<VolumeProvider />`

Exposes UI state updates utilities.

This may come pretty handy when volume is controlled by multiple UI controllers and saves [`useVolume`](#usevolume) hook
from dispatching state updates whenever a 0.1 volume value has been changed by the user.

This Component is already mounted when using the [`<AudioPlayer />`](#audioplayer-) or [`<VideoPlayer />`](#videoplayer-) Component,
so no extra action is required by you.

<details>

<summary style="cursor:pointer">Usage</summary>

```tsx
"use client";

import { useCallback } from "react";
import { useUpdateEffect } from "@alessiofrittoli/react-hooks";
import {
  AudioPlayer,
  useVolumeStore,
  useAudioPlayerStore,
} from "@alessiofrittoli/react-media-player";

export const AppAudioPlayer: React.FC = () => (
  <AudioPlayer queue={queue}>
    <AudioPlayerVolumeControl />
  </AudioPlayer>
);

export const AudioPlayerVolumeControl: React.FC = () => {
  const { volume, setVolume: commitVolume } = useVolumeStore();

  const { initialVolume, setVolume, toggleMute } = useAudioPlayerStore();

  const isMute = volume <= 0;

  const updateVolume = useCallback(
    (volume: number) => {
      setVolume(volume / 100);
      commitVolume(volume / 100);
    },
    [setVolume, commitVolume],
  );

  const toggleMuteHandler = useCallback(() => {
    commitVolume(toggleMute());
  }, [toggleMute, commitVolume]);

  useUpdateEffect(() => {
    updateVolume(initialVolume * 100);
  }, [initialVolume, updateVolume]);

  const onChangeHandler = useCallback<React.ChangeEventHandler>(
    (event) => {
      const input = event.target as HTMLInputElement;
      const value = Number(input.value);

      if (isNaN(value)) return;

      const percent = (value * 100) / 100;

      updateVolume(percent);
    },
    [updateVolume],
  );

  return (
    <>
      <button onClick={toggleMuteHandler}>{!isMute ? "Mute" : "Unmute"}</button>
      <input
        type="range"
        value={volume * 100}
        max={100}
        step={1}
        onChange={onChangeHandler}
        aria-valuetext={`${volume * 100}%`}
      />
    </>
  );
};
```

</details>

---

### Development

#### Install dependencies

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

Run warnings and errors checks.

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
pnpm test:coverage:serve
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
