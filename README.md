# Kanji Writing Practice Plugin

A WordPress plugin for practicing Kanji writing with HTML5 canvas and customizable drawing tools.

## Features

### 1. Gutenberg Block & Shortcode
- **Gutenberg Block**: Add the "Kanji Writing Practice" block in the block editor
- **Shortcode**: Use `[kanji_practice]` shortcode anywhere in posts or pages

### 2. Writing Practice Interface
- **Input Field**: Enter a Kanji character to practice
- **Canvas Area**: HTML5 canvas with grid overlay for writing practice
- **Grid Lines**: Displays center lines and diagonals like traditional Kanji practice paper
- **Adjustable Grid Opacity**: Default 37%, adjustable via slider (0-100%)

### 3. Watermark Display
- **Kanji Watermark**: The entered Kanji appears as a semi-transparent guide
- **Adjustable Watermark Opacity**: Default 45%, adjustable via slider (0-100%)
- **Toggle Visibility**: Show/hide the watermark with a button

### 4. Drawing Tools
- **Pen Tool**: Draw on the canvas using mouse or touch input
- **Color Picker**: Change pen color
- **Pen Size**: Adjust pen thickness (1-20px)
- **Undo**: Remove the last stroke
- **Clear**: Remove all strokes from the canvas

### 5. User Experience
- **Fullscreen Mode**: Expand the practice area to fullscreen
- **Responsive Design**: Optimized for mobile devices and tablets
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Touch Support**: Full support for touch devices

## Installation

1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Use the Gutenberg block or shortcode `[kanji_practice]` in your content

## Usage

### Using the Gutenberg Block
1. Open the block editor
2. Click the '+' button to add a new block
3. Search for "Kanji Writing Practice"
4. Insert the block

### Using the Shortcode
Simply add `[kanji_practice]` to any post or page:

```
[kanji_practice]
```

### Practicing Kanji
1. Enter a Kanji character in the input field
2. The canvas will appear with a grid and watermark
3. Adjust opacity sliders as needed
4. Use the pen tools to practice writing
5. Use Undo to remove mistakes
6. Use Clear to start over
7. Click Fullscreen for a larger practice area

## Technical Details

- **WordPress Version**: 5.0 or higher
- **PHP Version**: 7.0 or higher
- **Canvas Technology**: HTML5 Canvas API
- **JavaScript**: Vanilla JavaScript with jQuery
- **CSS**: Modern CSS with Flexbox and responsive design

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers with touch support

## License

GPL v2 or later

## Author

nhtnahovn

## Support

For issues and support, please visit: https://github.com/nhtnahovn/ahokanjiwr
