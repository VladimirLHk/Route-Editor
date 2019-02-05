import React, { Component } from 'react';
import './index.css';
import { withYMaps, YMaps, Map, Placemark, Polyline } from 'react-yandex-maps';

class Geocoder extends React.Component {
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this.props.setYMaps(this.props.ymaps);
    }

    componentWillUnmount() {this._isMounted = false; }

    render() { return null; }
}

const ConnectedGeocoder = withYMaps(Geocoder, true, ["geocode"]);

class MyMap extends Component {
    constructor (props) {
        super(props);
        this.mapState = this.props.mapState;
        this.state={points: this.props.pointsCoords.coords}
    }

    onBoundsChange = () => {
        let newMapCenter = this.map.getCenter();
        let moveMap = this.props.moveMap;
        moveMap(newMapCenter, "");
        this.ymaps.geocode(newMapCenter).then(function (res) {
            let address = res.geoObjects.get(0).getAddressLine();
            moveMap(newMapCenter, address);
            this.setState({center: newMapCenter});
        });
    };

    onPointMove = (e) => {
        let coords = e.get('target').geometry.getCoordinates();
        let pointNum = e.get('target').properties.get('pointId').substr(3);
        let movePoint = this.props.movePoint;
        movePoint(pointNum, coords, "");
        this.ymaps.geocode(coords).then(function (res) {
            let address = res.geoObjects.get(0).getAddressLine();
            movePoint(pointNum, coords, address);
        });
    };

    getMapRef = (node) => {this.map = node};

    setYMaps = (ymaps) => {
        this.ymaps = ymaps;
        this.onBoundsChange();
    };


    render () {
        let pointArr = this.props.pointsCoords;
        let totalPointNum = pointArr.length;
        let mapObjCollection = [];

        mapObjCollection = pointArr.map((point, index) => {
            return (<Placemark key={'Placemark'+index}
                        instanceRef={this.getPointRef}
                        onDragEnd ={this.onPointMove}
                        geometry={point.coords}
                        options={{
                            draggable: true,
                            hasBaloon: true,
                            hasHint: true,
                            hideIconOnBalloonOpen: true,
                        }}
                        properties={{
                            balloonContentBody: "Это точка '"+point.content+"'",
                            hintContent: point.address,
                            pointId: point.id,
                        }}
            />)
        });

        if (totalPointNum > 1) {
            let coordsCollection = pointArr.reduce((prev, item)=>{prev.push(item.coords); return prev}, []);
            mapObjCollection.push(
                <Polyline key={'Polyline'}
                          geometry={coordsCollection}
                          options={{
                              strokeColor: "#000000",
                              strokeWidth: 4,
                              strokeOpacity: 0.5
                          }}
                          properties={{
                              balloonContentBody: 'Вот Ваш маршрут',
                          }}
                />);
        }

        return (
            <div>
                <YMaps
                    className={"MapContainer"}
                    query={{
                        ns: 'use-load-option',
                        load:
                            'Map,Placemark,geoQuery,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon,geoObject.addon.hint',
                    }}
                >

                    <div className={"MapDiv"}>
                        <Map
                            state={this.mapState}
                            instanceRef={this.getMapRef}
                            onBoundsChange={this.onBoundsChange}
                            height="100%"
                            width="100%"
                        >
                            {mapObjCollection}
                            <ConnectedGeocoder
                                geocode={this.state.points}
                                setYMaps={this.setYMaps}
                            />
                        </Map>
                    </div>
                </YMaps>
            </div>
        );
    }
}

export default MyMap;
