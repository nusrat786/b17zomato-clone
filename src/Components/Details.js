import React from "react";
import Modal from "react-modal";
import "../Styles/details.css";
import queryString from "query-string";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "antiquewhite",
    border: "1px solid brown",
  },
};

class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      resturant: {},
      restId: undefined,
      menuItems: [],
      itemsModalIsOpen: false,
      galleryModalIsOpen: false,
      formModalIsOpen: false,
      subTotal: 0,
      name: undefined,
      email: undefined,
      contact_number: undefined,
      address: undefined,
    };
  }

  componentDidMount() {
    const qs = queryString.parse(this.props.location.search);
    const { restaurant } = qs;
    axios({
      url: `https://peaceful-mesa-49989.herokuapp.com/restaurant/${restaurant}`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        this.setState({
          resturant: res.data.resturant,
          restId: restaurant,
        });
      })
      .catch();
  }

  handleOrder = () => {
    const { restId } = this.state;
    axios({
      url: `https://peaceful-mesa-49989.herokuapp.com/menuitems/${restId}`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        this.setState({
          menuItems: res.data.items,
          itemsModalIsOpen: true,
        });
      })
      .catch();
  };
  handleModal = (state, value) => {
    this.setState({ [state]: value });
  };

  addItems = (index, operationType) => {
    let total = 0;
    const items = [...this.state.menuItems];
    const item = items[index];

    if (operationType == "add") {
      item.qty += 1;
    } else {
      item.qty -= 1;
    }
    items[index] = item;
    items.map((item) => {
      total += item.qty * item.price;
    });
    this.setState({ menuItems: items, subTotal: total });
  };

  handleChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  };

  isDate(val) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === "[object Date]";
  }

  isObj = (val) => {
    return typeof val === "object";
  };

  stringifyValue = (val) => {
    if (this.isObj(val) && !this.isDate(val)) {
      return JSON.stringify(val);
    } else {
      return val;
    }
  };

  buildForm = ({ action, params }) => {
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", action);

    Object.keys(params).forEach((key) => {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", key);
      input.setAttribute("value", this.stringifyValue(params[key]));
      form.appendChild(input);
    });
    return form;
  };

  post = (details) => {
    const form = this.buildForm(details);
    document.body.appendChild(form);
    form.submit();
    form.remove();
  };

  getData = (data) => {
    return fetch(`https://peaceful-mesa-49989.herokuapp.com/payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  Payments = () => {
    const { subTotal, email } = this.state;

    const paymentObj = {
      amount: subTotal,
      email,
    };

    this.getData(paymentObj).then((response) => {
      var information = {
        action: "https://securegw-stage.paytm.in/order/process",
        params: response,
      };
      this.post(information);
    });
  };
  render() {
    const {
      resturant,
      itemsModalIsOpen,
      menuItems,
      galleryModalIsOpen,
      subTotal,
      formModalIsOpen,
    } = this.state;
    console.log(resturant);
    return (
      <div>
        <div>
          <img
            src={`./${resturant.image}`}
            alt="No data, Sorry for the Inconvinience"
            width="100%"
            height="350px"
          />

          <button
            className="button"
            onClick={() => this.handleModal("galleryModalIsOpen", true)}
          >
            Click to see Image Gallery
          </button>
        </div>
        <div className="detailsheading">{resturant.name}</div>
        <button className="btn-order" onClick={this.handleOrder}>
          Place Online Order
        </button>

        <div className="tabs">
          <div className="tab">
            <input type="radio" id="tab-1" name="tab-group-1" checked />
            <label for="tab-1">Overview</label>

            <div className="detailscontent">
              <div className="detailsabout">About this place</div>
              <div className="head">Cuisine</div>
              <div className="value">
                {resturant &&
                  resturant.cuisine &&
                  resturant.cuisine.map((item) => `${item.name}, `)}
              </div>
              <div className="head">Average Cost</div>
              <div className="value">
                &#8377; {resturant.min_price} for two people(approx)
              </div>
            </div>
          </div>

          <div className="tab">
            <input type="radio" id="tab-2" name="tab-group-1" />
            <label for="tab-2">Contact</label>
            <div className="detailscontent">
              <div className="head">Phone Number</div>
              <div className="value">{resturant.contact_number}</div>
              <div className="head">{resturant.name}</div>
              <div className="value">{`${resturant.locality}, ${
                resturant.city
              }`}</div>
            </div>
          </div>
        </div>

        <Modal isOpen={itemsModalIsOpen} style={customStyles}>
          <div>
            <div
              style={{ float: "right" }}
              className="fas fa-times"
              onClick={() => this.handleModal("itemsModalIsOpen", false)}
            />
            <div>
              <h3 className="restaurant-name">{resturant.name}</h3>
              <h3 className="item-total">SubTotal : {subTotal}</h3>
              <button
                className="btn btn-danger order-button"
                onClick={() => {
                  this.handleModal("itemsModalIsOpen", false);
                  this.handleModal("formModalIsOpen", true);
                }}
              >
                {" "}
                Pay Now
              </button>
              {menuItems.map((item, index) => {
                return (
                  <div
                    style={{
                      width: "44rem",
                      marginTop: "10px",
                      marginBottom: "10px",
                      borderBottom: "2px solid #dbd8d8",
                    }}
                  >
                    <div
                      className="card"
                      style={{ width: "43rem", margin: "auto" }}
                    >
                      <div
                        className="row"
                        style={{
                          paddingLeft: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        <div
                          className="col-xs-9 col-sm-9 col-md-9 col-lg-9 "
                          style={{
                            paddingLeft: "10px",
                            paddingBottom: "10px",
                          }}
                        >
                          <span className="card-body">
                            <h5 className="item-name">{item.name}</h5>
                            <h5 className="item-price">&#8377;{item.price}</h5>
                            <p className="item-descp">{item.description}</p>
                          </span>
                        </div>
                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                          <img
                            className="card-img-center title-img"
                            src={`../${item.image}`}
                            style={{
                              height: "75px",
                              width: "75px",
                              borderRadius: "20px",
                              marginTop: "30px",
                              marginLeft: "35px",
                            }}
                          />
                          {item.qty == 0 ? (
                            <div>
                              <button
                                className="add-button"
                                onClick={() => this.addItems(index, "add")}
                              >
                                Add
                              </button>
                            </div>
                          ) : (
                            <div className="add-number">
                              <button
                                onClick={() => this.addItems(index, "subtract")}
                              >
                                -
                              </button>
                              <span style={{ backgroundColor: "white" }}>
                                {item.qty}
                              </span>
                              <button
                                onClick={() => this.addItems(index, "add")}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div
                className="card"
                style={{
                  width: "44rem",
                  marginTop: "10px",
                  marginBottom: "10px",
                  margin: "auto",
                }}
              />
            </div>
          </div>
        </Modal>

        <Modal isOpen={galleryModalIsOpen} style={customStyles}>
          <div>
            <div
              style={{ float: "right" }}
              className="fas fa-times"
              onClick={() => this.handleModal("galleryModalIsOpen", false)}
            />
            <Carousel showThumbs={false} showIndicators={false}>
              {resturant &&
                resturant.thumb &&
                resturant.thumb.map((image) => {
                  return (
                    <div>
                      <img src={`./${image}`} height="400px" />
                    </div>
                  );
                })}
            </Carousel>
          </div>
        </Modal>

        <Modal isOpen={formModalIsOpen} style={customStyles}>
          <div>
            <div
              style={{ float: "right" }}
              className="fas fa-times"
              onClick={() => this.handleModal("formModalIsOpen", false)}
            />

            <h3>{resturant.name}</h3>
            <div>
              <label className="form-label">Name</label>
              <input
                style={{ width: "350px" }}
                className="form-control"
                type="text"
                placeholder="Enter Your Name"
                onChange={(event) => this.handleChange(event, "name")}
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                style={{ width: "350px" }}
                className="form-control"
                type="text"
                placeholder="Enter Your Email"
                onChange={(event) => this.handleChange(event, "email")}
              />
            </div>
            <div>
              <label className="form-label">Contact Number</label>
              <input
                style={{ width: "350px" }}
                className="form-control"
                type="tel"
                placeholder="Enter Your Number"
                onChange={(event) => this.handleChange(event, "contact_number")}
              />
            </div>
            <div>
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                placeholder="Enter Your Address"
                onChange={(event) => this.handleChange(event, "address")}
              />
            </div>
            <button
              className="btn btn-danger"
              style={{ float: "right", marginTop: "5px" }}
              onClick={this.Payments}
            >
              Proceed
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Details;
