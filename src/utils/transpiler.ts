import * as utils from 'utils'
import { api, _gtools_lib } from './tools'

const types = {}
const assocs = {}
const new_assocs = []

const ycl_reserved_words = [
  'schema',
  'entity',
  'enabled',
  'extends',
  'nullable',
  'unique',
  'concurrencyControl',
  'businessRule',
  'accessControl',
  'read',
  'write',
  'persistence',
  'uniqueKey',
  'indexKey',
  'String',
  'Boolean',
  'Integer',
  'Long',
  'Double',
  'Number',
  'Date',
  'Time',
  'Text',
  'File',
  '_conf',
  'extension',
  'source',
  'nosql',
  'dataset',
  'timeseries',
  'columnar',
  'partitionKeys',
  'clusteringColumns',
  'Text',
  'id',
  'role',
  'user',
  'createdat',
  'updatedat',
  'version'
]

function splice(original, text, offset) {
  let calculatedOffset = offset < 0 ? original.length + offset : offset
  return (
    original.substring(0, calculatedOffset) +
    text +
    original.substring(calculatedOffset)
  )
}

function importSchema(src) {
  src = src.trim()
  let accumulator = ''
  for (let index = 0; index < src.length; index++) {
    if (src.charAt(index) === ' ') {
      if (
        accumulator.length < 7 &&
        (accumulator === 'schema' || accumulator === 'entity')
      ) {
        while (src.charAt(++index) === ' ') {}
        /* console.log(splice(String(src), 'c:', index)); */
        ycl_transpiler.parse(splice(String(src), 'c:', index))
      }
      accumulator = ''
    } else {
      accumulator = accumulator + src.charAt(index)
    }
  }
}

