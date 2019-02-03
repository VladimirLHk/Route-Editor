class Route {
    constructor () {
        //массив объектов, описывающих маршрут
        this.route = [];

    }

    //добавление новой точки маршрута
    addPoint (name, coords, adress) {
        let newPoint = {
            name: name,
            coords: coords,
        };
        if (adress) newPoint.adress = adress;
        this.route.push(newPoint);
    }

    //удаление точки
    deletePoint (pointId) {
        if (this.isPointIdInRoute(pointId)) this.route.splice(pointId,1);
    }

    //изменение координат точки
    changePointCoords (pointId, newCoords) {
        if (this.isPointIdInRoute(pointId)) this.route[pointId].coords = newCoords;
    }

    //передвинуть точку с номером startId так, чтобы в итоге она встала на место с номером endId
    reorderPoint(startId, endId) {
        if (this.isPointIdInRoute(startId) && this.isPointIdInRoute(endId)) {
            const [removed] = this.route.splice(startId, 1);
            this.route.splice(endId, 0, removed);
        }
    }


    getAllNames() {
        let names = [];
        if (this.route.length) {
            let modelLength = this.route.length;
            for (let i=0; i<modelLength; i++)
                names.push({
                    content: this.route[i].name,
                    id: 'it-'+i,
                });
        }

        return names;
    }

    getAllCoords() {
        let names = this.getAllNames();
        return names.map((item, index) => {
            item.coords = this.route[index].coords;
            if (this.route[index].adress) item.adress = this.route[index].adress;
            return item
        });
//        return res;
    }

    //присвоение адреса точке с номером pointId
    setPointAdress (pointId, pointAdress) {
        if (this.isPointIdInRoute(pointId)) this.route[pointId].adress = pointAdress;
    }

    //находится ли номер точки в пределах текущего количества точек в маршруте
    isPointIdInRoute (pointId) { return pointId<this.route.length}

}

export default Route;