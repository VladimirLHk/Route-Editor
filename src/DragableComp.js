import React from "react";
import ReactDOM from "react-dom";
import { withYMaps, YMaps, Map, Placemark } from "react-yandex-maps";

import "./styles.css";

class Geocoder extends React.Component {
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;

        this.props.ymaps.geocode(this.props.geocode).then(geocode => {
            if (this._isMounted === true) {
                this.props.onChange(geocode);
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return null;
    }
}

const ConnectedGeocoder = withYMaps(Geocoder, true, ["geocode"]);

class GeocoderWithRenderProp extends React.Component {
    _isMounted = false;

    state = { coords: [] };

    componentDidMount() {
        this._isMounted = true;

        this.props.ymaps.geocode(this.props.geocode).then(geocode => {
            if (this._isMounted === true) {
                const coords = [];

                geocode.geoObjects.each(geoObject => {
                    coords.push(geoObject.geometry.getCoordinates());
                });

                this.setState({ coords });
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return this.props.children(this.state);
    }
}

const ConnectedGeocoderWithRenderProp = withYMaps(
    GeocoderWithRenderProp,
    true,
    ["geocode"]
);

class App extends React.Component {
    map = null;

    onGeocoderChange = geocoder => {
        this.map.geoObjects.add(geocoder.geoObjects);
    };

    render() {
        return (
            <div className="App">
                <YMaps>
                    <Map
                        instanceRef={ref => (this.map = ref)}
                        defaultState={{ center: [55.75, 37.57], zoom: 4 }}
                    >
                        <ConnectedGeocoder
                            geocode={["Saint-Petersburg"]}
                            onChange={this.onGeocoderChange}
                        />
                        <ConnectedGeocoderWithRenderProp geocode={["Moscow"]}>
                            {({ coords }) =>
                                coords.map(geometry => (
                                    <Placemark key={geometry.toString()} geometry={geometry} />
                                ))
                            }
                        </ConnectedGeocoderWithRenderProp>
                    </Map>
                </YMaps>
            </div>
        );
    }
}

const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);
