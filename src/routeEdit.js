import React, { Component } from 'react';
import HandlePoints from './handlePoints';
import './index.css';
import Route from './route';
import MyMap from './map'

const MAP_PROPS = {
    center: [55.76, 37.64],
    zoom: 10,
    controls: ['zoomControl'],
}

class RouteEdit extends Component {
    constructor (props) {
        super(props);
        this.r = new Route();
        this.mapCenter = [];
        this.mapCenterAdress = '';

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

       this.r.addPoint(name, this.mapCenter, this.mapCenterAdress);
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

    movePoint (pointId, newCoords, newAdress) {
        this.r.changePointCoords (pointId, newCoords);
        this.r.setPointAdress(pointId, newAdress);
        this.setState({
            items: this.r.getAllNames(),
            coords: this.r.getAllCoords(),
        });
//        console.log('После изменения координат точки: ', this.state.coords);
    }

    moveMap (newCenter, adress) {
        this.mapCenter = newCenter;
        this.mapCenterAdress = adress;
//        console.log ('После изменения центра карты: ', this.mapCenter, this.mapCenterAdress);
    }

    render () {
        return (
            <div>
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
