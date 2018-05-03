import React, { Component } from 'react';
import intl from 'react-intl-universal';
import Modal from 'react-modal';
import './confirmModal.sass';
import { Icon } from 'antd';
import 'antd/dist/antd.css';

class ConfirmModal extends Component {
    state = {
    }

    render() {
        const { isShowConfirmModal, closeConfirmModal, handleConfirm, body, hideConfirmButton } = this.props;
        return (
            <div>
                <Modal
                    isOpen={isShowConfirmModal}
                    className='confirm-modal-content'
                    overlayClassName='confirm-modal-overlay'
                >
                    <div className="confirm-modal-body">
                        <div className="cancel-confirm-modal">
                            <Icon type="close" style={{ fontSize: 20 }} onClick={closeConfirmModal} />
                        </div>
                        <div className="confirm-modal-title">
                            {intl.get("confirm")}
                        </div>
                        <div className="confirm-modal-text">
                            {body}
                        </div>
                        <div className="confirm-modal-footer">
                            <input type="button" value={intl.get("cancel")} className="button dark" onClick={closeConfirmModal} />
                            {!hideConfirmButton ? <input type="button" value={intl.get("confirm")} className="button" onClick={handleConfirm} /> : null}
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}


export default ConfirmModal;