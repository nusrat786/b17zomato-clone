import React from "react";
import axios from "axios";
import queryString from "query-string";
import "../Styles/filter.css";

class Filter extends React.Component {
  constructor() {
    super();
    this.state = {
      resturants: [],
      pageCount: [],
      locations: [],
      mealtype: undefined,
      location: undefined,
      cuisine: [],
      sort: undefined,
      lcost: undefined,
      hcost: undefined,
      page: 1,
      cuisines: [
        { name: "North Indian", id: 1, checked: false },
        { name: "South Indian", id: 2, checked: false },
        { name: "Chinese", id: 3, checked: false },
        { name: "Fast Food", id: 4, checked: false },
        { name: "Street Food", id: 5, checked: false },
      ],

      cost: [
        { name: "Less than ₹500", id: 1, lcost: 1, hcost: 500, checked: false },
        {
          name: "₹500 to ₹1000",
          id: 2,
          lcost: 500,
          hcost: 1000,
          checked: false,
        },
        {
          name: "₹1000 to ₹1500",
          id: 3,
          lcost: 1000,
          hcost: 1500,
          checked: false,
        },
        {
          name: "₹1500 to ₹2000",
          id: 4,
          lcost: 1500,
          hcost: 2000,
          checked: false,
        },
        {
          name: "₹2000+",
          id: 5,
          lcost: 2000,
          hcost: 50000,
          checked: false,
        },
      ],
      mealname: "",
    };
  }
  componentDidMount() {
    const qs = queryString.parse(this.props.location.search);
    let { mealtype, location, cuisine, sort, lcost, hcost, page } = qs;
    cuisine = cuisine ? JSON.parse(cuisine) : [];
    if (!mealtype) mealtype = 1;
    if (lcost) lcost = parseInt(lcost);
    if (hcost) hcost = parseInt(hcost);
    page = page ? parseInt(page) : 1;

    this.getLocations();
    this.getMealType(mealtype);
    this.updateCuisines(cuisine);
    this.updateCost(lcost, hcost);

    this.setState(
      {
        mealtype,
        location,
        cuisine,
        sort,
        lcost,
        hcost,
        page,
      },
      this.getdata
    );
  }

  handleLocationChange = (event) => {
    const location = event.target.value;
    this.setState({ location }, this.getdata);
  };

  handleSortChange = (sort) => {
    this.setState({ sort }, this.getdata);
  };

  handleCostChange = (lcost, hcost) => {
    this.setState({ lcost, hcost }, this.getdata);
    this.updateCost(lcost, hcost);
  };

  handlePageChange = (page) => {
    this.setState({ page }, this.getdata);
  };

  handlePageNav = (count) => {
    let { page, pageCount } = this.state;
    page = page + count;
    if (page < 1) return;
    if (page > pageCount.length) return;
    this.handlePageChange(page);
  };

  getLocations = async () => {
    const { data } = await axios.get(
      "https://peaceful-mesa-49989.herokuapp.com/locations"
    );
    this.setState({ locations: data.locations });
  };

  getMealType = async (mealtypeId) => {
    const { data } = await axios.get(
      "https://peaceful-mesa-49989.herokuapp.com/mealtypes"
    );
    let meal = data.mealtypes.find((x) => x.meal_type === parseInt(mealtypeId));
    this.setState({ mealname: meal ? meal.name : "N/A" });
  };

  getdata = async () => {
    const {
      mealtype,
      location,
      cuisine,
      page,
      sort,
      lcost,
      hcost,
    } = this.state;

    const filterObj = {
      mealtype: mealtype,
      location: location,
      cuisine: cuisine && cuisine.length > 0 ? cuisine : undefined,
      sort,
      lcost,
      hcost,
      page,
    };

    const url = "https://peaceful-mesa-49989.herokuapp.com/filter";
    const { data } = await axios.post(url, filterObj);

    this.setState({
      resturants: data.Resturants,
      pageCount: data.pageCount,
    });

    let p = `/filter?mealtype=${mealtype || ""}&location=${location ||
      ""}&sort=${sort || 1}&cuisine=${JSON.stringify(cuisine)}&lcost=${lcost ||
      ""}&hcost=${hcost || ""}&page=${page}`;
    this.props.history.push(p);
  };

  updateCost = (lcost, hcost) => {
    let { cost } = this.state;
    for (let i = 0; i < cost.length; i++) {
      cost[i].checked =
        cost[i].lcost == lcost && cost[i].hcost == hcost ? true : false;
    }
    this.setState({ cost });
  };

