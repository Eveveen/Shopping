import React, { Component } from 'react';
import Tree from './index';
import Loading from '../Loading/loading';
import './style/node.scss';
import intl from 'react-intl-universal';
import { Icon } from 'antd';
import $ from 'jquery';
import { sourceTypeEnum, segmentItemType } from '../../../data/enum';

class TreeNode extends Component {
    state = { "loading": false };
    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        $('.level').each(function () {
            const paddingLeft = (parseInt($(this).attr('data-level')) - 1) * 22;
            $(this).css('padding-left', paddingLeft);
        })
    }
    /**
     * expand function
     */
    onExpandNode = (treeNode, event) => {
        var _self = this;
        this.setState({ "loading": true });
        const { expandedKeys } = this.props;
        treeNode.isExpand = treeNode.isExpand ? false : true;
        if (!_self.contains(expandedKeys, treeNode.key) && treeNode.isExpand) {
            expandedKeys.push(treeNode.key);
        }
        if (!treeNode.isExpand) {
            _self.remove(expandedKeys, treeNode.key);
        }
        this.props.callExpandNode(treeNode, expandedKeys).then(function () {
            _self.setState({ "loading": false });
        });
    }
    /**
     * check function
     */
    onCheck = (treeNode, event) => {
        const { checkedKeys } = this.props;
        treeNode.isChecked = treeNode.isChecked ? false : true;
        if (!this.contains(checkedKeys, treeNode.key) && treeNode.isChecked) {
            checkedKeys.push(treeNode.key);
        }
        if (!treeNode.isChecked) {
            this.remove(checkedKeys, treeNode.key);
        }
        this.props.callCheckedNode(checkedKeys);
    }
    /**
     * choose function
     */
    onChoose = (treeNode, event) => {
        this.props.callChooseNode(treeNode.key);
    }

    preventRightClick = (event) => {
        event.preventDefault();
    }

    onRightClick = (treeNode, event) => {
        if (event.nativeEvent.button == 2) {
            this.props.callRightClick(treeNode, event.nativeEvent);
        }
    }
    /**
     * common JS function
     */
    contains = (arr, obj) => {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }
    remove = (arr, obj) => {
        var index = arr.indexOf(obj);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }
    render() {
        const { className, treeNode, expandedKeys, checkedKeys, chosenKey, canRightClick, canCheck, canClick, onDragStart, onClick, checked } = this.props;
        const { loading } = this.state;
        var checkBoxType = this.contains(checkedKeys, treeNode.key) ? "checked" : "";
        var checkBoxStyleName;
        switch (checkBoxType) {
            case "checked":
                checkBoxStyleName = "treenode-checkbox-checked";
                break;
            case "indeterminate":
                checkBoxStyleName = "treenode-checkbox-indeterminate";
                break;
            default:
                checkBoxStyleName = "";
                break;
        }
        /* not normal start */
        let lastDom = [];
        let title = treeNode.value || treeNode.value == 0 ? intl.get("numberFormat", { num: treeNode.value }) : "";
        lastDom.push(<span title={title}>{title}</span>);

        /* not normal end */

        let switcherDom = [];
        // if (treeNode.onlyShowDetail) {
        //     switcherDom.push(
        //         <span className={"treenode-switcher " + (this.contains(expandedKeys, treeNode.key) ? "treenode-switcher-open" : "treenode-switcher-close")} onClick={this.onExpandNode.bind(this, treeNode)}></span>
        //     );
        //     switcherDom.push(
        //         <span className="treenode-leaf"><div className="treenode-leaf-show"></div><div className="treenode-leaf-show"></div><div className="treenode-leaf-show"></div></span>
        //     )
        // } else {
        //     if (!treeNode.isLeaf) {
        //         switcherDom.push(
        //             <span className={"treenode-switcher " + (this.contains(expandedKeys, treeNode.key) ? "treenode-switcher-open" : "treenode-switcher-close")} onClick={this.onExpandNode.bind(this, treeNode)}></span>
        //         );
        //     } else {
        //         switcherDom.push(
        //             <span className="treenode-leaf"><div className="treenode-leaf-show"></div><div className="treenode-leaf-show"></div><div className="treenode-leaf-show"></div></span>
        //         )
        //     }
        // }
        if (!treeNode.isLeaf) {
            switcherDom.push(
                <span className={"treenode-switcher " + (this.contains(expandedKeys, treeNode.key) ? "treenode-switcher-open" : "treenode-switcher-close")} onClick={this.onExpandNode.bind(this, treeNode)}></span>
            );
        } else {
            switcherDom.push(
                <span className="treenode-leaf"><div className="treenode-leaf-show"></div><div className="treenode-leaf-show"></div><div className="treenode-leaf-show"></div></span>
            )
        }
        //(treeNode.sourceType == sourceTypeEnum.CAMPAIGN && treeNode.type == segmentItemType.FILE ? " treenode-row-acitve" : "") + 
        return (
            <li className={"treenode-row" + (checked ? " treenode-row-checked" : "")}>
                <div className={"treenode-content" + (chosenKey == treeNode.key ? " treenode-content-chosen" : "") + (treeNode.canDrag ? " treenode-canhover" : "") + (checked ? " treenode-content-checked" : "") + " level"} data-level={treeNode.level} draggable={treeNode.canDrag ? true : false} onClick={canClick ? this.onChoose.bind(this, treeNode) : null} onContextMenu={canRightClick ? this.preventRightClick : ""} onMouseDown={canRightClick ? this.onRightClick.bind(this, treeNode) : ""} onDragStart={onDragStart.bind(this, treeNode)} onClick={treeNode.canClick ? onClick.bind(this, treeNode) : null}>
                    <div className="treenode-name">
                        {loading ? <span className="treenode-switcher"><Loading /></span> : switcherDom}
                        {canCheck ? <span className="treenode-checkbox" onClick={this.onCheck.bind(this, treeNode)}>
                            <span className={"treenode-checkbox-inner " + checkBoxStyleName}></span>
                        </span> : ""}
                        <span className={"treenode-name-content" + (treeNode.onlyShowDetail ? " treenode-name-content-short" : "")}><span className="show-short" title={treeNode.title ? treeNode.title : ""}>{treeNode.title ? treeNode.title : ""}</span></span>
                    </div>
                    <div className="treenode-description">
                        <span className="treenode-description-content">{lastDom}</span>
                    </div>
                </div>
                {this.props.children}
            </li >
        );
    }
}

export default TreeNode;