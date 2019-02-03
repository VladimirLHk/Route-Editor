import React, { Component } from 'react';
import './index.css';
import DnDList from './DnDContext';

class HandlePoints extends Component {
    constructor (props) {
        super(props);

        this.handleOkButton = this.handleOkButton.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.handleEnterInput = this.handleEnterInput.bind(this);
        this.onDragResult = this.onDragResult.bind(this);
    }

    handleEnterInput (e) {
        if (e.key === "Enter") this.handleOkButton();
    }

    handleOkButton () {

        let newName = this.refs.pointName.value.replace(/<\/?[a-z][a-z0-9]*>/i,'');
        if (newName !== '' ) {
            this.props.addNewPoint(newName);
            newName = '';
        }
        this.refs.pointName.value = "";

    }

    handleDeleteButton (e) {
        if (e.target.classList.contains('Del')){
            this.props.deletePoint(e.target.id.slice(3));
        }
    }

    onDragResult(result) {
        if (!result.destination) return;
        this.props.reorderPoint(result.source.index, result.destination.index);
    }

    render () {
        return (
            <div onClick={this.handleDeleteButton}>
                <div className={"pointName"}>
                    <input className={"Text"}
                           ref='pointName'
                           type={'text'}
                           placeholder={'Введите имя точки'}
                           onKeyUp={this.handleEnterInput}
                    />
                    <input type={'button'} value={'OK'} onClick={this.handleOkButton}/>
                </div>
                <DnDList className={"DnDBlock"}
                    pointList={this.props.pointArr}
                    onDragResult={this.onDragResult}
                />
            </div>
        );
    }

}

export default HandlePoints;
