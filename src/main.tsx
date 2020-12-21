import React from "react";
import ReactDOM from "react-dom";
import Widget from "./components/Widget";
import Config from "./config";

const widgetName = Config.name;
const widgetConfigName = widgetName + "Config";
const defaultconfig = {
  someDefaultConfiguration: false,
};

let widgetComponent = null as any;

function app(window: any) {
  console.log(`${widgetName} starting`);
  // If we don't already have a name for widget's global object
  // assigned by the host, then they must be using the simple <script> tag method
  // so we need to get our data out of that tag
  if (!window[widgetName]) {
    let tag = document.getElementById(widgetName + "-script");

    if (!tag) {
      throw Error(`Cannot find script tag with id {$widgetName}-script`);
    }

    let rawData = tag.getAttribute("data-config");
    rawData = (rawData as string).replace(/'/g, '"');
    console.log(rawData);
    let data: Record<string, unknown> = JSON.parse(rawData);

    window[widgetName] = data.name;

    let placeholder: Record<string, any> = {};
    ((placeholder.q = []) as any[]).push(["init", data.config]);

    window[window[widgetName]] = placeholder;
  }

  let placeholder = window[window[widgetName]];

  // override temporary (until the app loaded) handler
  // for widget's API calls
  window[window[widgetName]] = apiHandler;
  window[widgetConfigName] = defaultconfig;

  if (placeholder) {
    console.log(`${widgetName} placeholder found`);

    let queue = placeholder.q;
    if (queue) {
      console.log(`${widgetName} placeholder queue found`);

      for (var i = 0; i < queue.length; i++) {
        apiHandler(queue[i][0], queue[i][1]);
      }
    }
  }
}

/**
    Method that handles all API calls
*/
function apiHandler(api: any, params: any) {
  if (!api) throw Error("API method required");
  api = api.toLowerCase();
  let config = (window as any)[widgetConfigName];

  console.log(`Handling API call ${api}`, params, config);

  switch (api) {
    case "init":
      config = Object.assign({}, config, params);
      (window as any)[widgetConfigName] = config;

      // get a reference to the created widget component so we can
      // call methods as needed
      widgetComponent = React.createRef();
      ReactDOM.render(
        <Widget ref={widgetComponent} />,
        document.getElementById(config.targetElementId)
      );
      break;
    case "message":
      // Send the message to the current widget instance
      widgetComponent.current.setMessage(params);
      break;
    default:
      throw Error(`Method ${api} is not supported`);
  }
}

app(window);

export default app;
