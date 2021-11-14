import React from "react";
import "../Styles/home.css";
import axios from "axios";
import { withRouter } from "react-router-dom";

class Wallpaper extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurantList: [],
      searchText: undefined,
      suggestions: [],
    };
  }

  handleChangeLocation = (event) => {
    const locationId = event.target.value;
    sessionStorage.setItem("locationId", locationId);
    axios({
      url: `https://nus-zom-api.herokuapp.com/resturants/${locationId}`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        this.setState({ restaurantList: res.data.locationsById });
      })
      .catch();
  };

  handleChange = (event) => {
    const { restaurantList } = this.state;
    const searchText = event.target.value;

    let searchRestaurants = [];
    if (searchText) {
      searchRestaurants = restaurantList.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    this.setState({ suggestions: searchRestaurants, searchText });
  };

  selectedText = (resObj) => {
    this.props.history.push(`/details?restaurant=${resObj._id}`);
  };

  renderSuggestions = () => {
    const { suggestions, searchText } = this.state;

    if (suggestions.length == 0 && searchText == "") {
      return (
        <ul>
          <li>No Search Results Found</li>
        </ul>
      );
    }
    return (
      <ul className="suggestions">
        {suggestions.map((item, index) => (
          <li key={index} onClick={() => this.selectedText(item)}>{`${
            item.name
          } -   ${item.locality},${item.city}`}</li>
        ))}
      </ul>
    );
  };

  render() {
    const { locationsData } = this.props;

    return (
      <div>
        <div className="container-fluid wallpaper">
          <div className="banner">
            <div className="logo text-center">e!</div>
            <h4 className="mt-5 fw-bold text-white text-center">
              Find the best restaurants, cafés, and bars
            </h4>

            <div className="row">
              <div className="col-sm-12 col-md-4 mt-3">
                <select
                  className="form-select"
                  onChange={this.handleChangeLocation}
                >
                  <option value="0">Select location</option>
                  {locationsData.map((item, index) => {
                    return (
                      <option key={index + 1} value={item.location_id}>{`${
                        item.name
                      }, ${item.city}`}</option>
                    );
                  })}
                </select>
              </div>

              <div className="  position-relative col-sm-12 col-md-8 mt-3 ">
                <span className="fas fa-search search-icon" />

                <input
                  id="query"
                  className="form-control input-icon restaurantsinput"
                  placeholder="Search for restaurants"
                  onChange={this.handleChange}
                />
                {this.renderSuggestions()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Wallpaper);
