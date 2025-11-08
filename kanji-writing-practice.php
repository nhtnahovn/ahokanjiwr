<?php
/**
 * Plugin Name: Kanji Writing Practice
 * Plugin URI: https://github.com/nhtnahovn/ahokanjiwr
 * Description: A WordPress plugin for practicing Kanji writing with HTML5 canvas and customizable drawing tools
 * Version: 1.0.0
 * Author: nhtnahovn
 * Author URI: https://github.com/nhtnahovn
 * Text Domain: kanji-writing-practice
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('KWP_VERSION', '1.0.0');
define('KWP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('KWP_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Initialize the plugin
 */
class Kanji_Writing_Practice {
    
    public function __construct() {
        add_action('init', array($this, 'register_block'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_shortcode('kanji_practice', array($this, 'shortcode_handler'));
    }

    /**
     * Register Gutenberg block
     */
    public function register_block() {
        if (!function_exists('register_block_type')) {
            return;
        }

        wp_register_script(
            'kwp-block-editor',
            KWP_PLUGIN_URL . 'assets/js/block.js',
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components'),
            KWP_VERSION,
            true
        );

        register_block_type('kanji-writing-practice/kanji-practice', array(
            'editor_script' => 'kwp-block-editor',
            'render_callback' => array($this, 'render_block'),
        ));
    }

    /**
     * Enqueue frontend assets
     */
    public function enqueue_assets() {
        wp_enqueue_style(
            'kwp-styles',
            KWP_PLUGIN_URL . 'assets/css/style.css',
            array(),
            KWP_VERSION
        );

        wp_enqueue_script(
            'kwp-script',
            KWP_PLUGIN_URL . 'assets/js/kanji-practice.js',
            array(),
            KWP_VERSION,
            true
        );

        wp_localize_script('kwp-script', 'kwpData', array(
            'pluginUrl' => KWP_PLUGIN_URL,
        ));
    }

    /**
     * Render block callback
     */
    public function render_block($attributes) {
        return $this->get_practice_html();
    }

    /**
     * Shortcode handler
     */
    public function shortcode_handler($atts) {
        return $this->get_practice_html();
    }

    /**
     * Get practice HTML
     */
    private function get_practice_html() {
        ob_start();
        ?>
        <div class="kwp-container">
            <div class="kwp-input-section">
                <label for="kwp-kanji-input" class="kwp-label">
                    <?php _e('Enter a Kanji character:', 'kanji-writing-practice'); ?>
                </label>
                <input 
                    type="text" 
                    id="kwp-kanji-input" 
                    class="kwp-kanji-input" 
                    maxlength="1"
                    placeholder="漢"
                />
            </div>

            <div class="kwp-canvas-wrapper" style="display: none;">
                <div class="kwp-controls">
                    <div class="kwp-control-group">
                        <button class="kwp-btn kwp-fullscreen-btn" title="<?php _e('Fullscreen', 'kanji-writing-practice'); ?>">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                            </svg>
                        </button>
                    </div>

                    <div class="kwp-control-group">
                        <label class="kwp-control-label"><?php _e('Watermark:', 'kanji-writing-practice'); ?></label>
                        <button class="kwp-btn kwp-toggle-watermark active" title="<?php _e('Toggle Watermark', 'kanji-writing-practice'); ?>">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                    </div>

                    <div class="kwp-control-group">
                        <label class="kwp-control-label"><?php _e('Grid Opacity:', 'kanji-writing-practice'); ?></label>
                        <input type="range" class="kwp-slider kwp-grid-opacity" min="0" max="100" value="37" />
                        <span class="kwp-value">37%</span>
                    </div>

                    <div class="kwp-control-group">
                        <label class="kwp-control-label"><?php _e('Watermark Opacity:', 'kanji-writing-practice'); ?></label>
                        <input type="range" class="kwp-slider kwp-watermark-opacity" min="0" max="100" value="45" />
                        <span class="kwp-value">45%</span>
                    </div>

                    <div class="kwp-control-group">
                        <label class="kwp-control-label"><?php _e('Pen Color:', 'kanji-writing-practice'); ?></label>
                        <input type="color" class="kwp-color-picker" value="#000000" />
                    </div>

                    <div class="kwp-control-group">
                        <label class="kwp-control-label"><?php _e('Pen Size:', 'kanji-writing-practice'); ?></label>
                        <input type="range" class="kwp-slider kwp-pen-size" min="1" max="20" value="3" />
                        <span class="kwp-value">3</span>
                    </div>

                    <div class="kwp-control-group">
                        <button class="kwp-btn kwp-undo-btn" title="<?php _e('Undo', 'kanji-writing-practice'); ?>">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 7v6h6"/>
                                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                            </svg>
                        </button>
                        <button class="kwp-btn kwp-clear-btn" title="<?php _e('Clear', 'kanji-writing-practice'); ?>">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="kwp-canvas-container">
                    <canvas class="kwp-grid-canvas"></canvas>
                    <canvas class="kwp-watermark-canvas"></canvas>
                    <canvas class="kwp-drawing-canvas"></canvas>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}

// Initialize the plugin
new Kanji_Writing_Practice();
