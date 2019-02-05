import React, { Component } from 'react';
import HandlePoints from './handlePoints';
import './index.css';
import Route from './route';
import MyMap from './map'

const MAP_PROPS = {
    center: [55.76, 37.64],
    zoom: 10,
    controls: ['zoomControl'],
};

class RouteEdit extends Component {
    constructor (props) {
        super(props);
        this.r = new Route();
        this.mapCenter = [];
        this.mapCenterAddress = '';

        this.state = {
            items: [],
            coords: [],
        };

        this.addNewPoint = this.addNewPoint.bind(this);
        this.deletePoint = this.deletePoint.bind(this);
        this.reorderPoints = this.reorderPoints.bind(this);
        this.moveMap = this.moveMap.bind(this);
        this.movePoint = this.movePoint.bind(this);
    }

    addNewPoint (name) {

       this.r.addPoint(name, this.mapCenter, this.mapCenterAddress);
       this.setState({
           items: this.r.getAllNames(),
           coords: this.r.getAllCoords(),
       });
    }

    deletePoint (id) {
        if(window.confirm('Удалить точку "'+this.r.route[id].name+'"?')) {
            this.r.deletePoint(id);
            this.setState({
                items: this.r.getAllNames(),
                coords: this.r.getAllCoords(),
            });
        }
    }

    reorderPoints (startId, endId) {
        this.r.reorderPoint(startId, endId);
        this.setState({
            items: this.r.getAllNames(),
            coords: this.r.getAllCoords(),
        });
    }

    movePoint (pointId, newCoords, newAddress) {
        this.r.changePointCoords (pointId, newCoords, newAddress);
//        this.r.setPointAddress(pointId, newAddress);
        this.setState({
            items: this.r.getAllNames(),
            coords: this.r.getAllCoords(),
        });
    }

    moveMap (newCenter, address) {
        this.mapCenter = newCenter;
        this.mapCenterAddress = address;
    }

    render () {
        return (
            <div className={'main'}>
                <div className={"ControlBlock"}>
                    <HandlePoints
                        pointArr = {this.state.items}
                        addNewPoint = {this.addNewPoint}
                        deletePoint={this.deletePoint}
                        reorderPoint = {this.reorderPoints}
                    />
                </div>
                <div className={"MapContainer"}>
                    <MyMap
                        mapState = {MAP_PROPS}
                        pointsCoords = {this.state.coords}
                        pointNames = {this.state.items}
                        moveMap={this.moveMap}
                        movePoint = {this.movePoint}
                    />
                </div>
            </div>

        );
    }
}

export default RouteEdit;