export const ycl_transpiler = {
  refs: {},
  types: [
    'String',
    'Boolean',
    'Integer',
    'Long',
    'Double',
    'Number',
    'Date',
    'Text',
    'Time',
    'Timestamp',
    'Text',
    'File',
    'Image',
    'Binary'
  ],
  tokenizer_yc_code: function (text, entity_names_) {
    let tokens_ = []
    let lines = text.split('\n')
    for (let line = 0; line < lines.length; line++) {
      if (lines[line].includes(',')) {
        if (
          !lines[line].startsWith('[') &&
          !lines[line].endsWith(']') &&
          !lines[line].startsWith('(') &&
          !lines[line].endsWith(')') &&
          !lines[line].startsWith('{') &&
          !lines[line].endsWith('}')
        ) {
          lines[line] = lines[line].replaceAll(' ', '').replaceAll(',', ' ')
          let aux = lines[line].trim().split(' ')
          if (!ycl_transpiler.ycl_reserved_word_contains(aux[0])) {
            // go!
          } else
            utils.notification(
              'error: malformed syntax. the token found is a reserved word.',
              'error'
            )
        } else utils.notification('error: malformed list syntax.', 'error')
      }
      let positions = lines[line].trim().split(' ')
      for (let position = 0; position < positions.length; position++) {
        if (positions[position].trim() != '') {
          tokens_[tokens_.length] = {
            symbol: positions[position].trim(),
            line: line + 1,
            position: position + 1
          }
          if (positions[position].trim() == 'entity') {
            let entity_name_ = positions[position + 1].trim()
            entity_name_ = entity_name_.includes(':')
              ? entity_name_.split(':')[1]
              : entity_name_
            if (
              !ycl_transpiler.ycl_reserved_word_contains(entity_name_) &&
              ycl_transpiler.check_schema_object_name(entity_name_)
            ) {
              if (entity_names_.includes(entity_name_)) {
                utils.notification(
                  "error: model inconsistency. entity name '" +
                    entity_name_ +
                    "' duplicated.",
                  'error'
                )
              } else {
                entity_names_.push(entity_name_)
              }
            }
          }
        }
      }
    }
    return tokens_
  },
  is_alpha: function (str) {
    var letters = /^[A-Za-z]*$/
    if (str.match(letters)) {
      return true
    } else {
      return false
    }
  },
  is_alphanum_lowercase: function (str) {
    return str.match(/^[a-z0-9]{2,}$/)
  },
  is_role_name_ok: function (str) {
    return str.match(/^[A-Z]{2,}$/)
  },
  check_schema_object_name: function (str) {
    return str.match(/^[a-z0-9]{2,}$/)
  },
  ycl_reserved_word_contains: function (token) {
    for (let index = 0; index < ycl_reserved_words.length; index++) {
      if (ycl_reserved_words[index].trim() == token.trim()) {
        return true
      }
    }
    return false
  },
  import: function (src) {
    // schema
    // entity
    for (let index = 0; index < src.length; index++) {
      let accumulator = ''
      for (let offset = index; offset < 5; offset++) {
        accumulator = accumulator + src.charAt(offset)
      }
      index = offset

      if (accumulator == 'schema' || accumulator == 'entity') {
        let auxiliar = new String(src)
        for (; src.charAt(offset) == ' '; offset++) {}
        conosle.log(auxiliar.splice(offset - 1, 'c:'))
        index = offset
      }
    }
  },
  db_type: 'sql',
  parse: function (src, gettypes) {
    let schema = {}
    let actual_entity = {}
    let actual_attribute = {}

    let code = ''

    let entity_names = []
    let tokens = ycl_transpiler.tokenizer_yc_code(src, entity_names)
    let code_body = ''
    let index = 0
    let from = 0

    ycl_transpiler.refs = {}

    while (index < tokens.length) {
      if (from == 0 && tokens[index].symbol == 'schema') {
        {
          /*
           * o nome do schema pode estar precedido de c: ou d:
           *
           */
          let aux = tokens[index + 1].symbol.split(':')
          if (aux.length == 2) {
            schema = {
              name: aux[1],
              command: aux[0],
              _conf: [],
              entities: []
            }
          } else {
            schema = {
              name: aux[0],
              command: '',
              _conf: [],
              entities: []
            }
          }
        }
        if (
          !ycl_transpiler.ycl_reserved_word_contains(schema.name) &&
          ycl_transpiler.check_schema_object_name(schema.name)
        ) {
          /*
           * reconhecer a declaração de schema
           *
           */
          code = code + tokens[index].symbol + ' ' + schema.name + ' '
          index++
          index++
          from = 1
        } else {
          utils.notification(
            "error: the token format is not lowercase, or matches some reserved word, or does not match only alpha characters. token '" +
              tokens[index + 1].symbol +
              "', line " +
              tokens[index + 1].line +
              ', position: ' +
              tokens[index + 1].position +
              '. [from: ' +
              from +
              ']',
            'error'
          )
        }
      } else if (
        from == 1 &&
        tokens[index].symbol == '(' &&
        (tokens[index + 1].symbol == 'enabled' ||
          tokens[index + 1].symbol == '!enabled' ||
          tokens[index + 1].symbol == 'u:enabled' ||
          tokens[index + 1].symbol == 'u:!enabled') &&
        tokens[index + 2].symbol.startsWith("'") &&
        tokens[index + 2].symbol.endsWith("'") &&
        tokens[index + 3].symbol.startsWith("'") &&
        tokens[index + 3].symbol.endsWith("'") &&
        tokens[index + 4].symbol == ')'
      ) {
        /*
         * reconhecer a declaração de configuracao de schema e a operação que,
         * eventualmente seja necessária realizar
         *
         */
        {
          let aux = tokens[index + 1].symbol.split(':')
          if (aux.length == 2) {
            schema._conf = {
              enabled: {
                value: !aux[1].startsWith('!'),
                command: 'u'
              }
            }
          } else {
            schema._conf = {
              enabled: {
                value: !aux[0].startsWith('!'),
                command: ''
              }
            }
          }
        }
        code =
          code +
          '(\n' +
          '  ' +
          tokens[index + 1].symbol.replace('u:', '') +
          '\n  ' +
          tokens[index + 2].symbol +
          ' \n  ' +
          tokens[index + 3].symbol +
          ' \n)'
        index = index + 5
        from = 2
      } else if (
        from == 1 &&
        tokens[index].symbol == '(' &&
        tokens[index + 1].symbol.startsWith("'") &&
        tokens[index + 1].symbol.endsWith("'") &&
        (tokens[index + 2].symbol == 'enabled' ||
          tokens[index + 2].symbol == '!enabled' ||
          tokens[index + 2].symbol == 'u:enabled' ||
          tokens[index + 2].symbol == 'u:!enabled') &&
        tokens[index + 3].symbol == ')'
      ) {
        /*
         * reconhecer a declaração de configuracao de schema e a operação que,
         * eventualmente seja necessária realizar
         *
         */
        {
          let aux = tokens[index + 2].symbol.split(':')
          if (aux.length == 2) {
            schema._conf = {
              enabled: {
                value: !aux[1].startsWith('!'),
                command: 'u'
              }
            }
          } else {
            schema._conf = {
              enabled: {
                value: !aux[0].startsWith('!'),
                command: ''
              }
            }
          }
        }
        code =
          code +
          '(\n' +
          '  ' +
          tokens[index + 2].symbol.replace('u:', '') +
          '\n  ' +
          tokens[index + 1].symbol +
          ' \n)'
        code =
          code +
          '(\n' +
          '  ' +
          tokens[index + 2].symbol.replace('u:', '') +
          '\n  ' +
          tokens[index + 1].symbol +
          '\n  ' +
          tokens[index + 3].symbol +
          ' \n)'
        index = index + 3
        from = 2
      } else if (from == 1 && tokens[index].symbol == '{') {
        /*
         * encaminhar para reconhecer a declaração de corpo de schema
         *
         */
        from = 2
      } else if (
        from == 2 &&
        tokens[index].symbol == '{' &&
        tokens[tokens.length - 1].symbol == '}'
      ) {
        code = code + ' {\nBODY}'
        index++
        from = 3
      } else if (from == 3 && tokens[index].symbol == 'entity') {
        {
          /* o nome do schema pode estar precedido de c: ou d: */
          let aux = tokens[index + 1].symbol.split(':')
          if (aux.length == 2) {
            actual_entity = {
              name: aux[1],
              command: aux[0],
              _conf: {
                dbType: 'sql',
                businessRule: false,
                concurrencyControl: false,
                accessControl: {
                  read: ['ADMIN'],
                  write: ['ADMIN']
                },
                uniqueKey: [],
                indexKey: []
              },
              attributes: []
            }
          } else {
            actual_entity = {
              name: aux[0],
              command: '',
              _conf: {
                dbType: 'sql',
                businessRule: false,
                concurrencyControl: false,
                accessControl: {
                  read: ['ADMIN'],
                  write: ['ADMIN']
                },
                uniqueKey: [],
                indexKey: []
              },
              attributes: []
            }
          }
        }
        if (
          !ycl_transpiler.ycl_reserved_word_contains(actual_entity.name) &&
          ycl_transpiler.check_schema_object_name(actual_entity.name)
        ) {
          schema.entities.push(actual_entity)
          if (actual_entity.command == 'd') {
            index++
            while (++index < tokens.length) {
              if (tokens[index].symbol == '(') {
                while (tokens[++index].symbol != ')') {
                  if (tokens[index].symbol == 'sql') {
                    ycl_transpiler.db_type = tokens[index].symbol
                    actual_entity._conf.dbType = ycl_transpiler.db_type
                  } else if (tokens[index].symbol == 'nosql') {
                    ycl_transpiler.db_type = 'nosql(columnar)'
                    actual_entity._conf.dbType = ycl_transpiler.db_type
                  }
                }
                ++index
              }
              if (tokens[index].symbol == '}') {
                // avaliar se após a declaração de remoção da entidade vem outra entidade
                // ou encerra-se a declaração de schema
                if (tokens[index + 1].symbol == 'entity') {
                  from = 3
                  index++
                  break
                } else if (tokens[index + 1].symbol == '}') {
                  from = 6
                  index++
                  break
                }
              }
            }
            if (index == tokens.length) {
              utils.notification(
                'error: neither a next entity was found, nor the end of the code after the entity declared to be delete.',
                'error'
              )
            }
          } else {
            if (gettypes) {
              types[actual_entity.name] =
                'export type ' + actual_entity.name + ' {\n'
            }
            code_body =
              code_body +
              '  ' +
              tokens[index].symbol +
              ' ' +
              tokens[index + 1].symbol.replace('c:', '').replace('d:', '')
            index++
            index++
            from = 4
          }
        } else {
          utils.notification(
            "error: the token format is not lowercase, or matches some reserved word, or does not match only alpha characters. token '" +
              tokens[index + 1].symbol +
              "', line " +
              tokens[index + 1].line +
              ', position: ' +
              tokens[index + 1].position +
              '. [from: ' +
              from +
              ']',
            'error'
          )
        }
      } else if (from == 4 && tokens[index].symbol == '(') {
        // <<<<<<< PODE Ñ SER (, ou seja vir {. tratar isso!
        code_body = code_body + ' ' + tokens[index].symbol + ' \n'
        index++
        while (tokens[index].symbol != ')') {
          if (tokens[index].symbol == 'sql') {
            ycl_transpiler.db_type = tokens[index].symbol
            actual_entity._conf.dbType = ycl_transpiler.db_type
            code_body = code_body + '    ' + tokens[index].symbol + '\n'
            index++
          } else if (tokens[index].symbol == 'nosql') {
            ycl_transpiler.db_type = tokens[index].symbol
            actual_entity._conf.dbType = ycl_transpiler.db_type
            code_body = code_body + '    ' + tokens[index].symbol
            if (tokens[++index].symbol == '(') {
              code_body = code_body + ' ' + tokens[index].symbol
              if (
                tokens[++index].symbol == 'columnar' ||
                tokens[index].symbol == 'document'
              ) {
                actual_entity._conf.dbType = ycl_transpiler.db_type
                  .concat('(')
                  .concat(tokens[index].symbol)
                  .concat(')')
                code_body = code_body + ' ' + tokens[index].symbol
                if (tokens[++index].symbol == ')') {
                  code_body = code_body + ' ' + tokens[index].symbol
                } else
                  utils.notification(
                    "error: unexpected token '" +
                      tokens[index].symbol +
                      "'. the expected token is ')'",
                    'error'
                  )
              } else
                utils.notification(
                  "error: unexpected token '" +
                    tokens[index].symbol +
                    "'. the expected token is 'columnar' or 'graph'",
                  'error'
                )
            }
            code_body = code_body + '\n'
            index++
          } else if (
            tokens[index].symbol == 'concurrencyControl' ||
            tokens[index].symbol == '!concurrencyControl' ||
            tokens[index].symbol == 'u:concurrencyControl' ||
            tokens[index].symbol == 'u:!concurrencyControl'
          ) {
            {
              let aux = tokens[index].symbol.split(':')
              if (aux.length == 2) {
                actual_entity._conf.concurrencyControl = {
                  value: aux[1].startsWith('c'),
                  command: aux[0]
                }
              } else {
                actual_entity._conf.concurrencyControl = {
                  value: aux[0].startsWith('c'),
                  command: ''
                }
              }
            }
            code_body =
              code_body + '    ' + tokens[index].symbol.replace('u:', '') + '\n'
            index++
          } else if (
            tokens[index].symbol == 'businessRule' ||
            tokens[index].symbol == '!businessRule' ||
            tokens[index].symbol == 'u:businessRule' ||
            tokens[index].symbol == 'u:!businessRule'
          ) {
            {
              let aux = tokens[index].symbol.split(':')
              if (aux.length == 2) {
                actual_entity._conf.businessRule = {
                  value: aux[1].startsWith('b'),
                  command: aux[0]
                }
              } else {
                actual_entity._conf.businessRule = {
                  value: aux[0].startsWith('b'),
                  command: ''
                }
              }
            }
            code_body =
              code_body + '    ' + tokens[index].symbol.replace('u:', '') + '\n'
            index++
          } else if (
            actual_entity._conf.dbType.startsWith('nosql') &&
            tokens[index].symbol == 'source' &&
            tokens[index + 1].symbol == '('
          ) {
            code_body =
              code_body +
              '    ' +
              tokens[index].symbol +
              ' ' +
              tokens[++index].symbol +
              '\n'
            code_body = code_body + '      ' + tokens[++index].symbol + '\n'
            actual_entity._conf.source = {
              value: tokens[index].symbol,
              command: ''
            }
            if (tokens[++index].symbol == ')') {
              code_body = code_body + '    ' + tokens[index].symbol + '\n'
            } else
              utils.notification(
                "error: unexpected token '" +
                  tokens[index].symbol +
                  "'. the expected token is ')'",
                'error'
              )
            index++
          } else if (
            actual_entity._conf.dbType.startsWith('nosql') &&
            (tokens[index].symbol == 'extension' ||
              tokens[index].symbol == 'u:extension') &&
            tokens[index + 1].symbol == '('
          ) {
            {
              let aux = tokens[index].symbol.split(':')
              if (aux.length == 2) {
                actual_entity._conf.extension = {
                  value: '',
                  command: aux[0]
                }
              } else {
                actual_entity._conf.extension = {
                  value: '',
                  command: ''
                }
              }
            }
            code_body =
              code_body +
              '    ' +
              tokens[index].symbol.replace('u:', '') +
              ' ' +
              tokens[++index].symbol +
              '\n'
            index++
            while (tokens[index].symbol != ')') {
              actual_entity._conf.extension.value =
                actual_entity._conf.extension.value +
                tokens[index].symbol +
                '\n'
              code_body = code_body + '      ' + tokens[index].symbol + '\n'
              index++
            }
            code_body = code_body + '    ' + tokens[index].symbol + '\n'
            index++
          } else if (
            actual_entity._conf.dbType == 'sql' &&
            (tokens[index].symbol == 'uniqueKey' ||
              tokens[index].symbol == 'u:uniqueKey') &&
            tokens[index + 1].symbol == '['
          ) {
            code_body =
              code_body +
              '    ' +
              tokens[index].symbol.replace('u:', '') +
              ' ' +
              tokens[index + 1].symbol +
              '\n'
            actual_entity._conf.uniqueKey = {
              values: [],
              command: ''
            }
            if (tokens[index].symbol.startsWith('u:')) {
              actual_entity._conf.uniqueKey.command = 'u'
            }
            index++
            index++
            while (tokens[index].symbol != ']') {
              if (
                !ycl_transpiler.ycl_reserved_word_contains(
                  tokens[index].symbol
                ) &&
                ycl_transpiler.check_schema_object_name(tokens[index].symbol)
              ) {
                actual_entity._conf.uniqueKey.values.push(tokens[index].symbol)
                code_body = code_body + '      ' + tokens[index].symbol + '\n'
                index++
              } else {
                utils.notification(
                  "error: attribute name incorrect into uniqueKey. token '" +
                    tokens[index].symbol +
                    "', line " +
                    tokens[index].line +
                    ', position: ' +
                    tokens[index].position +
                    '. [from: ' +
                    from +
                    ']',
                  'error'
                )
              }
            }
            code_body = code_body + '    ' + tokens[index].symbol + '\n' // o ']' do 'uniqueKey ['
            index++
          } else if (
            actual_entity._conf.dbType.startsWith('nosql') &&
            tokens[index].symbol == 'uniqueKey' &&
            tokens[index + 1].symbol == '('
          ) {
            code_body =
              code_body +
              '    ' +
              tokens[index].symbol +
              ' ' +
              tokens[++index].symbol +
              '\n'
            actual_entity._conf.uniqueKey = {
              partitionKeys: {
                values: []
              },
              clusteringColumns: {
                values: []
              }
            }
            let flag = true,
              hasPK = false
            index++
            while (flag) {
              if (
                tokens[index].symbol == 'partitionKeys' &&
                tokens[index + 1].symbol == '['
              ) {
                code_body =
                  code_body +
                  '      ' +
                  tokens[index].symbol +
                  ' ' +
                  tokens[++index].symbol +
                  '\n'
                index++
                while (tokens[index].symbol != ']') {
                  if (
                    !ycl_transpiler.ycl_reserved_word_contains(
                      tokens[index].symbol
                    ) &&
                    ycl_transpiler.check_schema_object_name(
                      tokens[index].symbol
                    )
                  ) {
                    actual_entity._conf.uniqueKey.partitionKeys.values.push(
                      tokens[index].symbol
                    )
                    code_body =
                      code_body + '        ' + tokens[index].symbol + '\n'
                    index++
                    hasPK = true
                  } else {
                    utils.notification(
                      "error: attribute name incorrect into uniqueKey. token '" +
                        tokens[index].symbol +
                        "', line " +
                        tokens[index].line +
                        ', position: ' +
                        tokens[index].position +
                        '. [from: ' +
                        from +
                        ']',
                      'error'
                    )
                  }
                }
                if (
                  actual_entity._conf.uniqueKey.partitionKeys.values.length == 0
                ) {
                  utils.notification(
                    'error: you must defined a primary key',
                    'error'
                  )
                }
                code_body = code_body + '      ' + tokens[index].symbol + '\n' // o ']' do 'partitionKeys ['
                index++
              } else if (
                tokens[index].symbol == 'clusteringColumns' &&
                tokens[index + 1].symbol == '['
              ) {
                code_body =
                  code_body +
                  '      ' +
                  tokens[index].symbol +
                  ' ' +
                  tokens[++index].symbol +
                  '\n'
                index++
                while (tokens[index].symbol != ']') {
                  if (
                    !ycl_transpiler.ycl_reserved_word_contains(
                      tokens[index].symbol
                    ) &&
                    ycl_transpiler.check_schema_object_name(
                      tokens[index].symbol
                    )
                  ) {
                    actual_entity._conf.uniqueKey.clusteringColumns.values.push(
                      tokens[index].symbol
                    )
                    code_body =
                      code_body + '        ' + tokens[index].symbol + '\n'
                    index++
                    hasPK = true
                  } else {
                    utils.notification(
                      "error: attribute name incorrect into uniqueKey. token '" +
                        tokens[index].symbol +
                        "', line " +
                        tokens[index].line +
                        ', position: ' +
                        tokens[index].position +
                        '. [from: ' +
                        from +
                        ']',
                      'error'
                    )
                  }
                }
                code_body = code_body + '      ' + tokens[index].symbol + '\n' // o ']' do 'clusteringColumns ['
                index++
              } else flag = false
            }
            if (!hasPK) {
              utils.notification('error: primary key undefined', 'error')
            }
            if (tokens[index].symbol == ')') {
              code_body = code_body + '    ' + tokens[index].symbol + '\n' // o ')' do 'primaryKey ('
            } else
              utils.notification(
                "error: unexpected token '" +
                  tokens[index].symbol +
                  "' (in line: " +
                  tokens[index].line +
                  "). the expected token is ')'",
                'error'
              )
            index++
          } else if (
            (tokens[index].symbol == 'indexKey' ||
              tokens[index].symbol == 'u:indexKey') &&
            tokens[index + 1].symbol == '['
          ) {
            code_body =
              code_body +
              '    ' +
              tokens[index].symbol.replace('u:', '') +
              ' ' +
              tokens[index + 1].symbol +
              '\n'
            actual_entity._conf.indexKey = {
              values: [],
              command: ''
            }
            if (tokens[index].symbol.startsWith('u:')) {
              actual_entity._conf.indexKey.command = 'u'
            }
            index++
            index++
            while (tokens[index].symbol != ']') {
              if (
                !ycl_transpiler.ycl_reserved_word_contains(
                  tokens[index].symbol
                ) &&
                ycl_transpiler.check_schema_object_name(tokens[index].symbol)
              ) {
                actual_entity._conf.indexKey.values.push(tokens[index].symbol)
                code_body = code_body + '      ' + tokens[index].symbol + '\n'
                index++
              } else {
                utils.notification(
                  "error: attribute name incorrect into indexKey. token '" +
                    tokens[index].symbol +
                    "', line " +
                    tokens[index].line +
                    ', position: ' +
                    tokens[index].position +
                    '. [from: ' +
                    from +
                    ']',
                  'error'
                )
              }
            }
            code_body = code_body + '    ' + tokens[index].symbol + '\n' // o ']' do 'indexKey ['
            index++
          } else if (
            (tokens[index].symbol == 'accessControl' ||
              tokens[index].symbol == 'u:accessControl') &&
            tokens[index + 1].symbol == '('
          ) {
            actual_entity._conf.accessControl = {
              read: {
                values: [],
                command: ''
              },
              write: {
                values: [],
                command: ''
              },
              command: ''
            }
            if (tokens[index].symbol.startsWith('u:')) {
              actual_entity._conf.accessControl.command = 'u'
            }
            code_body =
              code_body +
              '    ' +
              tokens[index].symbol.replace('u:', '') +
              ' ' +
              tokens[++index].symbol +
              '\n'
            index++
            while (tokens[index].symbol != ')') {
              if (
                tokens[index].symbol == 'read' &&
                tokens[index + 1].symbol == '['
              ) {
                code_body =
                  code_body +
                  '      ' +
                  tokens[index].symbol +
                  ' ' +
                  tokens[++index].symbol +
                  '\n'
                index++
                while (tokens[index].symbol != ']') {
                  if (
                    !ycl_transpiler.ycl_reserved_word_contains(
                      tokens[index].symbol
                    ) &&
                    ycl_transpiler.is_role_name_ok(tokens[index].symbol) &&
                    tokens[index].symbol.length > 2
                  ) {
                    actual_entity._conf.accessControl.read.values.push(
                      tokens[index].symbol
                    )
                    code_body =
                      code_body + '        ' + tokens[index].symbol + '\n'
                    index++
                  } else {
                    utils.notification(
                      "error: token format is not capitalized, or matches some reserved word, or does not start with length gt 2. token '" +
                        tokens[index].symbol +
                        "', line " +
                        tokens[index].line +
                        ', position: ' +
                        tokens[index].position +
                        '. [from: ' +
                        from +
                        ']',
                      'error'
                    )
                  }
                }
                code_body = code_body + '      ' + tokens[index].symbol + '\n' // o ']' do 'read ['
                index++
              } else if (
                tokens[index].symbol == 'write' &&
                tokens[index + 1].symbol == '['
              ) {
                code_body =
                  code_body +
                  '      ' +
                  tokens[index].symbol +
                  ' ' +
                  tokens[++index].symbol +
                  '\n'
                index++
                while (tokens[index].symbol != ']') {
                  if (
                    !ycl_transpiler.ycl_reserved_word_contains(
                      tokens[index].symbol
                    ) &&
                    ycl_transpiler.is_role_name_ok(tokens[index].symbol) &&
                    tokens[index].symbol.length > 2
                  ) {
                    actual_entity._conf.accessControl.write.values.push(
                      tokens[index].symbol
                    )
                    code_body =
                      code_body + '        ' + tokens[index].symbol + '\n'
                    index++
                  } else {
                    utils.notification(
                      "error: token format is not capitalized, or matches some reserved word, or does not start with length gt 2. token '" +
                        tokens[index].symbol +
                        "', line " +
                        tokens[index].line +
                        ', position: ' +
                        tokens[index].position +
                        '. [from: ' +
                        from +
                        ']',
                      'error'
                    )
                  }
                }
                code_body = code_body + '      ' + tokens[index].symbol + '\n' // o ']' do 'write ['
                index++
              } else {
                utils.notification(
                  "error: unknow token '" +
                    tokens[index].symbol +
                    "', line " +
                    tokens[index].line +
                    ', position: ' +
                    tokens[index].position +
                    '. [from: ' +
                    from +
                    ']',
                  'error'
                )
              }
            }
            code_body = code_body + '    ' + tokens[index].symbol + '\n' // o ')' do 'accessControl ('
            index++
          } else if (
            actual_entity._conf.dbType.equals('sql') &&
            tokens[index].symbol.startsWith('u:') &&
            !ycl_transpiler.ycl_reserved_word_contains(
              tokens[index].symbol.split(':')[1]
            ) &&
            ycl_transpiler.check_schema_object_name(
              tokens[index].symbol.split(':')[1]
            )
          ) {
            let aux = tokens[index].symbol.split(':')
            if (aux.length == 2) {
              actual_entity._conf.name = {
                value: aux[1],
                command: 'u'
              }
            } else {
              utils.notification(
                "error: unknow token '" +
                  tokens[index].symbol +
                  "', line " +
                  tokens[index].line +
                  ', position: ' +
                  tokens[index].position +
                  '. [from: ' +
                  from +
                  ']',
                'error'
              )
            }
            // code_body = code_body + '    ' + tokens[index].symbol.replace('u:','') + '\n';
            index++
          } else {
            utils.notification(
              "error: unknow token '" +
                tokens[index].symbol +
                "', line " +
                tokens[index].line +
                ', position: ' +
                tokens[index].position +
                '. [from: ' +
                from +
                ']',
              'error'
            )
          }
        }
        code_body = code_body + '  ' + tokens[index].symbol // o ')' do 'accessControl ('
        index++
        from = 5
      } else if (from == 5 && tokens[index].symbol == '{') {
        code_body = code_body + ' ' + tokens[index].symbol + '\n'
        /*
         * avaliar o corpo de uma entidade
         */
        index++
        while (tokens[index].symbol != '}') {
          {
            let aux = tokens[index].symbol
            if (aux.startsWith('c:') || aux.startsWith('d:')) {
              aux = aux.split(':')
              actual_attribute = {
                name: aux[1],
                command: aux[0],
                _conf: {
                  type: {
                    value: 'String',
                    command: ''
                  }
                }
              }
            } else {
              actual_attribute = {
                name: aux,
                command: '',
                _conf: {
                  type: {
                    value: 'String',
                    command: ''
                  }
                }
              }
            }
          }
          if (
            !ycl_transpiler.ycl_reserved_word_contains(actual_attribute.name) &&
            ycl_transpiler.check_schema_object_name(actual_attribute.name)
          ) {
            actual_entity.attributes.push(actual_attribute)
            if (actual_attribute.command == 'd') {
              index++
              if (tokens[index].symbol == '(') {
                let count = 0
                while (++index < tokens.length) {
                  if (tokens[index].symbol == '(') {
                    count++
                  } else if (count == 0 && tokens[index].symbol == ')') {
                    index++
                    break
                  } else if (tokens[index].symbol == ')') {
                    count--
                  }
                }
                if (index == tokens.length) {
                  utils.notification(
                    'error: neither a next attribute was found, nor the end of the code after the attribute declared to be delete.',
                    'error'
                  )
                }
              } else {
                /** começo da delcaração do attributo seguinte. index dispensa incremento */
              }
            } else {
              code_body =
                code_body +
                '    ' +
                tokens[index].symbol.replace('c:', '').replace('d:', '')
              index++
              if (tokens[index].symbol == '(') {
                code_body = code_body + ' ' + tokens[index].symbol + '\n'
                index++
                while (tokens[index].symbol != ')') {
                  if (
                    tokens[index].symbol == 'unique' ||
                    tokens[index].symbol == '!unique' ||
                    tokens[index].symbol == 'u:unique' ||
                    tokens[index].symbol == 'u:!unique'
                  ) {
                    {
                      let aux = tokens[index].symbol.split(':')
                      if (aux.length == 2) {
                        actual_attribute._conf.unique = {
                          value: aux[1] == 'unique',
                          command: aux[0]
                        }
                      } else {
                        actual_attribute._conf.unique = {
                          value: aux[0] == 'unique',
                          command: ''
                        }
                      }
                    }
                    code_body =
                      code_body +
                      '      ' +
                      tokens[index].symbol.replace('u:', '') +
                      '\n'
                    index++
                  } else if (
                    tokens[index].symbol == 'nullable' ||
                    tokens[index].symbol == '!nullable' ||
                    tokens[index].symbol == 'u:nullable' ||
                    tokens[index].symbol == 'u:!nullable'
                  ) {
                    {
                      let aux = tokens[index].symbol.split(':')
                      if (aux.length == 2) {
                        actual_attribute._conf.nullable = {
                          value: aux[1] == 'nullable',
                          command: aux[0]
                        }
                      } else {
                        actual_attribute._conf.nullable = {
                          value: aux[0] == 'nullable',
                          command: ''
                        }
                      }
                    }
                    code_body =
                      code_body +
                      '      ' +
                      tokens[index].symbol.replace('u:', '') +
                      '\n'
                    index++
                  } else if (
                    ycl_transpiler.db_type == 'nosql' &&
                    (tokens[index].symbol == 'source' ||
                      tokens[index].symbol == 'u:source') &&
                    tokens[index + 1].symbol == '('
                  ) {
                    actual_attribute._conf.source = {
                      value: {},
                      command: ''
                    }
                    if (tokens[index].symbol.startsWith('u:')) {
                      actual_attribute._conf.source.command = 'u'
                    }
                    code_body =
                      code_body +
                      '      ' +
                      tokens[index].symbol.replace('u:', '') +
                      ' ' +
                      tokens[++index].symbol +
                      '\n'
                    code_body =
                      code_body + '        ' + tokens[++index].symbol + '\n'
                    actual_attribute._conf.source.value.url =
                      tokens[index].symbol
                    code_body =
                      code_body + '        ' + tokens[++index].symbol + '\n'
                    actual_attribute._conf.source.value.field =
                      tokens[index].symbol
                    if (tokens[++index].symbol == ')') {
                      code_body =
                        code_body + '      ' + tokens[index].symbol + '\n'
                    } else
                      utils.notification(
                        "error: unexpected token '" +
                          tokens[index].symbol +
                          "' (in line: " +
                          tokens[index].line +
                          "). the expected token is ')'",
                        'error'
                      )
                    index++
                  } else if (
                    ycl_transpiler.db_type == 'nosql' &&
                    (tokens[index].symbol == 'extension' ||
                      tokens[index].symbol == 'u:extension') &&
                    tokens[index + 1].symbol == '('
                  ) {
                    actual_attribute._conf.extension = {
                      value: '',
                      command: ''
                    }
                    if (tokens[index].symbol.startsWith('u:')) {
                      actual_attribute._conf.extension.command = 'u'
                    }
                    code_body =
                      code_body +
                      '      ' +
                      tokens[index].symbol.replace('u:', '') +
                      ' ' +
                      tokens[++index].symbol +
                      '\n'
                    index++
                    while (tokens[index].symbol != ')') {
                      code_body =
                        code_body + '        ' + tokens[index].symbol + '\n'
                      actual_attribute._conf.extension.value =
                        actual_attribute._conf.extension.value +
                        tokens[index].symbol +
                        '\n'
                      index++
                    }
                    code_body =
                      code_body + '      ' + tokens[index].symbol + '\n'
                    index++
                  } else if (
                    (tokens[index].symbol == 'comment' ||
                      tokens[index].symbol == 'u:comment') &&
                    tokens[index + 1].symbol.startsWith("'") &&
                    tokens[index + 1].symbol.endsWith("'")
                  ) {
                    actual_attribute._conf.comment = {
                      value: '',
                      command: ''
                    }
                    if (tokens[index].symbol.startsWith('u:')) {
                      actual_attribute._conf.comment.command = 'u'
                    }
                    code_body =
                      code_body +
                      '      ' +
                      tokens[index].symbol.replace('u:', '') +
                      ' ' +
                      tokens[++index].symbol +
                      '\n'
                    actual_attribute._conf.comment.value = tokens[index].symbol
                    index++
                  } else if (
                    tokens[index].symbol == 'comment' &&
                    tokens[index + 1].symbol.startsWith("'") &&
                    !tokens[index + 1].symbol.endsWith("'")
                  ) {
                    actual_attribute._conf.comment = {
                      value: '',
                      command: ''
                    }
                    if (tokens[index].symbol.startsWith('u:')) {
                      actual_attribute._conf.comment.command = 'u'
                    }
                    code_body =
                      code_body +
                      '      ' +
                      tokens[index].symbol.replace('u:', '') +
                      " '" +
                      tokens[++index].symbol.replace("'", '')
                    actual_attribute._conf.comment.value =
                      tokens[index].symbol + '\n'
                    index++
                    while (!tokens[index].symbol.endsWith("'")) {
                      code_body = code_body + ' ' + tokens[index].symbol
                      actual_attribute._conf.comment.value =
                        actual_attribute._conf.comment.value +
                        tokens[index].symbol +
                        '\n'
                      index++
                    }

                    if (tokens[index].symbol.length == 1) {
                      code_body = code_body + tokens[index].symbol + '\n'
                    } else {
                      code_body =
                        code_body + ' '.concat(tokens[index].symbol) + '\n'
                    }
                    index++
                  } else if (
                    ycl_transpiler.types.includes(
                      tokens[index].symbol.split(':')[
                        tokens[index].symbol.split(':').length - 1
                      ]
                    )
                  ) {
                    let symbol = tokens[index].symbol.split(':')
                    actual_attribute._conf.type = {
                      value: symbol[symbol.length - 1],
                      command: ''
                    }
                    if (symbol.length == 2) {
                      actual_attribute._conf.type.command =
                        symbol[symbol.length - 2]
                    }
                    if (symbol[symbol.length - 1] == 'String') {
                      if (!isNaN(tokens[index + 1].symbol)) {
                        code_body =
                          code_body +
                          '      ' +
                          symbol[symbol.length - 1] +
                          ' ' +
                          tokens[++index].symbol +
                          '\n'
                        actual_attribute._conf.length = tokens[index].symbol
                        index++
                      } else if (
                        ycl_transpiler.types.includes(
                          tokens[index + 1].symbol
                        ) ||
                        tokens[index + 1].symbol == 'unique' ||
                        tokens[index + 1].symbol == '!unique' ||
                        tokens[index + 1].symbol == 'nullable' ||
                        tokens[index + 1].symbol == '!nullable' ||
                        tokens[index + 1].symbol == 'comment' ||
                        tokens[index + 1].symbol == ')'
                      ) {
                        code_body =
                          code_body + '      ' + tokens[index].symbol + '\n'
                        index++
                      } else {
                        utils.notification(
                          "error: unknow token. token '" +
                            tokens[index + 1].symbol +
                            "', line " +
                            tokens[index + 1].line +
                            ', position: ' +
                            tokens[index + 1].position +
                            '. [from: ' +
                            from +
                            ']',
                          'error'
                        )
                      }
                    } else if (symbol[symbol.length - 1] == 'Time') {
                      if (!isNaN(tokens[index + 1].symbol)) {
                        code_body =
                          code_body +
                          '      ' +
                          symbol[symbol.length - 1] +
                          ' ' +
                          tokens[++index].symbol +
                          '\n'
                        if (
                          Number(tokens[index].symbol) == 4 ||
                          Number(tokens[index].symbol) == 6
                        ) {
                          actual_attribute._conf.length = tokens[index].symbol
                        } else {
                          throw new Exception(
                            "error: time precision error. token '" +
                              tokens[index + 1].symbol +
                              "', line " +
                              tokens[index + 1].line +
                              ', position: ' +
                              tokens[index + 1].position +
                              '. [from: ' +
                              from +
                              ']'
                          )
                        }
                        index++
                      } else if (
                        ycl_transpiler.types.includes(
                          tokens[index + 1].symbol
                        ) ||
                        tokens[index + 1].symbol == 'unique' ||
                        tokens[index + 1].symbol == '!unique' ||
                        tokens[index + 1].symbol == 'nullable' ||
                        tokens[index + 1].symbol == '!nullable' ||
                        tokens[index + 1].symbol == 'comment' ||
                        tokens[index + 1].symbol == ')'
                      ) {
                        code_body =
                          code_body + '      ' + tokens[index].symbol + '\n'
                        index++
                      } else {
                        utils.notification(
                          "error: unknow token. token '" +
                            tokens[index + 1].symbol +
                            "', line " +
                            tokens[index + 1].line +
                            ', position: ' +
                            tokens[index + 1].position +
                            '. [from: ' +
                            from +
                            ']',
                          'error'
                        )
                      }
                    } else {
                      code_body =
                        code_body + '      ' + symbol[symbol.length - 1] + '\n'
                      index++
                    }
                  } else if (entity_names.includes(tokens[index].symbol)) {
                    if (!ycl_transpiler.refs[tokens[index].symbol]) {
                      ycl_transpiler.refs[tokens[index].symbol] = []
                    }

                    ycl_transpiler.refs[tokens[index].symbol].push({
                      entity_name: actual_entity.name,
                      attribute_name: actual_attribute.name,
                      attribute_command: actual_attribute.command
                    })

                    /*
                     * reconhece aqui a entidade da associação
                     *
                     */
                    actual_attribute._conf.type = {
                      value: tokens[index].symbol,
                      command: ''
                    }

                    if (!assocs[actual_attribute._conf.type.value]) {
                      assocs[actual_attribute._conf.type.value] = []
                    }
                    assocs[actual_attribute._conf.type.value].push(
                      actual_entity.name
                    )

                    actual_attribute._conf.nullable = false
                    code_body =
                      code_body + '      ' + tokens[index].symbol + '\n'
                    index++

                    new_assocs.push(JSON.stringify(actual_attribute))
                  } else if (
                    actual_entity._conf.dbType == 'sql' &&
                    tokens[index].symbol.startsWith('u:') &&
                    !ycl_transpiler.ycl_reserved_word_contains(
                      tokens[index].symbol.split(':')[1]
                    ) &&
                    ycl_transpiler.check_schema_object_name(
                      tokens[index].symbol.split(':')[1]
                    )
                  ) {
                    {
                      let aux = tokens[index].symbol.split(':')
                      if (aux.length == 2) {
                        actual_attribute._conf.name = {
                          value: aux[1],
                          command: 'u'
                        }
                      } else {
                        utils.notification(
                          "error: unknow token. token '" +
                            tokens[index].symbol +
                            "', line " +
                            tokens[index].line +
                            ', position: ' +
                            tokens[index].position +
                            '. [from: ' +
                            from +
                            ']',
                          'error'
                        )
                      }
                    }
                    code_body =
                      code_body +
                      '      ' +
                      tokens[index].symbol.replace('u:', '') +
                      '\n'
                    index++
                  } else {
                    // console.log('entity_names: ', entity_names)
                    utils.notification(
                      "error: unknow token. token '" +
                        tokens[index].symbol +
                        "', line " +
                        tokens[index].line +
                        ', position: ' +
                        tokens[index].position +
                        '. [from: ' +
                        from +
                        ']',
                      'error'
                    )
                  }
                }
                code_body = code_body + '    ' + tokens[index].symbol + '\n'
                index++
              } else {
                code_body = code_body + '\n'
              }
            }

            if (gettypes) {
              let nullable = ''
              if (
                actual_attribute._conf.nullable == undefined ||
                actual_attribute._conf.nullable.value == undefined ||
                actual_attribute._conf.nullable.value
              ) {
                nullable = '?'
              }

              let _type_ = 'string'
              if (
                actual_attribute._conf.type.value == 'Double' ||
                actual_attribute._conf.type.value == 'Float' ||
                actual_attribute._conf.type.value == 'Integer' ||
                actual_attribute._conf.type.value == 'Long' ||
                actual_attribute._conf.type.value == 'Number'
              ) {
                _type_ = 'number'
              } else if (actual_attribute._conf.type.value == 'Boolean') {
                _type_ = 'boolean'
              }

              types[actual_entity.name] =
                types[actual_entity.name] +
                '  ' +
                actual_attribute.name +
                nullable +
                ':' +
                _type_ +
                ';\n'
            }
          } else {
            utils.notification(
              "error: token matches some reserved word or length is less than 2. token '" +
                tokens[index].symbol +
                "', line " +
                tokens[index].line +
                ', position: ' +
                tokens[index].position +
                '. [from: ' +
                from +
                ']',
              'error'
            )
          }
        }
        code_body = code_body + '  ' + tokens[index].symbol + '\n' // o '}' do 'entity <name> {'
        index++
        from = 3
      } else if (from == 4 && tokens[index].symbol == '{') {
        from = 5
      } else {
        if (tokens.length - 1 == index) {
          if (gettypes) {
            for (const assoc in assocs) {
              for (let idx = 0; idx < assocs[assoc].length; idx++) {
                types[assoc] =
                  types[assoc] +
                  '  ' +
                  assocs[assoc][idx] +
                  's:Array<' +
                  assocs[assoc][idx] +
                  '>;\n'
              }
            }

            for (const type in types) {
              types[type] = types[type] + '}'
            }
          }

          // console.log('code ok')
        } else {
          utils.notification(
            "* error: unknow token '" +
              tokens[index].symbol +
              "', line " +
              tokens[index].line +
              ', position: ' +
              tokens[index].position +
              '. [from: ' +
              from +
              ']',
            'error'
          )
        }
        index++
      }
    }

    /* 
                 a - b
                  \ /
                   c
                   |
                   d

              a - a_b - b
                a_c b_c
                   c
                  c_d
                   d

                 (a_b):
                 [a,b]
              a.b     b.a
              a.c     b.c
     (a_c):  >   \   /  >  (b_c):
     [a,c]        c.a      [b,c]
                  c.b
                  c.d
                   |  >  (c_d):
                  d.c    [c,d]

                a: {
                    
                }
                a_b: {
                    b_var:b,
                    a_var:a
                }
                b: {
                    
                }

               (a.b,b.a)
             -a.b    -b.a
             -a.c    -b.c
   (a.c,c.a)  >  \   /  >  (b.c,c.b):
                 -c.a      
                 -c.b
                 -c.d
                   |  >  (c.d,d.c) 
                  d.c  
                  */

    let flag = true
    let toRemove = []
    let refs = []
    let targets = Object.keys(ycl_transpiler.refs) // [a, b, c, d]
    //console.log('targets: ', targets);
    for (let target_idx = 0; target_idx < targets.length; target_idx++) {
      // [0, 1, 2, 3]
      //console.log('target_idx: ', target_idx);
      let target = targets[target_idx] // a < [0:a, 1:b, 2:c, 3:d]
      //console.log('target: ', target);
      let sources = ycl_transpiler.refs[target] // [b, c, b]
      //console.log('sources: ', sources);
      for (let source_idx = 0; source_idx < sources.length; source_idx++) {
        // [0, 1, 2]
        //console.log('source_idx: ', source_idx);
        let source = sources[source_idx] // b < [0:b, 1:c, 2:b]
        //console.log('source: ', source);
        if (ycl_transpiler.refs[source.entity_name]) {
          // true
          //console.log('source "', source, '" validated');
          let sources_ = ycl_transpiler.refs[source.entity_name] // [c, a, a]
          //console.log('sources_: ', sources_);
          for (
            let source_idx_ = 0;
            source_idx_ < sources_.length;
            source_idx_++
          ) {
            // [0, 1, 2]
            //console.log('source_idx_: ', source_idx_);
            let refTarget = sources_[source_idx_].entity_name // c < [0:c, 1:a, 2:a], a < [0:c, 1:a, 2:a], a < [0:c, 1:a, 2:a]
            //console.log('refTarget: ', refTarget);
            //console.log(refTarget+' == '+target+': '+(refTarget == target));
            if (refTarget == target) {
              // false, true, true
              refs.push({
                source: Object(source), // b
                target: String(target) // a
              })

              let entity_idx = 0
              let attribute_idx = 0
              for (
                ;
                entity_idx < schema.entities.length && flag;
                entity_idx++
              ) {
                let entity = schema.entities[entity_idx]
                if (source.entity_name == entity.name) {
                  let attribute_idx = 0
                  for (
                    ;
                    attribute_idx < entity.attributes.length && flag;
                    attribute_idx++
                  ) {
                    let attribute = entity.attributes[attribute_idx]
                    if (source.attribute_name == attribute.name) {
                      flag = false
                      break
                    }
                  }
                }
              }
              toRemove.push({
                entity_idx: entity_idx,
                attribute_idx: attribute_idx
              })
            }
          }
        }
      }
    }

    let entities = schema.entities
    for (let ref_idx = 0; ref_idx < refs.length; ref_idx++) {
      let ref = refs[ref_idx]

      let associationEntityName = 'aewe'
      if (ref.source.entity_name > ref.target) {
        associationEntityName = associationEntityName
          .concat(ref.target)
          .concat(ref.source.entity_name)
      } else {
        associationEntityName = associationEntityName
          .concat(ref.source.entity_name)
          .concat(ref.target)
      }
      associationEntityName = String(associationEntityName.concat('ewea'))

      let hasEntity = false
      for (
        let entity_idx = 0;
        entity_idx < entities.length && !hasEntity;
        entity_idx++
      ) {
        let entity = entities[entity_idx]
        if (entity.name == associationEntityName) {
          if (Object.keys(entity.attributes).length == 1) {
            hasEntity = true
            entity._conf.uniqueKey.push(ref.source.attribute_name)
            entity.attributes.push({
              name: String(ref.source.attribute_name),
              command: '',
              _conf: {
                type: String(ref.target),
                nullable: false
              }
            })
          } else {
            utils.notification(
              'error: association between entities is inconsistency.',
              'error'
            )
          }
        }
      }

      if (!hasEntity) {
        let associationEntity = {
          command: 'c',
          name: associationEntityName,
          _conf: {
            dbType: 'sql',
            businessRule: false,
            concurrencyControl: false,
            indexKey: [],
            uniqueKey: [String(ref.source.attribute_name)],
            accessControl: {
              read: [],
              write: []
            }
          },
          attributes: [
            {
              name: String(ref.source.attribute_name),
              command: '',
              _conf: {
                type: String(ref.target),
                nullable: false
              }
            }
          ]
        }

        for (
          let entity_idx = 0;
          entity_idx < entities.length && !hasEntity;
          entity_idx++
        ) {
          let entity = entities[entity_idx]
          if (
            entity.name == ref.target ||
            entity.name == ref.source.entity_name
          ) {
            for (
              let read_idx = 0;
              read_idx < entity._conf.accessControl.read.length;
              read_idx++
            ) {
              if (
                !associationEntity._conf.accessControl.read.includes(
                  entity._conf.accessControl.read[read_idx]
                )
              ) {
                associationEntity._conf.accessControl.read.push(
                  entity._conf.accessControl.read[read_idx]
                )
              }
            }
            for (
              let write_idx = 0;
              write_idx < entity._conf.accessControl.write.length;
              write_idx++
            ) {
              if (
                !associationEntity._conf.accessControl.write.includes(
                  entity._conf.accessControl.write[write_idx]
                )
              ) {
                associationEntity._conf.accessControl.write.push(
                  entity._conf.accessControl.write[write_idx]
                )
              }
            }
          }
        }

        schema.entities.push(associationEntity)
      }
    }

    return {
      code: code.replace('BODY', code_body),
      schema: schema,
      src: src,
      types: types
    }
  },
  deploy: function (model, callback) {
    let schema = {
      name: model['name'],
      mutation: model['command']
    }

    let count = { e: 0, r: 0, t: 0 }

    let toCreateEntities = []
    let toCreateAssociations = []

    if (model['command'] == 'c') {
      ycl_transpiler.createSchema(schema, callback)
    } else if (model['command'] == 'd') {
      ycl_transpiler.deleteSchema(schema.name, callback)
    } else if (
      model['_conf']['enabled'] &&
      model['_conf']['enabled']['command'] == 'u'
    ) {
      let status = model['_conf']['enabled']['value'] ? 2 : 1
      ycl_transpiler.updateSchema(schema.name, { status: status }, callback)
    } else {
      let control = { value: true }

      Object.keys(model['entities']).forEach(function (entityName) {
        if (model['entities'][entityName]['command'] == 'c') {
          count.e = count.e + 1
        }
      })

      count.t = count.e

      Object.keys(model['entities']).forEach(function (key2) {
        if (control.value) {
          /* key2 é índice numerico no vetor entities */
          let entity = {
            name: model['entities'][key2]['name'],
            _conf: {
              dbType: model['entities'][key2]['_conf']['dbType'],
              concurrencyControl: false,
              businessRule: false,
              accessControl: {
                read: ['ADMIN'],
                write: ['ADMIN']
              },
              indexKey: [],
              comment: ''
            },
            attributes: [],
            associations: []
          }

          if (model['entities'][key2]['command'] == 'c') {
            let _conf = model['entities'][key2]['_conf']

            if (_conf.concurrencyControl && _conf.concurrencyControl.value) {
              entity._conf.concurrencyControl = _conf.concurrencyControl.value
            }

            if (_conf.businessRule && _conf.businessRule.value) {
              entity._conf.businessRule = _conf.businessRule.value
            }

            if (_conf.source && _conf.source.value) {
              entity._conf.source.url = _conf.source.value
            }

            if (_conf.extension && _conf.extension.value) {
              entity._conf.extension = _conf.extension.value
            }

            if (
              _conf.accessControl &&
              _conf.accessControl.read &&
              _conf.accessControl.read.values
            ) {
              entity._conf.accessControl.read = _conf.accessControl.read.values
            }

            if (
              _conf.accessControl &&
              _conf.accessControl.write &&
              _conf.accessControl.write.values
            ) {
              entity._conf.accessControl.write =
                _conf.accessControl.write.values
            }

            if (_conf.indexKey && _conf.indexKey.values) {
              entity._conf.indexKey = _conf.indexKey.values
            }

            if (_conf.dbType && _conf.dbType == 'nosql(columnar)') {
              entity._conf.uniqueKey = {}
              if (
                _conf.uniqueKey.partitionKeys &&
                _conf.uniqueKey.partitionKeys.values
              ) {
                entity._conf.uniqueKey.partitionKeys =
                  _conf.uniqueKey.partitionKeys.values
              }

              if (
                _conf.uniqueKey.clusteringColumns &&
                _conf.uniqueKey.clusteringColumns.values
              ) {
                entity._conf.uniqueKey.clusteringColumns =
                  _conf.uniqueKey.clusteringColumns.values
              }
            } else {
              entity._conf.uniqueKey = []
            }

            Object.keys(model['entities'][key2]['attributes']).forEach(
              function (key4) {
                let type_ = {
                  value: 'String',
                  length: 64
                }

                if (
                  model['entities'][key2]['attributes'][key4]['_conf']['type']
                ) {
                  type_.value =
                    model['entities'][key2]['attributes'][key4]['_conf'][
                      'type'
                    ].value
                  if (type_.value == 'String') {
                    if (
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'length'
                      ]
                    ) {
                      type_.length =
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'length'
                        ].value
                    }
                  } else delete type_.length
                }

                if (ycl_transpiler.types.includes(type_.value)) {
                  let attribute_ = {
                    name: model['entities'][key2]['attributes'][key4]['name'],
                    type: type_.value,
                    nullable: true,
                    unique: false
                    /*source: {
                                        url: null,
                                        field: null
                                    },
                                    extension: null*/
                  }

                  if (type_.length) {
                    attribute_.length = type_.length
                  }

                  if (
                    model['entities'][key2]['attributes'][key4]['_conf'][
                      'nullable'
                    ]
                  ) {
                    attribute_.nullable =
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'nullable'
                      ].value
                  }

                  if (
                    model['entities'][key2]['attributes'][key4]['_conf'][
                      'unique'
                    ]
                  ) {
                    attribute_.unique =
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'unique'
                      ].value
                  }

                  if (
                    model['entities'][key2]['attributes'][key4]['_conf'][
                      'source'
                    ]
                  ) {
                    attribute_.source =
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'source'
                      ].value
                  }

                  if (
                    model['entities'][key2]['attributes'][key4]['_conf'][
                      'extension'
                    ]
                  ) {
                    attribute_.extension =
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'extension'
                      ].value
                  }

                  entity.attributes.push(attribute_)
                } else {
                  let association_ = {
                    name: model['entities'][key2]['attributes'][key4]['name'],
                    type: type_.value,
                    nullable: false,
                    unique: false
                  }

                  if (
                    model['entities'][key2]['attributes'][key4]['_conf'][
                      'nullable'
                    ]
                  ) {
                    association_.nullable =
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'nullable'
                      ].value
                  }

                  if (
                    model['entities'][key2]['attributes'][key4]['_conf'][
                      'unique'
                    ]
                  ) {
                    association_.unique =
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'unique'
                      ].value
                  }

                  entity.associations.push(association_)
                }
              }
            )

            if (_conf.dbType == 'nosql(columnar)') {
              ycl_transpiler.createNoSQLEntity(schema.name, entity, callback)
              control.value = false
            } else {
              if (count.e == 1) {
                ycl_transpiler.createEntity(schema.name, entity, callback)

                control.value = false
              } else {
                if (entity.associations) {
                  for (let idx = 0; idx < entity.associations.length; idx++) {
                    toCreateAssociations.push(
                      JSON.parse(
                        JSON.stringify({
                          schema: schema.name,
                          entity: entity.name,
                          association: entity.associations[idx]
                        })
                      )
                    )

                    count.r = count.r + 1
                  }

                  count.t = count.e + count.r

                  entity.associations = []
                }

                toCreateEntities.push({
                  schema: schema.name,
                  entity: entity
                })
              }
            }
          } else if (model['entities'][key2]['command'] == 'd') {
            if (entity._conf.dbType == 'nosql(columnar)') {
              ycl_transpiler.deleteNoSQLEntity(
                schema.name,
                entity.name,
                callback
              )
            } else {
              ycl_transpiler.deleteEntity(schema.name, entity.name, callback)
            }
            control.value = false
          } else if (
            model['entities'][key2]['_conf']['concurrencyControl'] &&
            model['entities'][key2]['_conf']['concurrencyControl']['command'] ==
              'u'
          ) {
            if (entity._conf.dbType == 'nosql(columnar)') {
              ycl_transpiler.updateNoSQLEntity(
                schema.name,
                entity.name,
                {
                  _conf: {
                    concurrencyControl:
                      model['entities'][key2]['_conf']['concurrencyControl'][
                        'value'
                      ]
                  }
                },
                callback
              )
            } else {
              ycl_transpiler.updateEntity(
                schema.name,
                entity.name,
                {
                  _conf: {
                    concurrencyControl:
                      model['entities'][key2]['_conf']['concurrencyControl'][
                        'value'
                      ]
                  }
                },
                callback
              )
            }
            control.value = false
          } else if (
            model['entities'][key2]['_conf']['name'] &&
            model['entities'][key2]['_conf']['name']['command'] == 'u'
          ) {
            ycl_transpiler.updateEntity(
              schema.name,
              entity.name,
              {
                _conf: {
                  name: model['entities'][key2]['_conf']['name']['value']
                }
              },
              callback
            )
            control.value = false
          } else if (
            model['entities'][key2]['_conf']['businessRule'] &&
            model['entities'][key2]['_conf']['businessRule']['command'] == 'u'
          ) {
            if (entity._conf.dbType == 'nosql(columnar)') {
              ycl_transpiler.updateNoSQLEntity(
                schema.name,
                entity.name,
                {
                  _conf: {
                    concurrencyControl:
                      model['entities'][key2]['_conf']['businessRule']['value']
                  }
                },
                callback
              )
            } else {
              ycl_transpiler.updateEntity(
                schema.name,
                entity.name,
                {
                  _conf: {
                    concurrencyControl:
                      model['entities'][key2]['_conf']['businessRule']['value']
                  }
                },
                callback
              )
            }
            control.value = false
          } else if (
            model['entities'][key2]['_conf']['extension'] &&
            model['entities'][key2]['_conf']['extension']['command'] == 'u'
          ) {
            if (entity._conf.dbType == 'nosql(columnar)') {
              ycl_transpiler.updateNoSQLEntity(
                schema.name,
                entity.name,
                {
                  _conf: {
                    extension:
                      model['entities'][key2]['_conf']['extension']['value']
                  }
                },
                callback
              )
            } else {
              ycl_transpiler.updateEntity(
                schema.name,
                entity.name,
                {
                  _conf: {
                    extension:
                      model['entities'][key2]['_conf']['extension']['value']
                  }
                },
                callback
              )
            }
            control.value = false
          } else if (
            model['entities'][key2]['_conf']['accessControl'] &&
            model['entities'][key2]['_conf']['accessControl']['command'] == 'u'
          ) {
            if (entity._conf.dbType == 'nosql(columnar)') {
              ycl_transpiler.updateNoSQLEntity(
                schema.name,
                entity.name,
                {
                  _conf: {
                    accessControl: {
                      read: model['entities'][key2]['_conf']['accessControl'][
                        'read'
                      ]['values'],
                      write:
                        model['entities'][key2]['_conf']['accessControl'][
                          'write'
                        ]['values']
                    }
                  }
                },
                callback
              )
            } else {
              ycl_transpiler.updateEntity(
                schema.name,
                entity.name,
                {
                  _conf: {
                    accessControl: {
                      read: model['entities'][key2]['_conf']['accessControl'][
                        'read'
                      ]['values'],
                      write:
                        model['entities'][key2]['_conf']['accessControl'][
                          'write'
                        ]['values']
                    }
                  }
                },
                callback
              )
            }
            control.value = false
          } else if (
            entity._conf.dbType == 'sql' &&
            model['entities'][key2]['_conf']['uniqueKey'] &&
            model['entities'][key2]['_conf']['uniqueKey']['command'] == 'u'
          ) {
            ycl_transpiler.updateEntity(
              schema.name,
              entity.name,
              {
                _conf: {
                  uniqueKey:
                    model['entities'][key2]['_conf']['uniqueKey']['values']
                }
              },
              callback
            )
            control.value = false
          } else if (
            entity._conf.dbType == 'sql' &&
            model['entities'][key2]['_conf']['indexKey'] &&
            model['entities'][key2]['_conf']['indexKey']['command'] == 'u'
          ) {
            if (entity._conf.dbType == 'nosql(columnar)') {
              ycl_transpiler.updateNoSQLEntity(
                schema.name,
                entity.name,
                {
                  _conf: {
                    indexKey:
                      model['entities'][key2]['_conf']['indexKey']['values']
                  }
                },
                callback
              )
            } else {
              ycl_transpiler.updateEntity(
                schema.name,
                entity.name,
                {
                  _conf: {
                    indexKey:
                      model['entities'][key2]['_conf']['indexKey']['values']
                  }
                },
                callback
              )
            }
            control.value = false
          } else {
            Object.keys(model['entities'][key2]['attributes']).forEach(
              function (key4) {
                if (control.value) {
                  let type_ = {
                    value: 'String',
                    length: 64
                  }
                  if (
                    model['entities'][key2]['attributes'][key4]['_conf']['type']
                  ) {
                    type_.value =
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'type'
                      ].value
                    if (type_.value == 'String') {
                      if (
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'length'
                        ]
                      ) {
                        type_.length =
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'length'
                          ].value
                      }
                    } else delete type_.length
                  }
                  if (ycl_transpiler.types.includes(type_.value)) {
                    let attribute_ = {
                      name: model['entities'][key2]['attributes'][key4]['name'],
                      type: type_.value,
                      nullable: true,
                      unique: false,
                      source: {
                        url: null,
                        field: null
                      },
                      extension: null
                    }
                    if (type_.length) {
                      attribute_.length = type_.length
                    }
                    if (
                      model['entities'][key2]['attributes'][key4]['command'] ==
                      'c'
                    ) {
                      if (
                        type_.value == 'String' &&
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'length'
                        ]
                      ) {
                        attribute_.length =
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'length'
                          ]
                      }
                      if (
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'nullable'
                        ]
                      ) {
                        attribute_.nullable =
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'nullable'
                          ].value
                      }
                      if (
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'unique'
                        ]
                      ) {
                        attribute_.unique =
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'unique'
                          ].value
                      }
                      if (
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'source'
                        ]
                      ) {
                        attribute_.source =
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'source'
                          ].value
                      }
                      if (
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'extension'
                        ]
                      ) {
                        attribute_.extension =
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'extension'
                          ].value
                      }

                      if (entity._conf.dbType == 'nosql(columnar)') {
                        if (
                          attribute_.source.field == null &&
                          attribute_.source.url == null
                        ) {
                          delete attribute_.source
                        }
                        if (attribute_.extension == null) {
                          delete attribute_.extension
                        }
                        ycl_transpiler.createNoSQLAttribute(
                          schema.name,
                          entity.name,
                          attribute_,
                          callback
                        )
                      } else {
                        ycl_transpiler.createAttribute(
                          schema.name,
                          entity.name,
                          attribute_,
                          callback
                        )
                      }
                      control.value = false
                    } else if (
                      model['entities'][key2]['attributes'][key4]['command'] ==
                      'd'
                    ) {
                      if (entity._conf.dbType == 'nosql(columnar)') {
                        ycl_transpiler.deleteNoSQLAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          callback
                        )
                      } else {
                        ycl_transpiler.deleteAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          callback
                        )
                      }
                      control.value = false
                    } else if (
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'type'
                      ] &&
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'type'
                      ]['command'] == 'u'
                    ) {
                      let aux_attribute = {
                        type: model['entities'][key2]['attributes'][key4][
                          '_conf'
                        ]['type']['value']
                      }
                      if (
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'type'
                        ]['value'] == 'String' &&
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'length'
                        ] &&
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'length'
                        ]['command'] == 'u'
                      ) {
                        aux_attribute.length =
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'length'
                          ]
                      }

                      if (entity._conf.dbType == 'nosql(columnar)') {
                        ycl_transpiler.updateNoSQLAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          aux_attribute,
                          callback
                        )
                      } else {
                        ycl_transpiler.updateAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          aux_attribute,
                          callback
                        )
                      }
                      control.value = false
                    } else if (
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'name'
                      ] &&
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'name'
                      ]['command'] == 'u'
                    ) {
                      if (entity._conf.dbType == 'nosql(columnar)') {
                        ycl_transpiler.updateNoSQLAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          {
                            name: model['entities'][key2]['attributes'][key4][
                              '_conf'
                            ]['name']['value']
                          },
                          callback
                        )
                      } else {
                        ycl_transpiler.updateAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          {
                            name: model['entities'][key2]['attributes'][key4][
                              '_conf'
                            ]['name']['value']
                          },
                          callback
                        )
                      }
                      control.value = false
                    } else if (
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'nullable'
                      ] &&
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'nullable'
                      ]['command'] == 'u'
                    ) {
                      if (entity._conf.dbType == 'nosql(columnar)') {
                        ycl_transpiler.updateNoSQLAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          {
                            nullable:
                              model['entities'][key2]['attributes'][key4][
                                '_conf'
                              ]['nullable']['value']
                          },
                          callback
                        )
                      } else {
                        ycl_transpiler.updateAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          {
                            nullable:
                              model['entities'][key2]['attributes'][key4][
                                '_conf'
                              ]['nullable']['value']
                          },
                          callback
                        )
                      }
                      control.value = false
                    } else if (
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'unique'
                      ] &&
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'unique'
                      ]['command'] == 'u'
                    ) {
                      ycl_transpiler.updateAttribute(
                        schema.name,
                        entity.name,
                        attribute_.name,
                        {
                          unique:
                            model['entities'][key2]['attributes'][key4][
                              '_conf'
                            ]['unique']['value']
                        },
                        callback
                      )
                      control.value = false
                    } else if (
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'extension'
                      ] &&
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'extension'
                      ]['command'] == 'u'
                    ) {
                      if (entity._conf.dbType == 'nosql(columnar)') {
                        ycl_transpiler.updateNoSQLAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          {
                            extension:
                              model['entities'][key2]['attributes'][key4][
                                '_conf'
                              ]['extension']['value']
                          },
                          callback
                        )
                      } else {
                        ycl_transpiler.updateAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          {
                            extension:
                              model['entities'][key2]['attributes'][key4][
                                '_conf'
                              ]['extension']['value']
                          },
                          callback
                        )
                      }
                      control.value = false
                    } else if (
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'source'
                      ] &&
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'source'
                      ]['command'] == 'u'
                    ) {
                      if (entity._conf.dbType == 'nosql(columnar)') {
                        ycl_transpiler.updateNoSQLAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          {
                            source:
                              model['entities'][key2]['attributes'][key4][
                                '_conf'
                              ]['source']['value']
                          },
                          callback
                        )
                      } else {
                        ycl_transpiler.updateAttribute(
                          schema.name,
                          entity.name,
                          attribute_.name,
                          {
                            source:
                              model['entities'][key2]['attributes'][key4][
                                '_conf'
                              ]['source']['value']
                          },
                          callback
                        )
                      }
                      control.value = false
                    }
                  } else {
                    let association_ = {
                      name: model['entities'][key2]['attributes'][key4]['name'],
                      type: type_.value,
                      nullable: true,
                      unique: false
                    }
                    if (
                      model['entities'][key2]['attributes'][key4]['command'] ==
                      'c'
                    ) {
                      if (
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'nullable'
                        ]
                      ) {
                        association_.nullable =
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'nullable'
                          ].value
                      }
                      if (
                        model['entities'][key2]['attributes'][key4]['_conf'][
                          'unique'
                        ]
                      ) {
                        association_.unique =
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'unique'
                          ].value
                      }
                      ycl_transpiler.createAssociation(
                        schema.name,
                        entity.name,
                        association_,
                        callback
                      )
                      control.value = false
                    } else if (
                      model['entities'][key2]['attributes'][key4]['command'] ==
                      'd'
                    ) {
                      ycl_transpiler.deleteAssociation(
                        schema.name,
                        entity.name,
                        association_.name,
                        callback
                      )
                      control.value = false
                    } else if (
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'nullable'
                      ] &&
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'nullable'
                      ]['command'] == 'u'
                    ) {
                      let assoc = {
                        nullable:
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'nullable'
                          ]['value']
                      }
                      // console.log(
                      //   schema.name,
                      //   entity.name,
                      //   association_.name,
                      //   assoc
                      // )
                      ycl_transpiler.updateAssociation(
                        schema.name,
                        entity.name,
                        association_.name,
                        assoc,
                        callback
                      )
                      control.value = false
                    } else if (
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'unique'
                      ] &&
                      model['entities'][key2]['attributes'][key4]['_conf'][
                        'unique'
                      ]['command'] == 'u'
                    ) {
                      let assoc = {
                        unique:
                          model['entities'][key2]['attributes'][key4]['_conf'][
                            'unique'
                          ]['value']
                      }
                      // console.log(
                      //   schema.name,
                      //   entity.name,
                      //   association_.name,
                      //   assoc
                      // )
                      ycl_transpiler.updateAssociation(
                        schema.name,
                        entity.name,
                        association_.name,
                        assoc,
                        callback
                      )
                      control.value = false
                    }
                  }
                }
              }
            )
          }
        }
      })

      let resp = { status: 200, message: '' }

      let locallback = function (response) {
        count.t = count.t - 1
        if (count.t > 0) {
          if (resp.status != 200 && resp.status != 201) {
            resp.status = response.http.status
            resp.message = response.data + ' | ' + resp.message
          }
        } else {
          callback({
            http: { status: resp.status },
            data: { message: resp.message }
          })
        }
      }

      // console.log('count: ', count)

      if (toCreateEntities.length > 0) {
        for (let idx = 0; idx < toCreateEntities.length; idx++) {
          // console.log('toCreateEntities[' + idx + ']: ', toCreateEntities[idx])
          ycl_transpiler.createEntity(
            toCreateEntities[idx].schema,
            toCreateEntities[idx].entity,
            locallback
          )
        }
      }

      if (toCreateAssociations.length > 0) {
        for (let idx = 0; idx < toCreateAssociations.length; idx++) {
          // console.log(
          //   'toCreateAssociations[' + idx + ']: ',
          //   toCreateAssociations[idx]
          // )
          ycl_transpiler.createAssociation(
            toCreateAssociations[idx].schema,
            toCreateAssociations[idx].entity,
            toCreateAssociations[idx].association,
            locallback
          )
        }
      }

      if (
        control.value &&
        callback &&
        toCreateEntities.length == 0 &&
        toCreateAssociations.length == 0
      ) {
        callback({ http: { status: 100 }, data: {} })
      }
    }
  },
  createSchema: function (schema, callback) {
    // console.log('> create schema: ', schema)

    _gtools_lib.request(api.endpoint.modeling.schema.create, schema, callback)
  },
  updateSchema: function (schema, body, callback) {
    // console.log('update schema: ', schema, body)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.update)
    )
    endpoint_.url = endpoint_.url.replace('{projectName}', schema)
    _gtools_lib.request(endpoint_, body, callback)
  },
  deleteSchema: function (schema, callback) {
    // console.log('delete schema: ', schema)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.delete)
    )
    endpoint_.url = endpoint_.url.replace('{projectName}', schema)
    _gtools_lib.request(endpoint_, null, callback)
  },
  createEntity: function (schema, entity, callback) {
    // console.log('create entity: ', schema, entity)

    let endpoint = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.create)
    )
    endpoint.url = endpoint.url.replace('{projectName}', schema)
    _gtools_lib.request(endpoint, entity, callback)
    callback({ http: { status: 201 } })
  },
  createNoSQLEntity: function (schema, entity, callback) {
    // console.log('create nosql entity: ', schema, entity)

    let endpoint = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.createNoSQL)
    )
    endpoint.url = endpoint.url.replace('{projectName}', schema)
    _gtools_lib.request(endpoint, entity, callback)
  },
  updateEntity: function (schema, entity, body, callback) {
    // console.log('update entity: ', schema, entity, body)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.update)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
    _gtools_lib.request(endpoint_, body, callback)
  },
  updateNoSQLEntity: function (schema, entity, body, callback) {
    // console.log('update nosql entity: ', schema, entity, body)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.updateNoSQL)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
    _gtools_lib.request(endpoint_, body, callback)
  },
  deleteEntity: function (schema, entity, callback) {
    // console.log('delete entity: ', schema, entity)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.delete)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
    _gtools_lib.request(endpoint_, null, callback)
  },
  deleteNoSQLEntity: function (schema, entity, callback) {
    console.log('delete nosql entity: ', schema, entity)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.deleteNoSQL)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
    _gtools_lib.request(endpoint_, null, callback)
  },
  createAttribute: function (schema, entity, attribute, callback) {
    // console.log('create attribute: ', schema, entity, attribute)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.attribute.create)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
    _gtools_lib.request(endpoint_, attribute, callback)
  },
  createNoSQLAttribute: function (schema, entity, attribute, callback) {
    // console.log('create nosql attribute: ', schema, entity, attribute)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.attribute.createNoSQL)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
    _gtools_lib.request(endpoint_, attribute, callback)
  },
  updateAttribute: function (schema, entity, attribute, body, callback) {
    // console.log('update attribute: ', schema, entity, attribute, body)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.attribute.update)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
      .replace('{attributeName}', attribute)
    _gtools_lib.request(endpoint_, body, callback)
  },
  updateNoSQLAttribute: function (schema, entity, attribute, body, callback) {
    // console.log('update attribute: ', schema, entity, attribute, body)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.attribute.updateNoSQL)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
      .replace('{attributeName}', attribute)
    _gtools_lib.request(endpoint_, body, callback)
  },
  deleteAttribute: function (schema, entity, attribute, callback) {
    // console.log('delete attribute: ', schema, entity, attribute)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.attribute.delete)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
      .replace('{attributeName}', attribute)
    _gtools_lib.request(endpoint_, null, callback)
  },
  deleteNoSQLAttribute: function (schema, entity, attribute, callback) {
    // console.log('delete attribute: ', schema, entity, attribute)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.attribute.deleteNoSQL)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
      .replace('{attributeName}', attribute)
    _gtools_lib.request(endpoint_, null, callback)
  },
  createAssociation: function (schema, entity, association, callback) {
    // console.log('create association: ', schema, entity, association)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.relationship.create)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
    _gtools_lib.request(endpoint_, association, callback)
    callback({ http: { status: 201 } })
  },
  updateAssociation: function (schema, entity, association, body, callback) {
    // console.log('update association: ', schema, entity, association, body)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.relationship.update)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
      .replace('{associationName}', association)
    _gtools_lib.request(endpoint_, body, callback)
  },
  deleteAssociation: function (schema, entity, association, callback) {
    // console.log('delete association: ', schema, entity, association)

    let endpoint_ = JSON.parse(
      JSON.stringify(api.endpoint.modeling.schema.entity.relationship.delete)
    )
    endpoint_.url = endpoint_.url
      .replace('{projectName}', schema)
      .replace('{entityName}', entity)
      .replace('{associationName}', association)
    _gtools_lib.request(endpoint_, null, callback)
  }
}

//let response = ycl_transpiler.parse(__code);
//document.querySelector('pre').innerHTML = response.code;
//console.log(response.code);*/
//console.log(response.schema);
//ycl_transpiler.deploy(response.schema, function () {});
