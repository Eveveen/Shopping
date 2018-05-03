import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import './confirmModal.sass';
import intl from 'react-intl-universal';

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 10 },
        sm: { span: 10 },
    },
};

class ConfirmModal extends Component {
    state = {
        loading: false,
        confirmDirty: false,
    }

    handleCancel = () => {
        this.props.handleCancel();
    }

    render() {
        const { visible } = this.props;
        return (
            <div className="model-form">
                <Modal
                    title={"Confirm"}
                    visible={visible}
                    onCancel={this.handleCancel}
                    width={850}
                    destroyOnClose={true}
                    maskClosable={false}
                    footer={<div className="model-footer">
                        <Button type="primary" onClick={this.handleCancel} loading={this.state.loading}>
                            {"确认"}
                        </Button>
                        <Button onClick={this.handleCancel}>
                            {"取消"}
                        </Button>
                    </div>}
                >
                    body
                </Modal>
            </div >
        )
    }
}

export default ConfirmModal;