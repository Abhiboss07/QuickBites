# QuickBites

QuickBites is a dynamic, responsive web application for food ordering and delivery. It offers a seamless user experience, allowing customers to browse restaurants, view menus, add items to their cart, and track their orders.

## Technologies Used

*   **Frontend Web:** React (Vite), HTML, standard CSS
*   **Mobile Wrapper:** React Native (Expo WebView Wrapper)
*   **Routing:** React Router DOM

## Running the Web Application

To run the web application locally:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```
3.  **View the app:** Open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).

## Running the Expo Mobile Wrapper

To test the application as a native mobile app using Expo Go:

1.  **Navigate to the Expo wrapper directory:**
    ```bash
    cd expo-wrapper
    ```
2.  **Ensure the web app server is running with the `--host` flag** (so the Expo app can access it over the local network):
    ```bash
    # Run this in the main QuickBites directory
    npm run dev -- --host
    ```
3.  **Find your local IP address:** You may need to update the `VITE_SERVER_URL` in `expo-wrapper/app/index.tsx` to match your computer's local IPv4 address.
4.  **Install wrapper dependencies (if not already done):**
    ```bash
    npm install
    ```
5.  **Start the Expo server:**
    ```bash
    npm run start
    ```
6.  **Test on your device:** Open the Expo Go app on your physical mobile device and scan the QR code displayed in your terminal.

## Project Structure

*   `src/`: Contains all the React web components, pages, context, and data for the QuickBites web app.
*   `expo-wrapper/`: Contains the Expo React Native application that wraps the Vite web server for mobile testing.
*   `index.html`: The main entry point for the web application.
*   `vite.config.js`: Configuration for the Vite build tool.
