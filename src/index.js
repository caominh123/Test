import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app/app";
import "./index.css";
import { Provider } from "react-redux";
import configureStore from "./util/store";

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById("root")
);