  updateCuisines = (cuisine) => {
    let { cuisines } = this.state;
    for (let i = 0; i < cuisines.length; i++) {
      cuisines[i].checked = cuisine.includes(cuisines[i].id) ? true : false;
    }
    this.setState({ cuisines });
  };

  handleCuisineChange = async (cuisineId) => {
    let { cuisine } = this.state;
    const index = cuisine.indexOf(cuisineId);
    if (index >= 0) {
      cuisine.splice(index, 1);
    } else {
      cuisine.push(cuisineId);
    }
    this.updateCuisines(cuisine);
    this.setState({ cuisine }, this.getdata);
  };

  handleNavigate = (resId) => {
    this.props.history.push(`/details?restaurant=${resId}`);
  };

  render() {
    const {
      resturants,
      pageCount,
      locations,
      location,
      sort,
      mealname,
      page,
    } = this.state;
    return (
      <div className="main_content">
        <div className="filterheading">{mealname} Places in Mumbai</div>

        <div style={{ display: "inline-block", width: "30%" }}>
          <div className="filter_block">
            <div className="filters">Filters</div>
            <div className="item_list">
              <div className="location">Select Location</div>
              <div style={{ textAlign: "left" }}>
                <select
                  className="location-select"
                  value={location}
                  onChange={this.handleLocationChange}
                  style={{ fontFamily: "poppins" }}
                >
                  <option value="">Select location</option>
                  {locations.map((item) => {
                    return (
                      <option key={item._id} value={item.location_id}>{`${
                        item.name
                      }, ${item.city}`}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="item_list">
              <div className="cuisine">Cuisine</div>
              {this.state.cuisines.map((cus) => (
                <div className="cuisine-types" key={cus.name}>
                  <input
                    onChange={(e) => this.handleCuisineChange(cus.id)}
                    type="checkbox"
                    checked={cus.checked}
                  />
                  <label>{cus.name}</label>
                </div>
              ))}
            </div>

            <div className="item_list">
              <div className="cost">Cost For Two</div>
              {this.state.cost.map((cost) => (
                <div className="item_cost">
                  <input
                    type="radio"
                    name="cost"
                    checked={cost.checked}
                    onChange={(e) =>
                      this.handleCostChange(cost.lcost, cost.hcost)
                    }
                  />
                  <span>{cost.name}</span>
                </div>
              ))}
            </div>

            <div className="item_list">
              <div className="sort">Sort</div>
              <div className="sort_item">
                <input
                  type="radio"
                  name="sort"
                  checked={sort > 0}
                  onChange={() => this.handleSortChange(1)}
                />
                <span>Price low to high</span>
              </div>
              <div className="sort_item">
                <input
                  type="radio"
                  name="sort"
                  checked={sort < 0}
                  onChange={() => this.handleSortChange(-1)}
                />
                <span>Price high to low</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "inline-block",
            width: "65%",
            verticalAlign: "top",
          }}
        >
          {resturants && resturants.length > 0 ? (
            resturants.map((item) => {
              return (
                <div
                  className="filteritem"
                  onClick={() => this.handleNavigate(item._id)}
                >
                  <div className="item1">
                    <img src={`./${item.image}`} alt=" " />
                  </div>

                  <div className="item2">
                    <div className="item_heading">{item.name}</div>
                    <div className="item_subheading">{item.locality}</div>
                    <div className="item_info">{item.city}</div>
                  </div>

                  <hr />

                  <div className="item3">
                    <div className="item_subheading">CUISINES:</div>
                    <div className="item_subheading">COST FOR TWO:</div>
                  </div>

                  <div className="item4">
                    <div className="item_subheading">
                      {item.cuisine.map((cuisine) => `${cuisine.name}, `)}
                    </div>
                    <div className="item_info">&#x20B9;{item.min_price}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-records">No Records Found....</div>
          )}

          {resturants && resturants.length > 0 ? (
            <div className="pagination_part">
              <div
                className="pagination_item"
                onClick={() => this.handlePageNav(-1)}
              >
                &laquo;
              </div>
              {pageCount.map((p) => {
                return (
                  <div
                    style={{ backgroundColor: p === page ? "blue" : "white" }}
                    className="pagination_item"
                    onClick={() => this.handlePageChange(p)}
                  >
                    {p}
                  </div>
                );
              })}

              <div
                className="pagination_item"
                onClick={() => this.handlePageNav(1)}
              >
                &raquo;
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Filter;
