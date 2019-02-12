import * as P2 from 'p2';

export interface IBodyOptions {
    collisionResponse: boolean;
    filter: string;
    mass: number;
    isStatic: boolean;
}

export interface ICollisionFilter {
    group: number;
    mask: number;
}

export default class Physics2D {
    public filters: Map<string, ICollisionFilter>;
    private world: P2.World;

    constructor() {
        this.filters = new Map([["default", {
            group: 1,
            mask: 0xFFFFFFFF
        }]]);
        this.world = new P2.World;
        this.world.gravity = [0, 0];
    }

    public registerFilter(filter: string, collisionFilter: ICollisionFilter): void {
        this.filters.set(filter, collisionFilter);
    }

    public getFilter(filter: string): ICollisionFilter {
        const collisionFilter = this.filters.get(filter);
        if (collisionFilter === undefined) {
            throw new Error("Physics2D not found filter");
        }
        return collisionFilter;
    }

    public addBorder(frame: number, x: number, y: number, w: number, h: number, options: IBodyOptions): P2.Body[] {
        const bodies = [
            this.addBox(x - frame, y - frame, frame, h + (frame * 2), options),
            this.addBox(x - frame, y - frame, w + (frame * 2), frame, options),
            this.addBox(w, y - frame, frame, h + (frame * 2), options),
            this.addBox(x - frame, h, w + (frame * 2), frame, options)
        ];
        return bodies;
    }

    public addCircle(x: number, y: number, r: number, options: IBodyOptions): P2.Body {
        const body = new P2.Body({
            mass: options.isStatic === true ? 0 : options.mass,
            position: [x + r, y + r]
        });
        const filter = this.getFilter(options.filter);
        const circle = new P2.Circle({
            collisionResponse: true,
            collisionGroup: filter.group,
            collisionMask: filter.mask,
            radius: r
        });
        body.collisionResponse = options.collisionResponse;
        body.gravityScale = -1;
        body.addShape(circle);
        this.add(body);
        return body;
    }

    public addBox(x: number, y: number, w: number, h: number, options: IBodyOptions): P2.Body {
        const body = new P2.Body({
            mass: options.isStatic === true ? 0 : options.mass,
            position: [x + w / 2, y + h / 2]
        });
        const filter = this.getFilter(options.filter);
        const box = new P2.Box({ width: w, height: h });
        box.collisionResponse = true;
        box.collisionGroup = filter.group;
        box.collisionMask = filter.mask;
        body.collisionResponse = options.collisionResponse;
        body.gravityScale = -1;
        body.addShape(box);
        this.add(body);
        return body;
    }

    public remove(body: P2.Body): void {
        this.world.removeBody(body);
    }

    public update(dtime: number): void {
        this.world.step(dtime);
    }

    public clear(): void {
        this.world.clear();
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const bodies = this.world.bodies;
        bodies.forEach(element => {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#999';
            ctx.translate(element.position[0], element.position[1]);
            element.shapes.forEach(shape => {
                this.drawShape(ctx, shape);
            });
            ctx.resetTransform();
            ctx.stroke();
        });
    }

    private add(body: P2.Body): void {
        this.world.addBody(body);
    }

    private drawShape(ctx: CanvasRenderingContext2D, shape: P2.Shape): void {
        switch (shape.type) {
            case P2.Shape.CIRCLE:
                {
                    const circle = shape as P2.Circle;
                    ctx.arc(circle.position[0], circle.position[1], circle.radius, 0, 2 * Math.PI);
                }
                return;
            case P2.Shape.CONVEX:
                {
                    const vertices = (shape as P2.Convex).vertices;
                    ctx.moveTo(vertices[0][0], vertices[0][1]);
                    for (let index = 1; index < vertices.length; index++) {
                        ctx.lineTo(vertices[index][0], vertices[index][1]);
                    }
                    ctx.lineTo(vertices[0][0], vertices[0][1]);
                }
                return;
            case P2.Shape.PARTICLE:
            case P2.Shape.PLANE:
            case P2.Shape.LINE:
            case P2.Shape.BOX:
            case P2.Shape.CAPSULE:
            case P2.Shape.HEIGHTFIELD:
                throw new Error("Physics2D not implements drawing " + shape.type);
        }
    }
};

export { P2 };