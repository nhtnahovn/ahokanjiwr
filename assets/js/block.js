/**
 * Kanji Writing Practice - Gutenberg Block
 */
(function(wp) {
    const { registerBlockType } = wp.blocks;
    const { createElement: el } = wp.element;
    
    registerBlockType('kanji-writing-practice/kanji-practice', {
        title: 'Kanji Writing Practice',
        description: 'Add a Kanji writing practice canvas to your page',
        icon: 'edit',
        category: 'widgets',
        keywords: ['kanji', 'practice', 'writing', 'japanese'],
        
        edit: function(props) {
            return el(
                'div',
                { className: 'kwp-block-placeholder' },
                el('div', { className: 'kwp-block-icon' }, '✍️'),
                el('h3', {}, 'Kanji Writing Practice'),
                el('p', {}, 'This block will display the Kanji writing practice interface on the frontend.')
            );
        },
        
        save: function() {
            return null; // Rendered via PHP
        }
    });
})(window.wp);
