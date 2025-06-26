# [www.ogis.app](http://www.ogis.app)

The free, Open-Source app for creating and editing meaningful maps in the
browser.

### Development

> [!NOTE]
> To develop locally you will need to have both Node.js and NPM [installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

```bash
# Clone the repository (and the Waymark JS submodule)
git clone --recurse-submodules https://github.com/OpenGIS/ogis-app

# Navigate to the Waymark directory
cd ogis-app

# Install the dependencies (or pnpm/yarn install)
npm install

# Run the development server (using Vite)
npm run dev
```

The build script will watch for changes to the JavaScript and CSS files.

Pull requests are welcome!

> [!IMPORTANT] > [Waymark JS](https://www.waymark.dev/js) is required as a Git submodule (`/waymark-js` directory). View on [GitHub](https://github.com/OpenGIS/Waymark-JS/).
