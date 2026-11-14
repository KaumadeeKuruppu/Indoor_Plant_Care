# PlantCare

PlantCare is a mobile app built with React Native and Expo. It helps you learn about indoor plants and care for them.

## Features

- Browse and search indoor plants.
- Filter plants by their care needs.
- View plant details and care tips.
- Find possible causes of plant problems with Plant Doctor.
- Save your favourite plants.
- Set your profile name.
- Switch light/dark mode using the sun/moon icon at the top of Home. Your choice is saved on this device.

## Built with

- React Native and Expo
- JavaScript and Expo Router
- AsyncStorage for saved plants and your profile name
- Local JSON files for plant information

## Run the app

Install Node.js and npm. Open a terminal in the folder containing `Plant_Care`, then run:

```bash
cd Plant_Care
npm install
npx expo start
```

If your terminal is already inside `Plant_Care`, skip `cd Plant_Care`. 
Install dependencies on the first setup; for later runs, use `npx expo start`.

Follow the Expo terminal instructions to open the app on a compatible phone or emulator. Your phone and computer should normally be on the same Wi-Fi network.

## Project folders


assets/          Images and app icon

src/app/         Screens and navigation

src/components/  Reusable UI components

src/constants/   Colours, fonts, and image references

src/data/        Plant information and care tips

src/hooks/       Favourites and profile state

src/services/    Plant data, storage, and diagnosis logic

src/utils/       Plant filtering helpers

