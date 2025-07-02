import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { CssBaseline } from "@mui/material";


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <BrowserRouter>
        <CssBaseline />
        <div className="app-layout">
          <div className="app-content" style={{ marginTop: "66px" }}>
            <App />
          </div>
        </div>
      </BrowserRouter>
  </Provider>
);
