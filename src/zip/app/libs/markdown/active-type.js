/*
 Copyright (c) 2018 Nathan Blazek
 Written by Nathan Blazek http://nateblazek.com
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function ($) {
    $.fn.activeType = function (options) {
        var textarea = this;

        var defaultRegex = [
            {name:'header', regex:/(#+)(.*)/g,                  replace: header},
            {name:'bold',   regex:/(\*\*|__)(.*?)\1/g,          replace: '<strong>$2</strong>'},
            {name:'link',   regex:/\[([^\[]+)\]\(([^\)]+)\)/g,  replace: '<a href=\'$2\'>$1</a>'},
            {name:'rule',   regex:/\n-{5,}/g,                   replace: '\n<hr />'},
            {name:'code',   regex:/`(.*?)`/g,                   replace: '<code>$1</code>'},
            {name:'italics',regex:/(\*|_)(.*?)\1/g,             replace: '<em>$2</em>'},
            {name:'bquote', regex:/\n(&gt;|\>)(.*)/g,           replace: '\n<blockquote>$2</blockquote>'},
            {name:'ul',     regex:/((?:\*.*\n)+)/gm,            replace: list_ul},
            {name:'ol',     regex:/((?:[0-9]+\..*\n)+)/gm,      replace: list_ol},
            {name:'para',   regex:/\n([^\n]+)\n/gm,             replace: paragraph},
            {name:'cleanjs', regex:/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, replace:''},
            {name:'cleanup',regex:/\\/gm,                       replace: ''}
        ];

        /**
         * Processes header markdown, while counting the # signs to determine header size
         * @param match - not used
         * @param contents
         * @param offset
         * @returns {string}
         */
        function header(match, contents, offset){
            var num = contents.length;
            return '<h' + num + '>'+offset.trim()+'</h' + num + '>';
        }

        /**
         * For unordered lists
         * Processes the list group as a whole, then breaks down each list item
         * @param entire_group
         * @returns {string}
         */
        function list_ul(entire_group){
            // Returns the entire li group since the regex grabbed all the items in the grouping
            // Now I can add <ul> around the results and <li> tags around each list item

            var result = entire_group.trim();
            result = result.replace(/\*(.*)/g,'<li>$1</li>');
            return '<ul>'+result+'</ul>';
        }

        /**
         * For ordered lists
         * Processes the list group as a whole, then breaks down each list item
         * @param entire_group
         * @returns {string}
         */
        function list_ol(entire_group){
            // Returns the entire li group since the regex grabbed all the items in the grouping
            // Now I can add <ol> around the results and <li> tags around each list item

            var result = entire_group.trim();
            result = result.replace(/^[0-9]*\.(.*)/gm,'<li>$1</li>');
            return '<ol>'+result+'</ol>';
        }

        /**
         * Adds <p> tags around blocks of text, as long as it does not overlap a closing html tag
         * @param match - not used
         * @param content
         * @returns {string}
         */
        function paragraph(match, content) {
            var result = content.trim();
            // Prevent insertion of <p> tag inside an existing tag that should not contain p tags
            if (/^<\/?(h|p|bl|ul|ol|li)/i.test(result)) {
                return '\n' + content + '\n';
            }
            return '\n<p>' + result + '</p>\n';
        }


        /**
         * Renders text by using the regex, returning the resulting string
         * @param originalText
         * @returns {string}
         */
        function render(originalText){
            var resultText = originalText;

            //Process each regular expression
            $.each(defaultRegex,function(index,item){
                var replacement = (options.markdown && options.markdown[item.name])?options.markdown[item.name]: item.replace;
                resultText = resultText.replace(item.regex,replacement);
            });

            //Process custom regex
            $.each(options.regex,function(index,item){
                resultText = resultText.replace(item.regex,item.replace);
            });

            return resultText;
        }

        /**
         * Simply updates the preview contain with the rendered markdown from the parent selector(textarea)
         */
        function refresh(){
            $(options.preview_selector).html(render($(textarea).val()));
        }

        /* PROCESSING FUNCTIONS */
        $(document).on('change keyup',textarea,refresh);

        return {
            refresh:refresh
        }

    }
}(jQuery));