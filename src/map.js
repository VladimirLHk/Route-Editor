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
        this.ymaps.geocode(newMapCenter).then(function (res) {
            let adress = res.geoObjects.get(0).getAddressLine();
            moveMap(newMapCenter, adress);
            this.setState({center: newMapCenter});
        });
    };

    onPointMove = (e) => {
        let coords = e.get('target').geometry.getCoordinates();
        let pointNum = e.get('target').properties.get('pointId').substr(3);
        let movePoint = this.props.movePoint;
        this.ymaps.geocode(coords).then(function (res) {
            let adress = res.geoObjects.get(0).getAddressLine();
            movePoint(pointNum, coords, adress);
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
                            hintContent: point.adress,
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

//событие при отпускании мыши с плейсмарка
// myPlacemark.events.add('dragend',
// function (e) {
// var coords = e.get('target').geometry.getCoordinates();
// ymaps.geocode(coords).then(function (res) {
// var first = res.geoObjects.get(0),
// name1 = first.properties.get('name');
// alert(name1);
// });
// });

/*
myPlacemark.properties.set('iconCaption', 'поиск...');
ymaps.geocode(coords).then(function (res) {
    var firstGeoObject = res.geoObjects.get(0);

    myPlacemark.properties
        .set({
            // Формируем строку с данными об объекте.
            iconCaption: [
                // Название населенного пункта или вышестоящее административно-территориальное образование.
                firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
            ].filter(Boolean).join(', '),
            // В качестве контента балуна задаем строку с адресом объекта.
            balloonContent: firstGeoObject.getAddressLine()
        });
});
*/