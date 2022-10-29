import React from "react";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import "./styles.scss";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
class BreadCrumb extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const {
      gobackurl,
      notactivetitle,
      notactivesecondtitle,
      activetitle,
      ...props
    } = this.props;
    return (
      <div className="common-breadcrumb">
        <ul>
          <li>
            <Link className="icon" to={gobackurl}>
              <ChevronLeftIcon />
            </Link>
          </li>
          <li>
            <Link to={gobackurl}>{notactivetitle}</Link>
          </li>
          <li>
            <Link to={gobackurl} className="slash">
              /
            </Link>
          </li>

          {notactivesecondtitle && notactivesecondtitle != "" ? (
            <>
              <li>
                <Link to={gobackurl}>{notactivesecondtitle}</Link>
              </li>
              <li>
                <Link to={gobackurl} className="slash">
                  /
                </Link>
              </li>
            </>
          ) : null}

          <li>
            <Link to={gobackurl} className="active">
              {activetitle}
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default BreadCrumb;
