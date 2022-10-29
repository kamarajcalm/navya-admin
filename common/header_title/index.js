import React from "react";
import "./styles.scss";

class HeaderTitle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, children, className, ...props } = this.props;
    return (
      <div className={`common-table-header ${className}`}>
        <div className="common-heading">
          <h2>{title}</h2>
        </div>
        {children}
      </div>
    );
  }
}

export default HeaderTitle;
