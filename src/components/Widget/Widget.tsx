import React from "react";
import Config from "../../config";
import "./Widget.css";

const widgetName = Config.name;

class Widget extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      message: null,
    } as any;
  }

  render() {
    if ((this.state as any).message) {
      return (
        <div className="widget-container">
          <h1>I'm a {widgetName}</h1>
          <div>I have a message: {(this.state as any).message}</div>
        </div>
      );
    } else {
      return (
        <div className="widget-container">
          <h1>I'm a {widgetName}</h1>
        </div>
      );
    }
  }

  setMessage(message: any) {
    this.setState({ message: message });
  }
}

export default Widget;
