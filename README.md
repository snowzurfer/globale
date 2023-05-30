# globale

## 📍 [This project is WIP]

NextJS + Typescript + ThreeJS + UltraGlobe.

Once cloned, make sure to get the submodules via

```bash
git submodule update --init --recursive
```

Uses a forked version of [UltraGlobe][https://github.com/ebeaufay/UltraGlobe].

## Demo

[🎥 Live demo](https://globale-snowzurfer.vercel.app/)

(the live demo might sometimes be broken as I'm still working on it)

## Installation

```bash
pnpm install
```

## Usage

Specify your Google Maps API key in the `.env.local` file before building / running / etc.

then

`pnpm run dev`

to run locally.

## What can you do today

You can add items via ThreeJS to the WHOLE of the Earth, just by clicking!

## Dependencies / Credits

* [UltraGlobe](https://github.com/ebeaufay/UltraGlobe) (forked) (HUGE thanks to [ebeaufay](https://github.com/ebeaufay) for this amazing library)
* [ThreeJS](https://threejs.org/)
* [NextJS](https://nextjs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [Google Maps](https://developers.google.com/maps/documentation/javascript/overview)
* [react-three-fiber](https://github.com/pmndrs/react-three-fiber)
* [drei](https://github.com/pmndrs/drei)
* [tailwind](https://tailwindcss.com/)
* [pnpm](https://pnpm.io/)

## Todos

✅ Publish on Vercel

[] Try [AMMOS](https://github.com/NASA-AMMOS/3DTilesRendererJS) and create a Globe Controller for it that reproduces Google Earth's camera behavior

⏳ Add Firebase and synchronize

⏳ Add AR companion app

## License

[MIT](https://choosealicense.com/licenses/mit/)
