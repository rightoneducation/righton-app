## Launching Debug Panel Locally

1. `cd` into the `networking` folder
2. run `npm install -g` (mac users might need to run `sudo npm install -g`)
3. run `npm run build`
4. then `npm link`
5. `cd` out of the `networking` folder then `cd` into the `debug-panel` folder
6. run `npm link @righton/networking`
7. then `npm install`
8. `npm start` :crossed_fingers:

** One thing to note is that it can take a few times of clicking the Create Game Session button for it to actually connect. Usually get an internal server error the first handful of times trying to connect to the Lambda, but it will go through. (Helpful to inspect and watch the console here)

Once it does connect and hit the endpoint - you should see the game session ID returned in the browser.
