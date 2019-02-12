import * as P2 from 'p2';

export interface IBodyOptions {
    collisionResponse: boolean;
    filter: string;
    material: string;
    gravityScale: number;
    isStatic: boolean;
    mass: number;
}

export interface ICollisionFilter {
    group: number;
    mask: number;
}

export default class Physics2D {
    private world: P2.World;
    private filters: Map<string, ICollisionFilter>;
    private materials: Map<string, P2.Material>;

    constructor() {
        this.filters = new Map([["default", {
            group: 1,
            mask: 0xFFFFFFFF
        }]]);
        this.materials = new Map;
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

    public registerMaterial(a: string, b: string, r: number): void {
        if (this.materials.has(a) === false) {
            this.materials.set(a, new P2.Material(0));
        }
        if (this.materials.has(b) === false) {
            this.materials.set(b, new P2.Material(0));
        }
        this.world.addContactMaterial(
            new P2.ContactMaterial(
                this.getMaterial(a),
                this.getMaterial(b),
                {
                    restitution: r,
                    stiffness: Number.MAX_VALUE
                }));
    }

    public getMaterial(material: string): P2.Material {
        const collisionMaterial = this.materials.get(material);
        if (collisionMaterial === undefined) {
            throw new Error("Physics2D not found filter");
        }
        return collisionMaterial;
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
            position: [x, y]
        });
        const filter = this.getFilter(options.filter);
        const circle = new P2.Circle({
            collisionResponse: true,
            collisionGroup: filter.group,
            collisionMask: filter.mask,
            radius: r
        });
        circle.material = this.getMaterial(options.material);
        body.addShape(circle);
        body.collisionResponse = options.collisionResponse;
        body.gravityScale = options.gravityScale;
        body.damping = 0;
        body.angularDamping = 0;
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
        box.material = this.getMaterial(options.material);
        body.addShape(box);
        body.collisionResponse = options.collisionResponse;
        body.gravityScale = options.gravityScale;
        body.damping = 0;
        body.angularDamping = 0;
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