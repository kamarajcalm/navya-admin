import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import "./styles.scss";

class FormModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const {
      isOpen,
      onClose,
      modalTitle,
      children,
      modalClass,
      ...props
    } = this.props;
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={modalClass !== '' ? `${modalClass} common-modal` : 'common-modal'}
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.isOpen}>
          <div className="paper">
            <div className="modal-header">
              <h3>{modalTitle ? modalTitle : '-'}</h3>
              <IconButton aria-label="close" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="modal-body">
             {children}
            </div>
          </div>
        </Fade>
      </Modal>
    );
  }
}

export default FormModal;
