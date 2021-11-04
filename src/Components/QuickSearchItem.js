import React from "react";
import "../Styles/home.css";
import { withRouter } from "react-router-dom";

class QuickSearchItem extends React.Component {
  handleNavigate = (mealTypeId) => {
    const locationId = sessionStorage.getItem("locationId");
    if (locationId) {
      this.props.history.push(
        `/filter?mealtype=${mealTypeId} &location=${locationId}`
      );
    } else {
      this.props.history.push(`/filter?mealtype=${mealTypeId}`);
    }
  };
  render() {
    const { QSItemData, key } = this.props;
    return (
      <div
        key={key}
        className="col-lg-4 col-md-6 col-sm-12 mt-4"
        onClick={() => this.handleNavigate(QSItemData.meal_type)}
      >
        <div className="row item g-0">
          <div className="col-5">
            <img src={`./${QSItemData.image}`} alt=" " />
          </div>
          <div className="col-7 py-4 ps-3">
            <div className="item_heading">{QSItemData.name}</div>
            <div className="item_subheading pe-2">{QSItemData.content}</div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(QuickSearchItem);
