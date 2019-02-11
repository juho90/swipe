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

    public addBorder(category: string = "default", x: number, y: number, w: number, h: number, frame: number): Matter.Composite {
        const bodies = [
            this.addBox(category, x - frame, y - frame, frame, h + (frame * 2), { isStatic: true }),
            this.addBox(category, x - frame, y - frame, w + (frame * 2), frame, { isStatic: true }),
            this.addBox(category, x + w, y - frame, frame, h + (frame * 2), { isStatic: true }),
            this.addBox(category, x - frame, y + h, w + (frame * 2), frame, { isStatic: true }),
        ];
        const border = Matter.Composite.create({ bodies });
        Matter.World.add(this.engine.world, border);
        return border;
    }

    public addCircle(category: string = "default", x: number, y: number, r: number, collisionFilter?: Matter.IChamferableBodyDefinition): Matter.Body {
        const circle = Matter.Bodies.circle(x, y, r, collisionFilter);
        circle.collisionFilter = this.categorys[category];
        this.add(circle);
        return circle;
    }

    public addBox(category: string = "default", x: number, y: number, w: number, h: number, collisionFilter?: Matter.IChamferableBodyDefinition): Matter.Body {
        const box = Matter.Bodies.rectangle(x, y, w, h, collisionFilter);
        box.collisionFilter = this.categorys[category];
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

    public clear(): void {
        Matter.Engine.clear(this.engine);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const bodies = Matter.Composite.allBodies(this.engine.world);
        ctx.beginPath();
        bodies.forEach(element => {
            const vertices = element.vertices;
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let index = 1; index < vertices.length; index++) {
                ctx.lineTo(vertices[index].x, vertices[index].y);
            }
            ctx.lineTo(vertices[0].x, vertices[0].y);
        });
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#999';
        ctx.stroke();
    }
};