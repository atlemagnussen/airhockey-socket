class Draw {
    getDataFromObjects(objects) {
        let statics = [];
        for(let i = 0; i < objects.length; i++) {
            const o = objects[i];
            const s = {
                type: o.type,
                color: o.color,
            };
            if (o.fill)
                s.fill = true;
            switch (o.type) {
                case "edge":
                    this.edge(s, o);
                    break;
                case "circle":
                    this.circle(s, o);
                    break;
                default:
                    break;
            }
            statics.push(s);
        }
        return statics;
    }
    edge(s, o) {
        const shape = o.fixture.getShape();
        s.m_vertex1 = {
            x: shape.m_vertex1.x,
            y: shape.m_vertex1.y
        },
        s.m_vertex2 = {
            x: shape.m_vertex2.x,
            y: shape.m_vertex2.y
        };
    }
    circle(s, o) {
        const shape = o.fixture.getShape();
        s.r = shape.getRadius();
        s.pos = o.body.getPosition();
        s.selected = o.body.selected;
    }
    polygon(s, o) {
        const shape = o.getShape();
        s.pos = o.getBody().getPosition();
        s.firstVert = shape.getVertex(0);
        s.verts = [];
        for (let i = 0; i < shape.m_vertices.length; i++) {
            const vert = shape.getVertex(i);
            s.verts.push({
                x: vert.x,
                y: vert.y
            });
        }

    }
}
export default new Draw();