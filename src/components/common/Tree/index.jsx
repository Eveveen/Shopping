import React, { Component } from 'react';
import TreeNode from './node';
import './style/main.scss';
import { contains } from '../../../data/tools';

class Tree extends Component {
    state = {
        expandedKeys: [],
        checkedKeys: []
    }
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(props) {
        const treeData = props.treeData;
        const { expandedKeys } = this.state;
        if (treeData) {
            let flag = false;
            treeData.map((item) => {
                if (item.children) {
                    flag = true;
                    if (item.isExpand && !contains(expandedKeys, item.id)) {
                        expandedKeys.push(item.id);
                    }
                }
            });
            this.setState({ expandedKeys: expandedKeys });
            //To determine whether the entire tree is reloaded
            if (!flag) {
                this.setState({ expandedKeys: [], checkedKeys: [] });
            }
        }
    }

    /**
     * child callback function at expand
     */
    onCallExpandNode = (treeNode, expandedKeys) => {
        var _self = this;
        return new Promise((resolve) => {
            this.props.callExpandNode(treeNode).then(function (treeNode) {
                _self.setState({ expandedKeys: expandedKeys });
                resolve();
            });
        });
    }
    /**
     * child callback function at checked
     */
    onCallCheckedNode = (checkedKeys) => {
        this.setState({ checkedKeys: checkedKeys });
    }
    /**
     * child callback function at choose node
     */
    onCallChooseNode = (chosenKey) => {
        this.setState({ chosenKey: chosenKey });
    }
    /**
     * 右击点击事件
     */
    onCallRightClick = (treeNode, nativeEvent) => {
        this.props.callRightClick(treeNode, nativeEvent);
        this.setState({ chosenKey: treeNode.key });
    }

    onCallGragStart = (treeNode, nativeEvent) => {
        this.props.callDragStart(treeNode);
    }

    onCallClick = (treeNode, nativeEvent) => {
        if (nativeEvent.target.className.indexOf('treenode-switcher') == -1) {
            this.props.callClick(treeNode);
        }
    }

    /**
     * render treenode
     */
    renderTreeNodes = (treeData) => {
        const { expandedKeys, checkedKeys, chosenKey } = this.state;
        const { canRightClick, canCheck, canClick, checkedId } = this.props;
        //callLookalikeReady is for current project, not normal
        return treeData.map((treeNode, index) => {
            if (treeNode.id) {
                treeNode.key = treeNode.id;
                if (treeNode.children) {
                    if (treeNode.isExpand) {
                        return (
                            <TreeNode key={treeNode.id} checked={treeNode.id == checkedId} level={treeNode} canCheck={canCheck} canClick={canClick} treeNode={treeNode} expandedKeys={expandedKeys} checkedKeys={checkedKeys} chosenKey={chosenKey} callExpandNode={this.onCallExpandNode} callCheckedNode={this.onCallCheckedNode} callChooseNode={this.onCallChooseNode} canRightClick={canRightClick} callRightClick={this.onCallRightClick} onDragStart={this.onCallGragStart} onClick={this.onCallClick}>
                                <ul>
                                    {this.renderTreeNodes(treeNode.children)}
                                </ul>
                            </TreeNode >
                        )
                    } else {
                        return (
                            <TreeNode key={treeNode.id} checked={treeNode.id == checkedId} canCheck={canCheck} canClick={canClick} treeNode={treeNode} expandedKeys={expandedKeys} checkedKeys={checkedKeys} chosenKey={chosenKey} callExpandNode={this.onCallExpandNode} callCheckedNode={this.onCallCheckedNode} callChooseNode={this.onCallChooseNode} canRightClick={canRightClick} onDragStart={this.onCallGragStart} onClick={this.onCallClick}>
                            </TreeNode >
                        )
                    }

                } else {
                    return <TreeNode key={treeNode.id} checked={treeNode.id == checkedId} canCheck={canCheck} canClick={canClick} treeNode={treeNode} expandedKeys={expandedKeys} checkedKeys={checkedKeys} chosenKey={chosenKey} callExpandNode={this.onCallExpandNode} callCheckedNode={this.onCallCheckedNode} callChooseNode={this.onCallChooseNode} canRightClick={canRightClick} onDragStart={this.onCallGragStart} onClick={this.onCallClick} />;
                }
            }
        })
    }
    render() {
        const { style, treeData } = this.props;
        return (
            <div className="tree-main">
                <ul style={style}>
                    {treeData && treeData.length > 0 ? this.renderTreeNodes(treeData) : ''}
                </ul>
            </div>
        );
    }
}

export default Tree;