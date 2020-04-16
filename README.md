This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Preparing a new puzzle data from geographic data

1. Given a shapefile, you must first convert it to geojson. You can do this easily in QGIS. Drag the shapefile onto the QGIS stage, select the new layer, and export it as GeoJSON. Be sure to set the `WRITE_BBOX` option to `YES`. You may want to export it with a new coordinate reference system (CRS) or the state's shape may appear off by itself.
2. From the root directory of this repo, run `npm run process-data -- --in foo.geojson --out public/puzzles/foo.json`, where `foo.geojson` is the path to the geojson you created in the preceding step. This script converts the GeoJSON to SVG paths, first simplifying it along the way via TopoJSON. If the shape appears oversimplified, tweak the `simplificationFactor` option.
3. Examine the newly created `public/puzzles/foo.json`. The `paths` property contains a mapping of features to paths. The `viewBox` property contains the min x and y coordinates, as well as the width and height of the puzzle in the coordinate reference system.
4. Set a `title` property to a string, which will be the title the user sees on the first stage of the interactive.
5. Set a `shareText` property to a string, which will be the text that appears in the share dialog the share buttons open at the end of the interactive. The string `{time}` will be filled in with the time the user took to complete the puzzle.
6. Run `npm run start` and open your new puzzle by going to `http://localhost:3000/?puzzle=foo&devMode=true`. Note the URL parameters.
7. The first time you view the puzzle, it will appear solved. Open the JavaScript console and drag the pieces to their desired start locations. Note that every time you drop a piece, the transform positions of each piece is logged in the console.
8. Once all pieces are their desired positions, copy the last set of transformation positions logged and set a `transforms` property in `public/puzzles/foo.json` to this string. Then, upon reloading the puzzle, all pieces should start in the initial positions you have specified.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

##

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
