// Canvas 2D API - Web Standard Implementation
// Based on MDN Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

(() => {
    // Lazy access to Deno.core.ops (supports both Deno and __getDeno())
    const getCore = () => {
        if (typeof Deno !== 'undefined') {
            return Deno.core.ops;
        } else if (typeof __getDeno === 'function') {
            return __getDeno().core.ops;
        } else if (typeof globalThis.Deno !== 'undefined') {
            return globalThis.Deno.core.ops;
        }
        throw new Error('[Canvas] Cannot access Deno.core.ops');
    };

    /**
     * CanvasRenderingContext2D - 2D Rendering Context
     * Implements Web standard Canvas 2D API
     */
    class CanvasRenderingContext2D {
        #id;
        #canvas;
        #fillStyle = "#000000";
        #strokeStyle = "#000000";
        #lineWidth = 1;
        #globalAlpha = 1.0;
        #lineCap = "butt";
        #lineJoin = "miter";
        #miterLimit = 10;
        #font = "10px sans-serif";
        #textAlign = "start";
        #textBaseline = "alphabetic";
        #lineDash = [];
        #lineDashOffset = 0;

        constructor(canvasId, canvas) {
            this.#id = canvasId;
            this.#canvas = canvas;
        }

        // Rectangle drawing methods

        /**
         * Draw a filled rectangle
         */
        fillRect(x, y, width, height) {
            getCore().op_ctx2d_fill_rect(this.#id, x, y, width, height);
        }

        /**
         * Draw a stroked rectangle
         */
        strokeRect(x, y, width, height) {
            getCore().op_ctx2d_stroke_rect(this.#id, x, y, width, height);
        }

        /**
         * Clear a rectangle area
         */
        clearRect(x, y, width, height) {
            getCore().op_ctx2d_clear_rect(this.#id, x, y, width, height);
        }

        // Style properties

        /**
         * Fill style (CSS color)
         * Examples: "#FF0000", "rgb(255,0,0)", "red", "rgba(255,0,0,0.5)"
         */
        get fillStyle() {
            return this.#fillStyle;
        }

        set fillStyle(value) {
            const style = String(value);
            this.#fillStyle = style;
            getCore().op_ctx2d_set_fill_style(this.#id, style);
        }

        /**
         * Stroke style (CSS color)
         */
        get strokeStyle() {
            return this.#strokeStyle;
        }

        set strokeStyle(value) {
            const style = String(value);
            this.#strokeStyle = style;
            getCore().op_ctx2d_set_stroke_style(this.#id, style);
        }

        /**
         * Line width
         */
        get lineWidth() {
            return this.#lineWidth;
        }

        set lineWidth(value) {
            const width = Number(value);
            if (width > 0 && !isNaN(width)) {
                this.#lineWidth = width;
                getCore().op_ctx2d_set_line_width(this.#id, width);
            }
        }

        // Other style properties (stub)

        get globalAlpha() {
            return this.#globalAlpha;
        }

        set globalAlpha(value) {
            const alpha = Number(value);
            if (alpha >= 0 && alpha <= 1 && !isNaN(alpha)) {
                this.#globalAlpha = alpha;
                getCore().op_ctx2d_set_global_alpha(this.#id, alpha);
            }
        }

        get lineCap() {
            return this.#lineCap;
        }

        set lineCap(value) {
            if (["butt", "round", "square"].includes(value)) {
                this.#lineCap = value;
                // TODO: Call Rust op
            }
        }

        get lineJoin() {
            return this.#lineJoin;
        }

        set lineJoin(value) {
            if (["round", "bevel", "miter"].includes(value)) {
                this.#lineJoin = value;
                // TODO: Call Rust op
            }
        }

        get miterLimit() {
            return this.#miterLimit;
        }

        set miterLimit(value) {
            const limit = Number(value);
            if (limit > 0 && !isNaN(limit)) {
                this.#miterLimit = limit;
                // TODO: Call Rust op
            }
        }

        get font() {
            return this.#font;
        }

        set font(value) {
            this.#font = String(value);
            // TODO: Call Rust op
        }

        get textAlign() {
            return this.#textAlign;
        }

        set textAlign(value) {
            if (["start", "end", "left", "right", "center"].includes(value)) {
                this.#textAlign = value;
                // TODO: Call Rust op
            }
        }

        get textBaseline() {
            return this.#textBaseline;
        }

        set textBaseline(value) {
            if (["top", "hanging", "middle", "alphabetic", "ideographic", "bottom"].includes(value)) {
                this.#textBaseline = value;
                // TODO: Call Rust op
            }
        }

        // Line dash properties

        /**
         * Set line dash pattern
         * @param {Array<number>} segments - Array of alternating line and gap lengths
         */
        setLineDash(segments) {
            if (!Array.isArray(segments)) {
                throw new TypeError("setLineDash() argument must be an array");
            }

            // Filter out negative numbers and convert to array
            const validSegments = segments.filter(x => typeof x === 'number' && x >= 0 && !isNaN(x));
            this.#lineDash = validSegments;
            getCore().op_ctx2d_set_line_dash(this.#id, validSegments);
        }

        /**
         * Get line dash pattern
         * @returns {Array<number>} Array of alternating line and gap lengths
         */
        getLineDash() {
            this.#lineDash = getCore().op_ctx2d_get_line_dash(this.#id);
            return [...this.#lineDash];
        }

        /**
         * Line dash offset
         */
        get lineDashOffset() {
            return this.#lineDashOffset;
        }

        set lineDashOffset(value) {
            const offset = Number(value);
            if (!isNaN(offset)) {
                this.#lineDashOffset = offset;
                getCore().op_ctx2d_set_line_dash_offset(this.#id, offset);
            }
        }

        // Read-only properties

        /**
         * Get associated Canvas
         */
        get canvas() {
            return this.#canvas;
        }

        // Path drawing methods

        /**
         * Start a new path
         */
        beginPath() {
            getCore().op_ctx2d_begin_path(this.#id);
        }

        /**
         * Close the current path
         */
        closePath() {
            getCore().op_ctx2d_close_path(this.#id);
        }

        /**
         * Move the path to a specified point
         */
        moveTo(x, y) {
            getCore().op_ctx2d_move_to(this.#id, x, y);
        }

        /**
         * Draw a line to a specified point
         */
        lineTo(x, y) {
            getCore().op_ctx2d_line_to(this.#id, x, y);
        }

        /**
         * Draw an arc
         */
        arc(x, y, radius, startAngle, endAngle, anticlockwise = false) {
            getCore().op_ctx2d_arc(this.#id, x, y, radius, startAngle, endAngle, anticlockwise);
        }

        /**
         * Draw an arc connecting two tangent lines (not yet implemented)
         */
        arcTo(x1, y1, x2, y2, radius) {
            console.warn("[Canvas] arcTo() not yet implemented");
        }

        /**
         * Draw a cubic Bezier curve
         */
        bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
            getCore().op_ctx2d_bezier_curve_to(this.#id, cp1x, cp1y, cp2x, cp2y, x, y);
        }

        /**
         * Draw a quadratic Bezier curve
         */
        quadraticCurveTo(cpx, cpy, x, y) {
            getCore().op_ctx2d_quadratic_curve_to(this.#id, cpx, cpy, x, y);
        }

        /**
         * Add a rectangle to the current path
         */
        rect(x, y, width, height) {
            this.moveTo(x, y);
            this.lineTo(x + width, y);
            this.lineTo(x + width, y + height);
            this.lineTo(x, y + height);
            this.closePath();
        }

        /**
         * Fill the current path
         */
        fill(fillRule = "nonzero") {
            getCore().op_ctx2d_fill(this.#id);
        }

        /**
         * Stroke the current path
         */
        stroke() {
            getCore().op_ctx2d_stroke(this.#id);
        }

        /**
         * Clip to the current path
         * @param {string} fillRule - Fill rule (currently ignored, always uses "nonzero")
         */
        clip(fillRule = "nonzero") {
            getCore().op_ctx2d_clip(this.#id);
        }

        /**
         * Check if point is in path (not yet implemented)
         */
        isPointInPath(x, y, fillRule = "nonzero") {
            console.warn("[Canvas] isPointInPath() not yet implemented");
            return false;
        }

        /**
         * Check if point is in stroke (not yet implemented)
         */
        isPointInStroke(x, y) {
            console.warn("[Canvas] isPointInStroke() not yet implemented");
            return false;
        }

        // Text drawing methods (stub)

        fillText(text, x, y, maxWidth) {
            console.warn("fillText() not yet implemented");
        }

        strokeText(text, x, y, maxWidth) {
            console.warn("strokeText() not yet implemented");
        }

        measureText(text) {
            console.warn("measureText() not yet implemented");
            return { width: 0 };
        }

        // Transform methods

        /**
         * Save the current drawing state
         */
        save() {
            getCore().op_ctx2d_save(this.#id);
        }

        /**
         * Restore the previously saved state
         */
        restore() {
            getCore().op_ctx2d_restore(this.#id);
        }

        /**
         * Translate the coordinate system
         */
        translate(x, y) {
            getCore().op_ctx2d_translate(this.#id, x, y);
        }

        /**
         * Rotate the coordinate system
         * @param {number} angle - Angle in radians
         */
        rotate(angle) {
            getCore().op_ctx2d_rotate(this.#id, angle);
        }

        /**
         * Scale the coordinate system
         */
        scale(x, y) {
            getCore().op_ctx2d_scale(this.#id, x, y);
        }

        /**
         * Apply a transformation matrix (not yet implemented)
         */
        transform(a, b, c, d, e, f) {
            console.warn("[Canvas] transform() not yet implemented");
        }

        /**
         * Set the transformation matrix
         */
        setTransform(a, b, c, d, e, f) {
            getCore().op_ctx2d_set_transform(this.#id, a, b, c, d, e, f);
        }

        /**
         * Reset the transformation matrix to identity
         */
        resetTransform() {
            getCore().op_ctx2d_reset_transform(this.#id);
        }

        // Image drawing methods

        /**
         * Draw an image onto the canvas
         * @param {Image} image - The image to draw
         * @param {...number} args - Position and size arguments
         *
         * Three forms:
         * - drawImage(image, dx, dy)
         * - drawImage(image, dx, dy, dWidth, dHeight)
         * - drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
         */
        drawImage(image, ...args) {
            if (!image || !image._imageId) {
                throw new Error("Invalid image object");
            }

            const imageId = image._imageId;
            const imgWidth = image.width;
            const imgHeight = image.height;

            let sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight;

            if (args.length === 2) {
                // drawImage(image, dx, dy)
                sx = 0;
                sy = 0;
                sWidth = imgWidth;
                sHeight = imgHeight;
                dx = args[0];
                dy = args[1];
                dWidth = imgWidth;
                dHeight = imgHeight;
            } else if (args.length === 4) {
                // drawImage(image, dx, dy, dWidth, dHeight)
                sx = 0;
                sy = 0;
                sWidth = imgWidth;
                sHeight = imgHeight;
                dx = args[0];
                dy = args[1];
                dWidth = args[2];
                dHeight = args[3];
            } else if (args.length === 8) {
                // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                sx = args[0];
                sy = args[1];
                sWidth = args[2];
                sHeight = args[3];
                dx = args[4];
                dy = args[5];
                dWidth = args[6];
                dHeight = args[7];
            } else {
                throw new Error("Invalid number of arguments for drawImage");
            }

            getCore().op_ctx2d_draw_image(
                this.#id,
                imageId,
                sx, sy, sWidth, sHeight,
                dx, dy, dWidth, dHeight
            );
        }

        // Pixel manipulation methods

        /**
         * Create a new ImageData object
         * @param {number} width - Width of the image data
         * @param {number} height - Height of the image data
         * @returns {ImageData} New ImageData object
         */
        createImageData(width, height) {
            if (typeof width !== 'number' || typeof height !== 'number') {
                throw new TypeError("createImageData() arguments must be numbers");
            }
            if (width <= 0 || height <= 0) {
                throw new RangeError("createImageData() arguments must be positive");
            }

            const data = new Uint8ClampedArray(width * height * 4);
            // Use global ImageData constructor
            if (typeof ImageData !== 'undefined') {
                return new ImageData(data, width, height);
            }
            // Fallback: return ImageData-like object
            return {
                data: data,
                width: width,
                height: height
            };
        }

        /**
         * Get pixel data from a rectangle on the canvas
         * @param {number} sx - Source X position
         * @param {number} sy - Source Y position
         * @param {number} sw - Source width
         * @param {number} sh - Source height
         * @returns {ImageData} ImageData object containing the pixel data
         */
        getImageData(sx, sy, sw, sh) {
            if (sw === 0 || sh === 0) {
                throw new Error("getImageData() width and height must be non-zero");
            }

            const buffer = getCore().op_ctx2d_get_image_data(this.#id, sx | 0, sy | 0, Math.abs(sw) | 0, Math.abs(sh) | 0);
            const data = new Uint8ClampedArray(buffer);

            // Use global ImageData constructor
            if (typeof ImageData !== 'undefined') {
                return new ImageData(data, Math.abs(sw) | 0, Math.abs(sh) | 0);
            }
            // Fallback: return ImageData-like object
            return {
                data: data,
                width: Math.abs(sw) | 0,
                height: Math.abs(sh) | 0
            };
        }

        /**
         * Put pixel data onto the canvas
         * @param {ImageData} imageData - ImageData object
         * @param {number} dx - Destination X position
         * @param {number} dy - Destination Y position
         */
        putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
            if (!imageData || !imageData.data || !imageData.width || !imageData.height) {
                throw new TypeError("putImageData() argument must be an ImageData object");
            }

            // Ensure data is Uint8ClampedArray
            let data = imageData.data;
            if (!(data instanceof Uint8ClampedArray)) {
                data = new Uint8ClampedArray(data);
            }

            // Convert Uint8ClampedArray to regular array for serde serialization
            const dataArray = Array.from(data);

            // For simplicity, ignore dirty rectangle for now
            getCore().op_ctx2d_put_image_data(
                this.#id,
                dx | 0,
                dy | 0,
                imageData.width,
                imageData.height,
                dataArray
            );
        }
    }

    /**
     * Canvas - Equivalent to HTMLCanvasElement
     * Provides Web standard Canvas API
     */
    class Canvas {
        #id;
        #width;
        #height;
        #context = null;

        /**
         * Create a new Canvas
         * @param {number} width - Canvas width (default 300)
         * @param {number} height - Canvas height (default 150)
         */
        constructor(width = 300, height = 150) {
            width = Number(width);
            height = Number(height);

            if (width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) {
                throw new TypeError("Canvas dimensions must be positive numbers");
            }

            this.#width = Math.floor(width);
            this.#height = Math.floor(height);
            this.#id = getCore().op_canvas_create(this.#width, this.#height);

            if (this.#id === 0) {
                throw new Error("Failed to create canvas");
            }
        }

        /**
         * Get or set canvas width
         */
        get width() {
            return this.#width;
        }

        set width(value) {
            value = Number(value);
            if (value > 0 && !isNaN(value)) {
                this.#width = Math.floor(value);
                this.#id = getCore().op_canvas_create(this.#width, this.#height);
                this.#context = null;
            }
        }

        /**
         * Get or set canvas height
         */
        get height() {
            return this.#height;
        }

        set height(value) {
            value = Number(value);
            if (value > 0 && !isNaN(value)) {
                this.#height = Math.floor(value);
                this.#id = getCore().op_canvas_create(this.#width, this.#height);
                this.#context = null;
            }
        }

        /**
         * Get rendering context
         * @param {string} contextType - Context type (currently only "2d" supported)
         * @param {object} contextAttributes - Context attributes (optional)
         * @returns {CanvasRenderingContext2D|null}
         */
        getContext(contextType, contextAttributes) {
            if (contextType !== "2d") {
                console.warn(`Canvas: context type "${contextType}" is not supported. Only "2d" is available.`);
                return null;
            }

            if (this.#context !== null) {
                return this.#context;
            }

            this.#context = new CanvasRenderingContext2D(this.#id, this);
            return this.#context;
        }

        /**
         * Export as PNG Buffer
         * @param {string} mimeType - MIME type (default "image/png")
         * @returns {Uint8Array} Image data
         */
        toBuffer(mimeType = "image/png") {
            const buffer = getCore().op_canvas_to_buffer(this.#id, mimeType);
            // Convert Uint8Array to regular array for JSON serialization
            return Array.from(buffer);
        }

        /**
         * Export as Data URL (Base64 encoded)
         * @param {string} type - MIME type (default "image/png")
         * @param {number} quality - Image quality (0-1, for JPEG only)
         * @returns {string} Data URL
         */
        toDataURL(type = "image/png", quality) {
            const buffer = this.toBuffer(type);
            const base64 = btoa(String.fromCharCode(...buffer));
            return `data:${type};base64,${base64}`;
        }

        /**
         * Export as Blob (async, requires Web API support)
         * @param {function} callback - Callback function (blob) => {}
         * @param {string} type - MIME type
         * @param {number} quality - Image quality
         */
        toBlob(callback, type = "image/png", quality) {
            if (typeof callback !== "function") {
                throw new TypeError("Callback must be a function");
            }

            try {
                const buffer = this.toBuffer(type);
                const blob = new Blob([buffer], { type });
                setTimeout(() => callback(blob), 0);
            } catch (error) {
                console.error("Canvas.toBlob error:", error);
                setTimeout(() => callback(null), 0);
            }
        }
    }

    /**
     * ImageData - Represents pixel data
     * Compatible with Web API ImageData
     */
    class ImageData {
        #data;
        #width;
        #height;

        /**
         * Create a new ImageData object
         * @param {Uint8ClampedArray|number} dataOrWidth - Pixel data or width
         * @param {number} widthOrHeight - Width (if first arg is data) or height (if first arg is width)
         * @param {number} height - Height (only if first arg is data)
         */
        constructor(dataOrWidth, widthOrHeight, height) {
            if (dataOrWidth instanceof Uint8ClampedArray) {
                // new ImageData(data, width, height)
                const data = dataOrWidth;
                const width = widthOrHeight;
                height = height || (data.length / (4 * width));

                if (data.length !== width * height * 4) {
                    throw new Error("ImageData: data length doesn't match dimensions");
                }

                this.#data = data;
                this.#width = width;
                this.#height = height;
            } else if (typeof dataOrWidth === 'number') {
                // new ImageData(width, height)
                const width = dataOrWidth;
                height = widthOrHeight;

                if (width <= 0 || height <= 0) {
                    throw new Error("ImageData: dimensions must be positive");
                }

                this.#width = width;
                this.#height = height;
                this.#data = new Uint8ClampedArray(width * height * 4);
            } else {
                throw new TypeError("Invalid arguments for ImageData constructor");
            }
        }

        /**
         * Get pixel data
         * @returns {Uint8ClampedArray}
         */
        get data() {
            return this.#data;
        }

        /**
         * Get width
         * @returns {number}
         */
        get width() {
            return this.#width;
        }

        /**
         * Get height
         * @returns {number}
         */
        get height() {
            return this.#height;
        }
    }

    /**
     * Create Canvas (compatible with node-canvas API)
     * @param {number} width - Width
     * @param {number} height - Height
     * @returns {Canvas}
     */
    function createCanvas(width, height) {
        return new Canvas(width, height);
    }

    /**
     * Image - Represents a loaded image
     * Compatible with node-canvas Image API
     */
    class Image {
        #imageId = null;
        #width = 0;
        #height = 0;
        #src = null;
        #complete = false;
        #onload = null;
        #onerror = null;

        constructor() {
            // Image objects can be created but need to be loaded via src or loadImage
        }

        /**
         * Get image ID (internal use)
         */
        get _imageId() {
            return this.#imageId;
        }

        /**
         * Get image width
         */
        get width() {
            return this.#width;
        }

        /**
         * Get image height
         */
        get height() {
            return this.#height;
        }

        /**
         * Get image source
         */
        get src() {
            return this.#src;
        }

        /**
         * Set image source (supports file paths and data URLs)
         */
        set src(value) {
            this.#src = value;
            this.#complete = false;

            // Async load
            this._loadFromSrc(value);
        }

        /**
         * Check if image is loaded
         */
        get complete() {
            return this.#complete;
        }

        /**
         * Set onload callback
         */
        get onload() {
            return this.#onload;
        }

        set onload(callback) {
            this.#onload = callback;
        }

        /**
         * Set onerror callback
         */
        get onerror() {
            return this.#onerror;
        }

        set onerror(callback) {
            this.#onerror = callback;
        }

        /**
         * Load image from source (internal method)
         */
        async _loadFromSrc(src) {
            try {
                let imageId;

                // Check if it's a data URL
                if (src.startsWith('data:')) {
                    let bytes;

                    // Extract MIME type and data
                    const dataUrlMatch = src.match(/^data:([^;,]+)(;[^,]+)?,(.+)$/);
                    if (!dataUrlMatch) {
                        throw new Error("Invalid data URL format");
                    }

                    const mimeType = dataUrlMatch[1];
                    const encoding = dataUrlMatch[2] || '';
                    const data = dataUrlMatch[3];

                    if (encoding.includes('base64')) {
                        // Base64 encoded data
                        const binaryString = atob(data);
                        bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                    } else {
                        // Plain text or URL-encoded data (for SVG)
                        const decodedData = decodeURIComponent(data);
                        const encoder = new TextEncoder();
                        bytes = encoder.encode(decodedData);
                    }

                    imageId = getCore().op_image_load_from_buffer(bytes);
                } else if (src.startsWith('http:') || src.startsWith('https:') || src.startsWith('//')) {
                    // Network URL -- not supported in server-side canvas context.
                    // Silently fire onerror so supplemental environment scripts that
                    // use "new Image().src = url" as an error beacon don't spam logs.
                    if (this.#onerror) {
                        this.#onerror(new Error(`Network image URLs are not supported: ${src}`));
                    }
                    return;
                } else {
                    // Local file path
                    imageId = getCore().op_image_load_from_file(src);
                }

                // Check if loading failed (imageId === 0)
                if (imageId === 0) {
                    throw new Error(`Failed to load image from: ${src}`);
                }

                this.#imageId = imageId;
                this.#width = getCore().op_image_get_width(imageId);
                this.#height = getCore().op_image_get_height(imageId);
                this.#complete = true;

                // Trigger onload callback (synchronous, no setTimeout)
                if (this.#onload) {
                    this.#onload();
                }
            } catch (error) {
                // Trigger onerror callback if set; otherwise silently ignore.
                // Supplemental environment scripts often set img.src to a tracking/error
                // beacon URL -- we don't want those to spam the console.
                if (this.#onerror) {
                    this.#onerror(error);
                }
            }
        }

        /**
         * Load image from buffer (internal use)
         */
        _loadFromBuffer(buffer) {
            try {
                const imageId = getCore().op_image_load_from_buffer(buffer);

                // Check if loading failed (imageId === 0)
                if (imageId === 0) {
                    console.error("[Image] Failed to load image from buffer");
                    return false;
                }

                this.#imageId = imageId;
                this.#width = getCore().op_image_get_width(imageId);
                this.#height = getCore().op_image_get_height(imageId);
                this.#complete = true;
                return true;
            } catch (error) {
                console.error("[Image] Failed to load image from buffer:", error);
                return false;
            }
        }

        /**
         * Dispose image and free memory
         */
        dispose() {
            if (this.#imageId !== null) {
                getCore().op_image_dispose(this.#imageId);
                this.#imageId = null;
                this.#width = 0;
                this.#height = 0;
                this.#complete = false;
            }
        }
    }

    /**
     * Load an image from a file path, URL, or buffer
     * Compatible with node-canvas loadImage API
     *
     * @param {string|Buffer|Uint8Array} source - Image source
     * @returns {Promise<Image>}
     */
    async function loadImage(source) {
        // Rewritten to be fully synchronous, avoiding setTimeout
        const img = new Image();

        if (typeof source === 'string') {
            // File path or data URL
            // Since loading is synchronous, directly await _loadFromSrc
            await img._loadFromSrc(source);

            // Check if loading succeeded
            if (img._imageId === null) {
                throw new Error(`Failed to load image from: ${source}`);
            }

            return img;
        } else if (source instanceof Uint8Array || source instanceof Array) {
            // Buffer
            const buffer = source instanceof Array ? new Uint8Array(source) : source;

            // _loadFromBuffer is synchronous
            if (!img._loadFromBuffer(buffer)) {
                throw new Error("Failed to load image from buffer");
            }

            return img;
        } else {
            throw new Error("Invalid source type for loadImage");
        }
    }

    // Export to global namespace
    globalThis.Canvas = Canvas;
    globalThis.CanvasRenderingContext2D = CanvasRenderingContext2D;
    globalThis.ImageData = ImageData;
    globalThis.createCanvas = createCanvas;
    globalThis.Image = Image;
    globalThis.loadImage = loadImage;

    // console.log("[Canvas] Canvas 2D API loaded (powered by tiny-skia)");
})();
