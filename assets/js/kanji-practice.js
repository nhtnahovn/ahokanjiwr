/**
 * Kanji Writing Practice - Main JavaScript
 */
(function() {
    'use strict';

    class KanjiPractice {
        constructor(container) {
            this.container = container;
            this.input = container.querySelector('.kwp-kanji-input');
            this.canvasWrapper = container.querySelector('.kwp-canvas-wrapper');
            this.canvasContainer = container.querySelector('.kwp-canvas-container');
            this.gridCanvas = container.querySelector('.kwp-grid-canvas');
            this.watermarkCanvas = container.querySelector('.kwp-watermark-canvas');
            this.drawingCanvas = container.querySelector('.kwp-drawing-canvas');
            
            this.gridCtx = this.gridCanvas.getContext('2d');
            this.watermarkCtx = this.watermarkCanvas.getContext('2d');
            this.drawingCtx = this.drawingCanvas.getContext('2d');
            
            this.isDrawing = false;
            this.lastX = 0;
            this.lastY = 0;
            this.strokes = [];
            this.currentStroke = [];
            
            this.gridOpacity = 0.37;
            this.watermarkOpacity = 0.45;
            this.watermarkVisible = true;
            this.penColor = '#000000';
            this.penSize = 3;
            this.kanjiChar = '';
            
            this.init();
        }
        
        init() {
            this.setupEventListeners();
            this.resizeCanvases();
            window.addEventListener('resize', () => this.resizeCanvases());
        }
        
        setupEventListeners() {
            // Input change
            this.input.addEventListener('input', (e) => this.onKanjiInput(e));
            
            // Drawing events
            this.drawingCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
            this.drawingCanvas.addEventListener('mousemove', (e) => this.draw(e));
            this.drawingCanvas.addEventListener('mouseup', () => this.stopDrawing());
            this.drawingCanvas.addEventListener('mouseout', () => this.stopDrawing());
            
            // Touch events
            this.drawingCanvas.addEventListener('touchstart', (e) => this.startDrawing(e), { passive: false });
            this.drawingCanvas.addEventListener('touchmove', (e) => this.draw(e), { passive: false });
            this.drawingCanvas.addEventListener('touchend', () => this.stopDrawing());
            
            // Grid opacity slider
            const gridOpacitySlider = this.container.querySelector('.kwp-grid-opacity');
            gridOpacitySlider.addEventListener('input', (e) => {
                this.gridOpacity = e.target.value / 100;
                e.target.nextElementSibling.textContent = e.target.value + '%';
                this.drawGrid();
            });
            
            // Watermark opacity slider
            const watermarkOpacitySlider = this.container.querySelector('.kwp-watermark-opacity');
            watermarkOpacitySlider.addEventListener('input', (e) => {
                this.watermarkOpacity = e.target.value / 100;
                e.target.nextElementSibling.textContent = e.target.value + '%';
                this.drawWatermark();
            });
            
            // Toggle watermark
            const toggleWatermark = this.container.querySelector('.kwp-toggle-watermark');
            toggleWatermark.addEventListener('click', () => {
                this.watermarkVisible = !this.watermarkVisible;
                toggleWatermark.classList.toggle('active');
                this.drawWatermark();
            });
            
            // Color picker
            const colorPicker = this.container.querySelector('.kwp-color-picker');
            colorPicker.addEventListener('input', (e) => {
                this.penColor = e.target.value;
            });
            
            // Pen size slider
            const penSizeSlider = this.container.querySelector('.kwp-pen-size');
            penSizeSlider.addEventListener('input', (e) => {
                this.penSize = parseInt(e.target.value);
                e.target.nextElementSibling.textContent = e.target.value;
            });
            
            // Undo button
            const undoBtn = this.container.querySelector('.kwp-undo-btn');
            undoBtn.addEventListener('click', () => this.undo());
            
            // Clear button
            const clearBtn = this.container.querySelector('.kwp-clear-btn');
            clearBtn.addEventListener('click', () => this.clear());
            
            // Fullscreen button
            const fullscreenBtn = this.container.querySelector('.kwp-fullscreen-btn');
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
        
        onKanjiInput(e) {
            const value = e.target.value.trim();
            if (value) {
                this.kanjiChar = value;
                this.canvasWrapper.style.display = 'block';
                this.resizeCanvases();
                this.drawGrid();
                this.drawWatermark();
                this.clear();
            } else {
                this.canvasWrapper.style.display = 'none';
            }
        }
        
        resizeCanvases() {
            if (this.canvasWrapper.style.display === 'none') return;
            
            const rect = this.canvasContainer.getBoundingClientRect();
            const size = Math.min(rect.width, rect.height);
            
            [this.gridCanvas, this.watermarkCanvas, this.drawingCanvas].forEach(canvas => {
                canvas.width = size;
                canvas.height = size;
            });
            
            this.drawGrid();
            this.drawWatermark();
            this.redrawStrokes();
        }
        
        drawGrid() {
            const canvas = this.gridCanvas;
            const ctx = this.gridCtx;
            const size = canvas.width;
            
            ctx.clearRect(0, 0, size, size);
            ctx.strokeStyle = `rgba(0, 0, 0, ${this.gridOpacity})`;
            ctx.lineWidth = 1;
            
            // Draw main cross (vertical and horizontal center lines)
            ctx.beginPath();
            ctx.moveTo(size / 2, 0);
            ctx.lineTo(size / 2, size);
            ctx.moveTo(0, size / 2);
            ctx.lineTo(size, size / 2);
            ctx.stroke();
            
            // Draw diagonals
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(size, size);
            ctx.moveTo(size, 0);
            ctx.lineTo(0, size);
            ctx.stroke();
            
            // Draw border
            ctx.strokeRect(0, 0, size, size);
        }
        
        drawWatermark() {
            const canvas = this.watermarkCanvas;
            const ctx = this.watermarkCtx;
            const size = canvas.width;
            
            ctx.clearRect(0, 0, size, size);
            
            if (!this.watermarkVisible || !this.kanjiChar) return;
            
            ctx.font = `${size * 0.8}px "Noto Sans JP", "MS Mincho", "Yu Mincho", serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(0, 0, 0, ${this.watermarkOpacity})`;
            ctx.fillText(this.kanjiChar, size / 2, size / 2);
        }
        
        getCoordinates(e) {
            const rect = this.drawingCanvas.getBoundingClientRect();
            const scaleX = this.drawingCanvas.width / rect.width;
            const scaleY = this.drawingCanvas.height / rect.height;
            
            let clientX, clientY;
            
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        }
        
        startDrawing(e) {
            e.preventDefault();
            this.isDrawing = true;
            const coords = this.getCoordinates(e);
            this.lastX = coords.x;
            this.lastY = coords.y;
            
            this.currentStroke = [{
                x: this.lastX,
                y: this.lastY,
                color: this.penColor,
                size: this.penSize
            }];
        }
        
        draw(e) {
            if (!this.isDrawing) return;
            e.preventDefault();
            
            const coords = this.getCoordinates(e);
            const ctx = this.drawingCtx;
            
            ctx.strokeStyle = this.penColor;
            ctx.lineWidth = this.penSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(this.lastX, this.lastY);
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
            
            this.currentStroke.push({
                x: coords.x,
                y: coords.y,
                color: this.penColor,
                size: this.penSize
            });
            
            this.lastX = coords.x;
            this.lastY = coords.y;
        }
        
        stopDrawing() {
            if (this.isDrawing && this.currentStroke.length > 0) {
                this.strokes.push([...this.currentStroke]);
                this.currentStroke = [];
            }
            this.isDrawing = false;
        }
        
        redrawStrokes() {
            const ctx = this.drawingCtx;
            ctx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
            
            this.strokes.forEach(stroke => {
                if (stroke.length === 0) return;
                
                ctx.strokeStyle = stroke[0].color;
                ctx.lineWidth = stroke[0].size;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                
                ctx.beginPath();
                ctx.moveTo(stroke[0].x, stroke[0].y);
                
                for (let i = 1; i < stroke.length; i++) {
                    ctx.lineTo(stroke[i].x, stroke[i].y);
                }
                ctx.stroke();
            });
        }
        
        undo() {
            if (this.strokes.length > 0) {
                this.strokes.pop();
                this.redrawStrokes();
            }
        }
        
        clear() {
            this.strokes = [];
            this.currentStroke = [];
            this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        }
        
        toggleFullscreen() {
            this.container.classList.toggle('kwp-fullscreen');
            setTimeout(() => this.resizeCanvases(), 100);
        }
    }
    
    // Initialize all instances on page load
    if (typeof jQuery !== 'undefined') {
        jQuery(document).ready(function() {
            document.querySelectorAll('.kwp-container').forEach(function(container) {
                new KanjiPractice(container);
            });
        });
    }
    
    // Export for manual initialization
    window.KanjiPractice = KanjiPractice;
    
})();
