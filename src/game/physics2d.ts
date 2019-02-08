import * as Matter from 'matter-js';

export default class Physics2D {
    private engine: Matter.Engine;
    private categorys: Map<string, Matter.ICollisionFilter>;

    constructor() {
        this.engine = Matter.Engine.create();
        this.categorys = new Map([["default", {
            category: 1,
            mask: 0xFFFFFFFF,
            group: 0
        }]]);
    }

    public registerCategory(category: string, collisionFilter: Matter.ICollisionFilter): void {
        this.categorys[category] = collisionFilter;
    }

    public addBorder(x: number, y: number, w: number, h: number, frame: number, category: string = "default"): Matter.Composite {
        const bodies = [
            this.addBox(x - frame, y - frame, frame, h + frame * 2, true, category),
            this.addBox(x - frame, y - frame, w + frame * 2, frame, true, category),
            this.addBox(x + w, y - frame, frame, h + frame * 2, true, category),
            this.addBox(x - frame, y + h, w + frame * 2, frame, true, category),
        ];
        const border = Matter.Composite.create({ bodies });
        Matter.World.add(this.engine.world, border);
        return border;
    }

    public addCircle(x: number, y: number, r: number, isStatic: boolean, category: string = "default"): Matter.Body {
        const circle = Matter.Bodies.circle(x, y, r, {
            isStatic,
            collisionFilter: this.categorys[category]
        });
        this.add(circle);
        return circle;
    }

    public addBox(x: number, y: number, w: number, h: number, isStatic: boolean, category: string = "default"): Matter.Body {
        const box = Matter.Bodies.rectangle(x, y, w, h, {
            isStatic,
            collisionFilter: this.categorys[category]
        });
        this.add(box);
        return box;
    }

    public add(body: Matter.Composite | Matter.Body) {
        Matter.World.add(this.engine.world, body);
    }

    public remove(body: Matter.Composite | Matter.Body): void {
        Matter.World.remove(this.engine.world, body);
    }

    public update(dtime: number): void {
        Matter.Engine.update(this.engine, dtime);
    }
};