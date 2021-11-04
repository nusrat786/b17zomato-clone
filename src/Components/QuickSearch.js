import React from "react";
import "../Styles/home.css";
import QuickSearchItem from "./QuickSearchItem";

class QuickSearch extends React.Component {
  render() {
    const { quickSearchitemsData } = this.props;
    return (
      <div>
        <div className="container">
          <div className="mt-3 fs-2">Quick Searches</div>
          <div className="fs-5 text-muted">
            Discover restaurants by type of meal
          </div>

          <div className="row justify-content-between">
            {quickSearchitemsData.map((item, index) => {
              return <QuickSearchItem key={index} QSItemData={item} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default QuickSearch;
