import React, { Component } from 'react';
import intl from 'react-intl-universal';
import Modal from 'react-modal';
import './tableModel.sass';
import { UiTable } from 'liveramp-ui-toolkit';

class TableModal extends Component {
    state = {
        selectedRows: [],
        selectAllChecked: false
    }

    componentDidUpdate() {
        if (this.props.selectedRows && this.props.isInitSelectedRows) {
            this.setState({
                selectedRows: this.props.selectedRows,
                selectAllChecked: this.props.selectedRows.length == this.props.elements.length,
                isInitSelectedRows: false
            })
            this.props.changeState();
        }
    }

    render() {
        const { elementKeyMap, columns, elements, showCheckboxes, selected, handleCheckboxChange } = this.props;
        return (
            <div className="table-main" style={this.props.style ? this.props.style : {}}>
                <UiTable
                    initialFetchComplete={true}
                    hideSearch={true}
                    hideFilters={true}
                    haveChildren={true}
                    hideDetail={true}
                    columnsToShow={columns}
                    columnOrder={columns}
                    elementKeyMap={elementKeyMap}
                    totalRows={elements.length}
                    elements={elements}
                    selectedRows={this.state.selectedRows}
                    hideScrollToTop={true}
                    showCheckboxes={true}
                    selectAllChecked={this.state.selectAllChecked}
                    handleCheckboxChange={this.handleCheckboxChange}
                    handleSelectAllChange={this.handleSelectAllChange}
                    showCheckboxes={showCheckboxes}
                    haveChildren={false}
                />
            </div>
        )
    }

    handleSelectAllChange = (id, checked) => {
        if (checked) {
            this.state.selectedRows = this.props.elements.map(function (item) {
                return item.id;
            });
            this.state.selectAllChecked = true;
        } else {
            this.state.selectedRows = [];
            this.state.selectAllChecked = false;
        }
        this.props.callbackList(this.state.selectedRows);
        this.setState({});
    }

    handleCheckboxChange = (id, checked) => {
        if (checked) {
            this.state.selectedRows.push(id);
        } else {
            var idx = this.state.selectedRows.indexOf(id);
            if (idx > -1) {
                this.state.selectedRows.splice(idx, 1);
            }
        }
        this.props.callbackList(this.state.selectedRows);
        if (this.state.selectedRows.length === this.props.elements.length) {
            this.setState({
                selectAllChecked: true
            });
        } else {
            this.setState({
                selectAllChecked: false
            });
        }
    }
}


export default TableModal;