import * as P2 from 'p2';

export interface IBodyOptions {
    collisionResponse: boolean;
    filter: string;
    gravityScale: number;
    isStatic: boolean;
    mass: number;
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
        body.gravityScale = options.gravityScale;
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
        body.gravityScale = options.gravityScale;
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

    private add(body: P2.Body): void {
        this.world.addBody(body);
    }
};

export { P2 };