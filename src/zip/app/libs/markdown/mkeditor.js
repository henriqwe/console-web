'use strict';

/**
 * Fusion deux objets entre eux
 * @param (object) a
 * @param (object) b
 * @return object
 */
function extend(a, b) {
    var c = {};
    for(var p in a) c[p] = (b[p] == null) ? a[p] : b[p];
    return c;
}

/**
 * Calcul la position de l'élement
 * @param (object) obj
 * return object
 */
function offset(obj) {
    var ol = 0,
        ot = 0;
    if (obj.offsetParent) {
        do {
            ol += obj.offsetLeft;
            ot += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return {
        left: ol,
        top: ot
    };
}

/**
 * This file had been modified by Shiny.
 * change log:
 *   1. IMG support FancyBox
 *   2. PRE support prettyprint
 *   3. Video Iframe support (16:9)
 *          @(url)
 *   4. Code Iframe support (300px height)
 *          %(url)
 *
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,
  iframe: /^%[^\)]([\s\S]*)[^\(]/,
  video: /^@[^\)]([\s\S]*)[^\(]/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    if (cap = this.rules.iframe.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<div class="codeWrapper">';
      out += '<iframe class="codeWrapper" src="' + escape(cap[1]) + '" allowfullscreen frameborder="0"></iframe>';
      out += '</div>';
      continue;
    }

    if (cap = this.rules.video.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<div class="embed-responsive embed-responsive-16by9">';
      out += '<iframe src="' + escape(cap[1]) + '" allowfullscreen frameborder="0"></iframe>';
      out += '</div>';
      continue;
    }

    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre class="prettyprint">'
      + (escaped ? code : escape(code, true))
      + '</pre>';
  }

  return '<pre class="prettyprint '
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '</pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<a class="fancybox" href="' + href + '" title="' + text + '"><img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/></a>' : '></a>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

/* ===================================================
 * MKEditor.js v1.0.0
 * http://bitbucket.org/dreamteam-etna/mkeditor.git
 * ===================================================
 * Copyright (C) 2015 Christopher Fouquier
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * ========================================================== */

'use strict';

(function(window, $){
    function mke(options) {

        if (!(this instanceof mke)) return new mke(options);

        if (options === undefined) {
            options = {};
        }

        this.settings = extend({
            placeholder: '',
            fullscreen: false,
            language: 'en',
            resize: false,
            fixed: true,
            limit: 0,
            hideBtn: []
        }, options);

        if (this.target === undefined) {
            this.target = document.getElementsByTagName('textarea')[0];
        }

        this.language = {
            "fr": {
                'bold': 'gras',
                'italic': 'italique',
                'code': 'code',
                'header': 'titre',
                'quote': 'Citation',
                'link': 'Lien',
                'picture': 'Image',
                'fullscreen': 'Plein écran',
                'strike': 'Barré',
                'ul': 'Liste à puce',
                'ol': 'Liste numéroté',
                'Words': 'Mots',
                'Characters': 'Caractères',
                'Lines': 'Lignes'
            }
        };

        // { name|title, fontawesome-name (optional), parent (optional), action (optional) }
        this.buttons = [
            { name: 'bold', i: 'fa-bold', action: { 'start': '**', 'end': '**' } },
            { name: 'italic', i: 'fa-italic', action: { 'start': '_', 'end': '_' } },
            { name: 'strike', i: 'fa-strikethrough', action: { 'start': '~~', 'end': '~~' } },
            { name: 'header', i: 'fa-header' },
            { name: 'h1', parent: 'header', action: { 'start': "\n#", 'end': "\n" } },
            { name: 'h2', parent: 'header', action: { 'start': "\n##", 'end': "\n" } },
            { name: 'h3', parent: 'header', action: { 'start': "\n###", 'end': "\n" } },
            { name: 'h4', parent: 'header', action: { 'start': "\n####", 'end': "\n" } },
            { name: 'h5', parent: 'header', action: { 'start': "\n#####", 'end': "\n" } },
            { name: 'h6', parent: 'header', action: { 'start': "\n######", 'end': "\n" } },
            { name: 'quote', i: 'fa-quote-left', action: { 'start': "\n> ", 'end': '' } },
            { name: 'ol', i: 'fa-list-ol', action: { 'start': "\n1. ", 'end': "\n" } },
            { name: 'ul', i: 'fa-list-ul', action: { 'start': "\n* ", 'end': "\n\n" } },
            { name: 'link', i: 'fa-link', action: { 'start': '[', 'end': '](http://)' } },
            { name: 'picture', i: 'fa-picture-o', action: { 'start': '![', 'end': '](http://)' } },
            { name: 'code', i: 'fa-code', action: { 'start': "\n~~~\n", 'end': "\n~~~\n" } },
            { name: 'fullscreen', i: 'fa-arrows-alt' }
        ];

        this.init();
    }

    /**
     * Create DOM
     */
    mke.prototype.loadDom = function() {
        var jqObjString = '<div class="mke"><ul class="mke-toolbar"></ul><textarea class="mke-editor mke-scroll" placeholder="' + this.settings.placeholder + '"></textarea><div class="mke-preview mke-scroll"></div><div class="mke-info"></div></div>'

        this.target.insertAdjacentHTML('beforebegin', jqObjString);
        this.target.style.display = 'none';

        this.mke = document.getElementsByClassName('mke')[0];
        this.mkeEditor = document.getElementsByClassName('mke-editor')[0];
        this.mkeToolbar = document.getElementsByClassName('mke-toolbar')[0];
        this.mkePreview = document.getElementsByClassName('mke-preview')[0];
        this.mkeInfo = document.getElementsByClassName('mke-info')[0];

        if (this.target.value.length) {
            this.mkeEditor.value = this.target.value;
            this.mkePreview.innerHTML = marked(this.target.value);
        }
    };

    /**
     * Create button in toolbar
     * @param (object) btn
     */
    mke.prototype.insertBtn = function(btn) {
        var nameCapitalize = btn.name.charAt(0).toUpperCase() + btn.name.slice(1);

        if (btn.hasOwnProperty('parent')) {
            var p = document.querySelector('button[name=' + btn.parent + ']').parentNode;

            if (document.getElementsByClassName('submenu-' + btn.parent).length === 0) {
                p.innerHTML += '<ul class="submenu submenu-' + btn.parent + '"></ul>';
            }

            document.getElementsByClassName('submenu-' + btn.parent)[0].innerHTML += '<li><button title="' + nameCapitalize + '" name="' + btn.name + '">' + nameCapitalize + '</button></li>';
            p.className = 'menu';
        }
        else {
            this.mkeToolbar.innerHTML += '<li><button title="' + nameCapitalize + '" name="' + btn.name + '"><i class="fa ' + btn.i + '"></i></button></li>';
        }
    };

    /**
     * Remove button in toolbar
     * @param (string) name
     */
    mke.prototype.removeBtn = function(name) {
        var el = document.querySelector('button[name=' + name + ']');
        el.parentNode.removeChild(el);
    };

    /**
     * Action associated with a button
     * @param (object|string) el
     */
    mke.prototype.actionBtn = function(el) {
        if (typeof el === "string") {
            var tag = el;
        }
        else {
            var tag = el.getAttribute('name');
        }

        if (tag === 'fullscreen') {
            if (document.getElementsByClassName('mke-fullscreen-mode')[0] === undefined) {
                this.settings.fullscreen = true;
            }
            else {
                this.settings.fullscreen = false;
            }

            return this.fullscreen();
        }
        else if (typeof el !== 'string' && el.parentNode.classList.contains('menu')) {
            var el = document.getElementsByClassName('submenu-' + el.getAttribute('name'))[0];

            if (!el.classList.contains('open')) {
                el.style.top = this.mkeToolbar.offsetHeight;
                el.className += ' open';
            }
            else {
                el.classList.remove('open');
            }
        }
        else {
            var val = this.mkeEditor.value,
                selected_txt = val.substring(this.mkeEditor.selectionStart, this.mkeEditor.selectionEnd),
                before_txt = val.substring(0, this.mkeEditor.selectionStart),
                after_txt = val.substring(this.mkeEditor.selectionEnd, val.length),
                search = false;

            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i].name === tag) {
                    tag = this.buttons[i].action;
                    search = true;
                }
            };

            if (search === true) {
                this.mkeEditor.value = before_txt + tag.start + selected_txt + tag.end + after_txt;
                this.live(this.mkeEditor);
            }
        }
    };

    /**
     * Live preview
     * @param (object) el
     */
    mke.prototype.live = function(el) {
        this.target.value = el.value;
        this.mkePreview.innerHTML = marked(el.value);
        this.info();
    };

    /**
     * Fullscreen editor
     */
    mke.prototype.fullscreen = function() {
        if (this.settings.fullscreen === true) {
            var body = document.getElementsByTagName('body')[0];
            this.mke.className += ' mke-fullscreen-mode';
            body.appendChild(this.mke);
            body.style.overflow = 'hidden';
        }
        else {
            this.mke.classList.remove('mke-fullscreen-mode');
            this.target.parentNode.insertBefore(this.mke, this.target.previousSibling);
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }
        this.sizeEditor();
    };

    /**
     * Resize editor, preview and toolbar
     */
    mke.prototype.sizeEditor = function() {
        if (this.settings.fullscreen === false) {
            var margin = this.mkeToolbar.offsetHeight + this.mkeInfo.offsetHeight;

            this.mkeEditor.style.height = this.mke.offsetHeight - margin;
            this.mkePreview.style.height = this.mkeEditor.offsetHeight;
        }
        else {
            this.mkePreview.style.height = 'auto';
            this.mkeEditor.style.height = this.mkePreview.offsetHeight;
        }

        this.mkeToolbar.style.width = '100%';
    };

    /**
     * Count characters, words ands lines of element
     * @param (string) val
     * @return object
     */
    mke.prototype.count = function(val) {
        if (val.length !== 0) {
            return {
                characters : val.length,
                words      : val.match(/\S+/g).length,
                lines      : val.split(/\r*\n/).length
            };
        }
        else {
            return {
                characters : 0,
                words      : 0,
                lines      : 0
            };
        }
    };

    /**
     * Insert infos in bottom bar in editor
     */
    mke.prototype.info = function() {
        this.mkeInfo.innerHTML = '<span class="words"><strong>Words:</strong> ' + this.count(this.target.value).words +'</span><span class="characters"><strong>Characters:</strong> ' + this.count(this.target.value).characters +'</span><span class="lines"><strong>Lines:</strong> ' + this.count(this.target.value).lines +'</span>';
    };

    /**
     * Limit of characters
     */
    mke.prototype.limit = function() {
        if (this.settings.limit !== 0 && typeof this.settings.limit === 'number') {
            this.mkeEditor.setAttribute('maxlength', this.settings.limit);
            this.mkeInfo.innerHTML += '<span class="limit"><strong>Limit:</strong> ' + this.settings.limit + '</span>';
        }
    };

    /**
     * Synchronous scroll
     */
    mke.prototype.scroll = function() {
        var sync = function(e) {
            var divs = document.getElementsByClassName('mke-scroll');

            for (var i = 0; i < divs.length; i++) {
                if (e.target !== divs[i]) {
                    var other = divs[i];
                }
            };

            var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
            other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);
            // @TODO: Fix Firefox - Bug IE10
            setTimeout(function() { other.addEventListener('scroll', sync ); }, 10);
        }
        var divs = document.getElementsByClassName('mke-scroll');
        for (var i = 0; i < divs.length; i++) {
            divs[i].addEventListener('scroll', sync);
        };
    };

    /**
     * Resize
     */
    mke.prototype.resize = function() {
        var that = this
        this.mkeEditor.addEventListener('keydown',function(e){
            if (that.settings.resize === true) {
                if (that.scrollY) {
                    that.style.height += 20;
                }
            }
        });
        if (this.settings.resize === true) {
            this.mke.style.height = 'auto';
            this.mkePreview.style.height = 'auto';
            this.mkeEditor.style.height = 'auto';

            if (this.mkePreview.offsetHeight > this.mkeEditor.offsetHeight) {
                this.mkeEditor.style.height = this.mkePreview.offsetHeight;
            }
            else {
                this.mkePreview.style.height = this.mkeEditor.offsetHeight;
            }
        }
    };

    /**
     * Shortcut
     */
    mke.prototype.macro = function() {
        var that = this;
        this.mkeEditor.addEventListener('keydown', function(e){
            if((e.ctrlKey || e.metaKey) && e.keyCode === 66) {
                e.preventDefault();
                console.log('ctrl|cmd + b');
                that.actionBtn('bold');
            }
            else if ((e.ctrlKey || e.metaKey) && e.keyCode === 73) {
                e.preventDefault();
                console.log('ctrl|cmd + i');
                that.actionBtn('italic');
            }
            else if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
                e.preventDefault();
                console.log('ctrl|cmd + s');
                that.actionBtn('strike');
            }
            else if ((e.ctrlKey || e.metaKey) && e.keyCode === 81) {
                e.preventDefault();
                console.log('ctrl|cmd + q');
                that.actionBtn('quote');
            }
            else if (e.which === 9) {
                e.preventDefault();
                console.log('tab'); // tab => \t

                var myValue = "\t";
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos,this.value.length);
                this.focus(); // @TODO: Bug IE
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
                that.live(that.mkeEditor);

                e.preventDefault();
            }
        });
    }

    /**
     * Translate text
     */
    mke.prototype.translate = function() {
        if (this.settings.language !== "en" && typeof this.settings.language === 'string') {
            var obj = this.language[this.settings.language];
            for (var k in obj) {
                var elements = document.querySelectorAll('.mke-toolbar button');
                for (var i = 0; i < elements.length; i++) {
                    if (k === elements[i].getAttribute('name')) {
                        elements[i].setAttribute('title', obj[k].charAt(0).toUpperCase() + obj[k].slice(1));
                    }
                };

                var elements = document.querySelectorAll('.mke-info strong');
                for (var i = 0; i < elements.length; i++) {
                    if (k === elements[i].innerHTML.substring(0, elements[i].innerHTML.length - 1)) {
                        elements[i].innerHTML = obj[k].charAt(0).toUpperCase() + obj[k].slice(1) + ' :';
                    }
                };
            }
        }
    };

    /**
     * Fixed toolbar
     */
    mke.prototype.fixed = function() {
        if (this.settings.fixed === true) {
            var that = this;
            window.addEventListener('scroll', function() {
                var mkeTop = offset(that.mke).top,
                    mkeBot = mkeTop + that.mke.offsetHeight;

                if (this.scrollY > mkeTop && !that.mkeToolbar.classList.contains('mke-toolbar-static')) {
                    that.mkeToolbar.className += ' mke-toolbar-static';
                    that.mkeToolbar.style.width = that.mke.offsetWidth;
                }

                if ((this.scrollY > mkeBot - that.mkeToolbar.offsetHeight || this.scrollY < mkeTop) && that.mkeToolbar.classList.contains('mke-toolbar-static')) {
                    that.mkeToolbar.classList.remove('mke-toolbar-static');
                }
            });
        }
    };

    /**
     * Upload ajax in POST
     */
    mke.prototype.upload = function() {
        if (typeof this.settings.upload === 'string' && this.settings.upload !== '') {

            var request = new XMLHttpRequest();
            request.open("POST", this.settings.upload, true);
            request.onreadystatechange = function () {
                if (request.readyState != 4 || request.status != 200) return;
                console.log(request.responseText);
                // @TODO: Insert ![image](URL_IMAGE) in editor
            };
            request.send('base64/png'); // send image in base64

        }
    };

    /**
     * Initiliaze plugin
     */
    mke.prototype.init = function() {
        var that = this;

        /* Check version Internet Explorer */
        var ieVersion = /*@cc_on (function() {switch(@_jscript_version) {case 1.0: return 3; case 3.0: return 4; case 5.0: return 5; case 5.1: return 5; case 5.5: return 5.5; case 5.6: return 6; case 5.7: return 7; case 5.8: return 8; case 9: return 9; case 10: return 10;}})() || @*/ 0;
        console.log(ieVersion);
        if (ieVersion > 0 && ieVersion < 9) {
            alert('Your web browser version is not supported.');
            return;
        }

        this.loadDom();

        for (var i = 0; i < this.buttons.length; i++) {
            this.insertBtn(this.buttons[i]);
        };

        var buttons = document.querySelectorAll('.mke-toolbar button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function(e) {
                that.actionBtn(this);
            });
        };

        for (var i = 0, len = this.settings.hideBtn.length; i < len; i++) {
            this.removeBtn(buttons[i]);
        };

        this.mkeEditor.addEventListener('keyup', function(e) {
            that.live(that.mkeEditor);
        });

        this.info();
        this.limit();
        this.translate();
        this.fixed();
        this.scroll();
        this.macro();
        this.resize();
        this.sizeEditor();

        window.addEventListener('mouseup', function(e) {
            var container = document.getElementsByClassName('submenu')[0];
            if (container !== e.target && document.getElementsByClassName('submenu')[0].classList.contains('open') === true) {
                document.querySelectorAll('.submenu.open')[0].classList.remove('open');
            }
        });

        window.addEventListener('resize', function(e) {
            that.sizeEditor();
        });
    };

    $.fn.MKEditor = function(options) {
        return this.each(function() {
            new mke(options);
        });
    };

    window.MKEditor = mke; //Assign 'mke' to the global variable 'MKEditor'...
})(window, jQuery);
