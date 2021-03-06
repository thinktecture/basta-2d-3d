/**
 * As Example 6, with touch
 */
class Example7 {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;

    private _circleX: number;
    private _circleY: number;
    private _circleRadius: number;

    constructor(canvas: HTMLCanvasElement) {
        if (!canvas) {
            throw 'No canvas!';
        }

        this._canvas = canvas;
        this._width = canvas.width;
        this._height = canvas.height;
        this._context = <CanvasRenderingContext2D> canvas.getContext('2d');

        this.adjustForRetina();
        this.initializeCircleProperties();
        this.assignEvents();
    }

    private assignEvents(): void {
        var that = this;
        
        this._canvas.addEventListener('mousemove', function(event) {
            that.handleMouseMoveEvent(event);
        });
        
        this._canvas.addEventListener('touchstart', function(event) {
            // Prevent scrolling the page
            event.preventDefault();
        });
        
        this._canvas.addEventListener('touchmove', function(event) {
            that.handleTouchMoveEvent(<TouchEvent>event);
        });
    }
    
    /**
     * Returns the correct positions of an event (mouse/touch)
     * 
     * See: http://stackoverflow.com/a/10816667/959687
     */
    private getOffset(event: any): any {
        var el = event.target,
            x = 0,
            y = 0;

        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        x = event.clientX - x;
        y = event.clientY - y;

        return { x: x, y: y };
    }
    
    private handleMouseMoveEvent(e: MouseEvent): void {
        e.preventDefault();
        
        var position = this.getOffset(e);
        this._circleX = position.x;
        this._circleY = position.y;
    }
    
    private handleTouchMoveEvent(e: TouchEvent): void {
        // .touches is an array containing one or more touch points for multi-touch scenarios
        
        var position = this.getOffset(e.touches[0]);
        this._circleX = position.x;
        this._circleY = position.y;
    }
    
    private initializeCircleProperties(): void {
        // Points where the circle will be, so the gradient can be adjusted as well
        this._circleX = 50;
        this._circleY = 150;
        this._circleRadius = 50;
    }

    private adjustForRetina(): void {
        // Is the devicePixelRatio available? If yes, we use it for scaling the canvas.
        // Scaling is only needed, if the ratio is > 1
        if (!window.devicePixelRatio || window.devicePixelRatio <= 1) {
            return;
        }

        var scaleFactor = window.devicePixelRatio;
        
        // Set the CSS width and height to the original values
        this._canvas.style.width = this._width + 'px';
        this._canvas.style.height = this._height + 'px';
        
        // Set the canvas width and height scaled by the device pixel ratio
        this._canvas.width = this._width * scaleFactor;
        this._canvas.height = this._height * scaleFactor;
        
        // Scale the drawing context
        this._context.scale(scaleFactor, scaleFactor);
    }

    public draw(): void {
        // Save the canvas context, so we can set our own values
        this._context.save();
        
        // Create a linear gradient from black to white
        var gradient = this._context.createLinearGradient(this._circleX - this._circleRadius, this._circleY - this._circleRadius,
            this._circleX - this._circleRadius, this._circleY + this._circleRadius);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#FFFFFF');
        
        // Begin a new path (creates a new path stack)
        this._context.beginPath();
        
        // Draw the circle
        // Start from angle 0
        // End at angle 2 * Math.Pi (full circle)
        this._context.arc(this._circleX, this._circleY, this._circleRadius, 0, 2 * Math.PI);
        
        // Close the path
        this._context.closePath();
        
        // assign the gradient and fill the circle with it
        this._context.fillStyle = gradient;
        this._context.fill();
        
        this._context.restore();
    }

    public start(): void {
        // Save the reference, so we can use it inside the animation frame
        var that = this;

        var animationFrame = function(timestamp: number) {
            that._context.clearRect(0, 0, that._width, that._height);
            that.draw();
            
            // Request another frame
            // We have an infinite loop now
            window.requestAnimationFrame(animationFrame);
        }

        // Initial call to request a single animation frame        
        window.requestAnimationFrame(animationFrame);
    }
}