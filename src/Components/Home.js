import React from "react";
import axios from "axios";

import Wallpaper from "./Wallpaper";
import QuickSearch from "./QuickSearch";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      quickSearchItems: [],
    };
  }
  componentDidMount() {
    sessionStorage.clear();
    axios({
      url: "https://nus-zom-api.herokuapp.com/locations",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        this.setState({ locations: res.data.locations });
      })
      .catch();

    axios({
      url: "https://nus-zom-api.herokuapp.com/mealtypes",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        this.setState({ quickSearchItems: res.data.mealtypes });
      })
      .catch();
  }
  render() {
    const { locations, quickSearchItems } = this.state;

    return (
      <div>
        <Wallpaper locationsData={locations} />
        <QuickSearch quickSearchitemsData={quickSearchItems} />
      </div>
    );
  }
}

export default Home;
