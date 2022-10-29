import React from "react";
import "./styles.scss";

class Card extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const { title, children, ...props } = this.props;
    return (
      <div className="common-card">
        <div className="common-card-title">
          <h3>{title}</h3>
        </div>
        <div className="common-card-body">{children}</div>
      </div>
    );
  }
}

export default Card;
