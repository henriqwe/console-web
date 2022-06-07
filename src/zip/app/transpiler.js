const __code = 'schema pandemic (\n'
    +'  enabled\n'
    +') {\n'
    +'  entity covid19 (\n'
    +'    nosql ( columnar )\n'
    +'    accessControl (\n'
    +'      read [\n'
    +'        ROLE_PUBLIC\n'
    +'        ROLE_ADMIN\n'
    +'      ]\n'
    +'      write [\n'
    +'        ROLE_ADMIN\n'
    +'      ]\n'
    +'    )\n'
    +'    persistence (\n'
    +'      uniqueKey (\n'
    +'        partitionKeys [\n'
    +'          country,state\n'
    +'        ]\n'
    +'        clusteringColumns [\n'
    +'          county\n'
    +'        ]\n'
    +'      )\n'
    +'      indexKey [\n'
    +'      ]\n'
    +'    )\n'
    +'    extension (\n'
    +'      {"field":"value"}\n'
    +'    )\n'
    +'    source (\n'
    +'      url\n'
    +'    )\n'
    +'  ) {\n'
    +'    country (\n'
    +'      unique\n'
    +'      nullable\n'
    +'      source (\n'
    +'        url\n'
    +'        field\n'
    +'      )\n'
    +'      extension (\n'
    +'      )\n'
    +'    )\n'
    +'    state (\n'
    +'      String\n'
    +'      !nullable\n'
    +'      extension (\n'
    +'      )\n'
    +'    )\n'
    +'    county (\n'
    +'      String\n'
    +'      !nullable\n'
    +'      extension (\n'
    +'        {"field":"value"}\n'
    +'      )\n'
    +'    )\n'
    +'    cases (\n'
    +'      Number\n'
    +'      !nullable\n'
    +'      extension (\n'
    +'        {"field":"value"}\n'
    +'      )\n'
    +'    )\n'
    +'    co2 (\n'
    +'      Number\n'
    +'      !nullable\n'
    +'      source (\n'
    +'        http://localhost:8080/datamanager/\n'
    +'        CO2\n'
    +'      )\n'
    +'    )\n'
    +'  }\n'
    +'}\n';
    
    /*const code = 'schema locadora (\n'
    +'  enabled\n'
    +') {\n'
    +'  entity veiculos (\n'
    +'    concurrencyControl\n'
    +'    businessRule\n'
    +'    accessControl (\n'
    +'      read [\n'
    +'        ROLE_PUBLIC\n'
    +'        ROLE_ADMIN\n'
    +'      ]\n'
    +'      write [\n'
    +'        ROLE_ADMIN\n'
    +'      ]\n'
    +'    )\n'
    +'    persistence (\n'
    +'      uniqueKey [\n'
    +'        nome\n'
    +'      ]\n'
    +'      indexKey [\n'
    +'        marca\n'
    +'      ]\n'
    +'    )\n'
    +'  ) {\n'
    +'    marca (\n'
    +'      String 12\n'
    +'      unique\n'
    +'      nullable\n'
    +'      comment \'test\'\n'
    +'    )\n'
    +'  }\n'
    +'  entity unidade (\n'
    +'    !concurrencyControl\n'
    +'    businessRule\n'
    +'    accessControl (\n'
    +'      read [\n'
    +'        ROLE_PUBLIC\n'
    +'      ]\n'
    +'      write [\n'
    +'        ROLE_ADMIN\n'
    +'      ]\n'
    +'    )\n'
    +'    persistence (\n'
    +'      uniqueKey [\n'
    +'        identificador\n'
    +'      ]\n'
    +'      indexKey [\n'
    +'      ]\n'
    +'    )\n'
    +'  ) {\n'
    +'    identificador (\n'
    +'      String 12\n'
    +'      unique\n'
    +'      !nullable\n'
    +'      comment \'testing comments\'\n'
    +'    )\n'
    +'  }\n'
    +'}\n';*/

const ycl_reserved_words = ['schema', 'entity', 'enabled','extends','nullable','unique','comment',
    'concurrencyControl','businessRule','accessControl','read','write','persistence','uniqueKey',
    'indexKey','String','Boolean','Integer','Long','Double','Number','Date','Timestamp',
    'Text','File','_classDef','_conf','extension','source','nosql','dataset','timeseries', 'columnar',
    'partitionKeys','clusteringColumns'];

const ycl_transpiler = {
    types: [
        'String','Boolean','Integer','Long','Double','Number','Date','Timestamp','Text','File','Image','Binary'
    ],
    tokenizer_yc_code: function(text, entity_names_) {
        let tokens_ = [];
        let lines = text.split('\n');
        for (let line = 0; line < lines.length; line++) {
            if (lines[line].includes(',')) {
                if (!lines[line].startsWith('[') && !lines[line].endsWith(']')
                    && !lines[line].startsWith('(') && !lines[line].endsWith(')')
                    && !lines[line].startsWith('{') && !lines[line].endsWith('}')) {
                        lines[line] = lines[line].replaceAll(' ','').replaceAll(',', ' ');
                    let aux = lines[line].trim().split(' ');
                    if (!ycl_transpiler.ycl_reserved_word_contains(aux[0])) {
                        // go!
                    } else throw new Error('error: malformed syntax. the token found is a reserved word.');
                } else throw new Error('error: malformed list syntax.');
            }
            let positions = lines[line].trim().split(' ');
            for (let position = 0; position < positions.length; position++) {
                if (positions[position].trim() != '') {
                    tokens_[tokens_.length] = {
                        symbol: positions[position].trim(),
                        line: line+1,
                        position: position+1
                    };
                    if (positions[position].trim() == 'entity') {
                        let entity_name_ = positions[position + 1].trim();
                        if (!ycl_transpiler.ycl_reserved_word_contains(entity_name_) 
                            && ycl_transpiler.check_schema_object_name(entity_name_)) {
                            if (entity_names_.includes(entity_name_)) {
                                throw new Error('error: model inconsistency. entity name \''+entity_name_+'\' duplicated.');
                            } else {
                                entity_names_.push(entity_name_);
                            }
                        }
                    }
                }
            }
        }
        return tokens_;
    },
    is_alpha: function(str) {
        var letters = /^[A-Za-z]*$/;
        if(str.match(letters)) {
            return true;
        } else {
            return false;
        }
    },
    is_alphanum_lowercase: function(str) {
        return str.match(/^[a-z0-9]{2,}$/);
    },
    is_role_name_ok: function(str) {
        return str.match(/^ROLE_[A-Z]{2,}$/);
    },
    check_schema_object_name: function(str) {
        return str.match(/^[a-z0-9]{2,}$/);
    },
    ycl_reserved_word_contains: function (token) {
        for (let index = 0; index < ycl_reserved_words.length; index++) {
            if (ycl_reserved_words[index].trim() == token.trim()) {
                return true;
            }
        }
        return false;
    },
    db_type: 'sql',
    parse: function (src) {
        let schema = {};
        let actual_entity = {};
        let actual_attribute = {};

        let code = '';

        let entity_names = [];
        let tokens = ycl_transpiler.tokenizer_yc_code(src, entity_names);
        let code_body = '';
        let index = 0;
        let from = 0;

        while (index < tokens.length) {
            if (from == 0 && tokens[index].symbol == 'schema') {
                {
                    /* 
                     * o nome do schema pode estar precedido de c: ou d:
                     * 
                     */
                    let aux = tokens[index + 1].symbol.split(':');
                    if (aux.length == 2) {
                        schema = {
                            name: aux[1],
                            command: aux[0],
                            _conf: [],
                            entities: []
                        };
                    } else {
                        schema = {
                            name: aux[0],
                            command: '',
                            _conf: [],
                            entities: []
                        };
                    }
                }
                if (!ycl_transpiler.ycl_reserved_word_contains(schema.name) 
                    && ycl_transpiler.check_schema_object_name(schema.name)) {
                    /*
                     * reconhecer a declaração de schema
                     * 
                     */
                    code = code + tokens[index].symbol + ' ' + schema.name + ' ';
                    index++;
                    index++;
                    from = 1;
                } else {
                    console.log('error: the token format is not lowercase, or matches some reserved word, or does not match only alpha characters. token \''+tokens[index + 1].symbol+'\', line '+tokens[index + 1].line+', position: '+tokens[index + 1].position+'. [from: '+from+']');
                    return;
                }
            } else if (from == 1 && tokens[index].symbol == '('
                && (tokens[index + 1].symbol == 'enabled' || tokens[index + 1].symbol == '!enabled'
                  || tokens[index + 1].symbol == 'u:enabled' || tokens[index + 1].symbol == 'u:!enabled')
                && tokens[index + 2].symbol == ')') {
                    /*
                     * reconhecer a declaração de configuracao de schema e a operação que, 
                     * eventualmente seja necessária realizar
                     *  
                     */
                {
                    let aux = tokens[index + 1].symbol.split(':');
                    if (aux.length == 2) {
                        schema._conf.push({enabled:aux[0]})
                    }
                }
                code = code + '(\n' + '  ' + tokens[index + 1].symbol.replace('u:','') + ' \n)';
                index = index + 3;
                from = 2
            } else if (from == 1 && tokens[index].symbol == '{') {
                /*
                 * encaminhar para reconhecer a declaração de corpo de schema
                 *  
                 */
                from = 2
            } else if (from == 2 && (tokens[index].symbol == '{' && tokens[tokens.length - 1].symbol == '}')) {
                code = code + ' {\nBODY}';
                index++;
                from = 3
            } else if (from == 3 && tokens[index].symbol == 'entity') {
                {
                    /* o nome do schema pode estar precedido de c: ou d: */
                    let aux = tokens[index + 1].symbol.split(':');
                    if (aux.length == 2) {
                        actual_entity = {
                            name: aux[1],
                            command: aux[0],
                            _conf: {},
                            attributes: []
                        };
                    } else {
                        actual_entity = {
                            name: aux[0],
                            command: '',
                            _conf: {},
                            attributes: []
                        };
                    }
                }
                if (!ycl_transpiler.ycl_reserved_word_contains(actual_entity.name) 
                    && ycl_transpiler.check_schema_object_name(actual_entity.name)) {
                    code_body = code_body + '  ' + tokens[index].symbol + ' ' + tokens[index + 1].symbol.replace('c:','').replace('d:','');
                    index++;
                    index++;
                    from = 4;
                    schema.entities.push(actual_entity);
                } else {
                    console.log('error: the token format is not lowercase, or matches some reserved word, or does not match only alpha characters. token \''+tokens[index + 1].symbol+'\', line '+tokens[index + 1].line+', position: '+tokens[index + 1].position+'. [from: '+from+']');
                    return
                }
            } else if (from == 4 && tokens[index].symbol == '(') { // <<<<<<< PODE Ñ SER (, ou seja vir {. tratar isso!
                code_body = code_body + ' ' + tokens[index].symbol + ' \n';
                index++;
                while (tokens[index].symbol  != ')') {
                    if (tokens[index].symbol == 'nosql' || tokens[index].symbol == 'sql') {
                        ycl_transpiler.db_type = tokens[index].symbol;
                        actual_entity._conf.dbType = ycl_transpiler.db_type;
                        code_body = code_body + '    ' + tokens[index].symbol;
                        if (tokens[++index].symbol == '(') {
                            code_body = code_body + ' ' + tokens[index].symbol;
                            if (tokens[++index].symbol == 'columnar' || tokens[index].symbol == 'document') {
                                actual_entity._conf.dbType = ycl_transpiler.db_type.concat('(').concat(tokens[index].symbol).concat(')');
                                code_body = code_body + ' ' + tokens[index].symbol;
                                if (tokens[++index].symbol == ')') {
                                    code_body = code_body + ' ' + tokens[index].symbol;
                                } else throw new Error('error: unexpected token \''+tokens[index].symbol+'\'. the expected token is \')\'');
                            } else throw new Error('error: unexpected token \''+tokens[index].symbol+'\'. the expected token is \'columnar\' or \'graph\'');
                        }
                        code_body = code_body + '\n';
                        index++;
                    } else if (tokens[index].symbol == 'concurrencyControl' || tokens[index].symbol == '!concurrencyControl' 
                        || tokens[index].symbol == 'u:concurrencyControl' || tokens[index].symbol == 'u:!concurrencyControl') {
                        {
                            let aux = tokens[index].symbol.split(':')
                            if (aux.length == 2) {
                                actual_entity._conf.concurrencyControl = {
                                    value: aux[1].startsWith('c'),
                                    command: aux[0]
                                };
                            } else {
                                actual_entity._conf.concurrencyControl = {
                                    value: aux[0].startsWith('c'),
                                    command: ''
                                };
                            }
                        }
                        code_body = code_body + '    ' + tokens[index].symbol.replace('u:','') + '\n';
                        index++;
                    } else if (tokens[index].symbol == 'businessRule' || tokens[index].symbol == '!businessRule'
                        || tokens[index].symbol == 'u:businessRule' || tokens[index].symbol == 'u:!businessRule') {
                        {
                            let aux = tokens[index].symbol.split(':')
                            if (aux.length == 2) {
                                actual_entity._conf.businessRule = {
                                    value: aux[1].startsWith('b'),
                                    command: aux[0]
                                };
                            } else {
                                actual_entity._conf.businessRule = {
                                    value: aux[0].startsWith('b'),
                                    command: ''
                                };
                            }
                        }
                        code_body = code_body + '    ' + tokens[index].symbol.replace('u:','') + '\n';
                        index++;
                    } else if (actual_entity._conf.dbType.startsWith('nosql') && tokens[index].symbol == 'source' && tokens[index + 1].symbol == '(') {
                        code_body = code_body + '    ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                        code_body = code_body + '      ' + tokens[++index].symbol + '\n';
                        actual_entity._conf.source = {
                            value: tokens[index].symbol,
                            command: ''
                        };
                        if (tokens[++index].symbol == ')') {
                            code_body = code_body + '    ' + tokens[index].symbol + '\n';
                        } else throw new Error('error: unexpected token \''+tokens[index].symbol+'\'. the expected token is \')\'');
                        index++;
                    } else if (actual_entity._conf.dbType.startsWith('nosql') 
                        && (tokens[index].symbol == 'extension' || tokens[index].symbol == 'u:extension') && tokens[index + 1].symbol == '(') {
                        {
                            let aux = tokens[index].symbol.split(':')
                            if (aux.length == 2) {
                                actual_entity._conf.extension = {
                                    value: '',
                                    command: aux[0]
                                };
                            } else {
                                actual_entity._conf.extension = {
                                    value: '',
                                    command: ''
                                };
                            }
                        }
                        code_body = code_body + '    ' + tokens[index].symbol.replace('u:','') + ' ' + tokens[++index].symbol + '\n';
                        index++;
                        while (tokens[index].symbol != ')') 
                        {
                            actual_entity._conf.extension.value = actual_entity._conf.extension.value + tokens[index].symbol + '\n'
                            code_body = code_body + '      ' + tokens[index].symbol + '\n';
                            index++;
                        }
                        code_body = code_body + '    ' + tokens[index].symbol + '\n';
                        index++;
                    } else if (tokens[index].symbol == 'persistence' && tokens[index + 1].symbol == '(') {
                        code_body = code_body + '    ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                        index++;
                        while (tokens[index].symbol  != ')') {
                            if (actual_entity._conf.dbType == 'sql' 
                                && (tokens[index].symbol == 'uniqueKey' || tokens[index].symbol == 'u:uniqueKey') && tokens[index + 1].symbol == '[') {
                                code_body = code_body + '      ' + tokens[index].symbol.replace('u:','') + ' ' + tokens[index + 1].symbol + '\n';
                                actual_entity._conf.uniqueKey = {
                                    values: [],
                                    command: ''
                                };
                                if (tokens[index].symbol.startsWith('u:')) {
                                    actual_entity._conf.uniqueKey.command = 'u';
                                }
                                index++;
                                index++;
                                while (tokens[index].symbol  != ']') {
                                    if (!ycl_transpiler.ycl_reserved_word_contains(tokens[index].symbol) 
                                        && ycl_transpiler.check_schema_object_name(tokens[index].symbol)) {
                                        actual_entity._conf.uniqueKey.values.push(tokens[index].symbol);
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n';
                                        index++;
                                    } else {
                                        console.log('error: attribute name incorrect into uniqueKey. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                        return;
                                    }
                                }
                                code_body = code_body + '      ' + tokens[index].symbol + '\n'; // o ']' do 'uniqueKey ['
                                index++;
                            } else if (actual_entity._conf.dbType.startsWith('nosql') && tokens[index].symbol == 'uniqueKey' && tokens[index + 1].symbol == '(') {
                                code_body = code_body + '      ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                actual_entity._conf.uniqueKey = {
                                    partitionKeys: {
                                        values: []
                                    },
                                    clusteringColumns: {
                                        values: []
                                    }
                                };
                                let flag = true, hasPK = false;
                                index++;
                                while (flag) {
                                    if (tokens[index].symbol == 'partitionKeys' && tokens[index + 1].symbol == '[') {
                                        code_body = code_body + '        ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                        index++;
                                        while (tokens[index].symbol  != ']') {
                                            if (!ycl_transpiler.ycl_reserved_word_contains(tokens[index].symbol) 
                                                && ycl_transpiler.check_schema_object_name(tokens[index].symbol)) {
                                                actual_entity._conf.uniqueKey.partitionKeys.values.push(tokens[index].symbol);
                                                code_body = code_body + '          ' + tokens[index].symbol + '\n';
                                                index++;
                                                hasPK = true;
                                            } else {
                                                console.log('error: attribute name incorrect into uniqueKey. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                                return;
                                            }
                                        }
                                        if (actual_entity._conf.uniqueKey.partitionKeys.values.length == 0) {
                                            throw new Error('error: you must defined a primary key');
                                        }
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n'; // o ']' do 'partitionKeys ['
                                        index++;
                                    } else if (tokens[index].symbol == 'clusteringColumns' && tokens[index + 1].symbol == '[') {
                                        code_body = code_body + '        ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                        index++;
                                        while (tokens[index].symbol  != ']') {
                                            if (!ycl_transpiler.ycl_reserved_word_contains(tokens[index].symbol) 
                                                && ycl_transpiler.check_schema_object_name(tokens[index].symbol)) {
                                                actual_entity._conf.uniqueKey.clusteringColumns.values.push(tokens[index].symbol);
                                                code_body = code_body + '          ' + tokens[index].symbol + '\n';
                                                index++;
                                                hasPK = true;
                                            } else {
                                                console.log('error: attribute name incorrect into uniqueKey. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                                return;
                                            }
                                        }
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n'; // o ']' do 'clusteringColumns ['
                                        index++;
                                    } else flag = false;
                                }

                                if (!hasPK) {
                                    throw new Error('error: primary key undefined');
                                }

                                if (tokens[index].symbol == ')') {
                                    code_body = code_body + '      ' + tokens[index].symbol + '\n'; // o ')' do 'primaryKey ('
                                } else throw new Error('error: unexpected token \''+tokens[index].symbol+'\' (in line: '+tokens[index].line+'). the expected token is \')\'');
                                index++
                            } else if ((tokens[index].symbol == 'indexKey' || tokens[index].symbol == 'u:indexKey') && tokens[index + 1].symbol == '[') {
                                code_body = code_body + '      ' + tokens[index].symbol.replace('u:','') + ' ' + tokens[index + 1].symbol + '\n';
                                actual_entity._conf.indexKey = {
                                    values: [],
                                    command: ''
                                };
                                if (tokens[index].symbol.startsWith('u:')) {
                                    actual_entity._conf.indexKey.command = 'u';
                                }
                                index++;
                                index++;
                                while (tokens[index].symbol  != ']') {
                                    if (!ycl_transpiler.ycl_reserved_word_contains(tokens[index].symbol) 
                                        && ycl_transpiler.check_schema_object_name(tokens[index].symbol)) {
                                        actual_entity._conf.indexKey.values.push(tokens[index].symbol);
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n';
                                        index++;
                                    } else {
                                        console.log('error: attribute name incorrect into indexKey. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                        return;
                                    }
                                }
                                code_body = code_body + '      ' + tokens[index].symbol + '\n'; // o ']' do 'indexKey ['
                                index++;
                            } else {
                                console.log('error: unknow token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                return;
                            }
                        }
                        code_body = code_body + '    ' + tokens[index].symbol + '\n'; // o ')' do 'persistence ('
                        index++;
                    } else if ((tokens[index].symbol == 'accessControl' || tokens[index].symbol == 'u:accessControl') 
                        && tokens[index + 1].symbol == '(') {
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
                        };
                        if (tokens[index].symbol.startsWith('u:')) {
                            actual_entity._conf.accessControl.command = 'u';
                        }
                        code_body = code_body + '    ' + tokens[index].symbol.replace('u:','') + ' ' + tokens[++index].symbol + '\n';
                        index++;
                        while (tokens[index].symbol  != ')') {
                            if (tokens[index].symbol == 'read' && tokens[index + 1].symbol == '[') {
                                code_body = code_body + '      ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                index++;
                                while (tokens[index].symbol  != ']') {
                                    if (!ycl_transpiler.ycl_reserved_word_contains(tokens[index].symbol) 
                                        && ycl_transpiler.is_role_name_ok(tokens[index].symbol)
                                        && tokens[index].symbol.startsWith('ROLE_')) {
                                        actual_entity._conf.accessControl.read.values.push(tokens[index].symbol);
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n';
                                        index++;
                                    } else {
                                        console.log('error: token format is not capitalized, or matches some reserved word, or does not start with \'ROLE_\'. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                        return;
                                    }
                                }
                                code_body = code_body + '      ' + tokens[index].symbol + '\n'; // o ']' do 'read ['
                                index++;
                            } else if (tokens[index].symbol == 'write' && tokens[index + 1].symbol == '[') {
                                code_body = code_body + '      ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                index++;
                                while (tokens[index].symbol  != ']') {
                                    if (!ycl_transpiler.ycl_reserved_word_contains(tokens[index].symbol) 
                                        && ycl_transpiler.is_role_name_ok(tokens[index].symbol)
                                        && tokens[index].symbol.startsWith('ROLE_')) {
                                        actual_entity._conf.accessControl.write.values.push(tokens[index].symbol);
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n';
                                        index++;
                                    } else {
                                        console.log('error: token format is not capitalized, or matches some reserved word, or does not start with \'ROLE_\'. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                        return;
                                    }
                                }
                                code_body = code_body + '      ' + tokens[index].symbol + '\n'; // o ']' do 'write ['
                                index++;
                            } else {
                                console.log('error: unknow token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                return;
                            }
                        }
                        code_body = code_body + '    ' + tokens[index].symbol + '\n'; // o ')' do 'accessControl ('
                        index++;
                    } else {
                        console.log('error: unknow token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                        return;
                    }
                }
                code_body = code_body + '  ' + tokens[index].symbol; // o ')' do 'accessControl ('
                index++;
                from = 5;
            } else if (from == 5 && tokens[index].symbol == '{') {
                code_body = code_body + ' ' + tokens[index].symbol + '\n';
                /* 
                 * avaliar o corpo de uma entidade
                 */
                index++;
                while (tokens[index].symbol != '}') {
                    {
                        let aux = tokens[index].symbol;
                        if (aux.startsWith('c:') || aux.startsWith('d:')) {
                            aux = aux.split(':')
                            actual_attribute = {
                                name: aux[1],
                                command: aux[0],
                                _conf: {},
                            }
                        } else {
                            actual_attribute = {
                                name: aux,
                                command: '',
                                _conf: {},
                            }
                        }
                    }
                    if ((!ycl_transpiler.ycl_reserved_word_contains(actual_attribute.name) 
                        && ycl_transpiler.check_schema_object_name(actual_attribute.name))) {
                        actual_entity.attributes.push(actual_attribute);
                        code_body = code_body + '    ' + tokens[index].symbol.replace('c:','').replace('d:',''); 
                        index++;
                        if (tokens[index].symbol == '(') {
                            code_body = code_body + ' ' + tokens[index].symbol + '\n'; 
                            index++;
                            while (tokens[index].symbol != ')') {
                                if (tokens[index].symbol == 'unique' || tokens[index].symbol == '!unique'
                                    || tokens[index].symbol == 'u:unique' || tokens[index].symbol == 'u:!unique') {
                                    {
                                        let aux = tokens[index].symbol.split(':');
                                        if (aux.length == 2) {
                                            actual_attribute._conf.unique = {
                                                value: aux[1] == 'unique',
                                                command: aux[0]
                                            };
                                        } else {
                                            actual_attribute._conf.unique = {
                                                value: aux[0] == 'unique',
                                                command: ''
                                            };
                                        }
                                    }
                                    code_body = code_body + '      ' + tokens[index].symbol.replace('u:','') + '\n';
                                    index++;
                                } else if (tokens[index].symbol == 'nullable' || tokens[index].symbol == '!nullable'
                                    || tokens[index].symbol == 'u:nullable' || tokens[index].symbol == 'u:!nullable') {
                                    {
                                        let aux = tokens[index].symbol.split(':')
                                        if (aux.length == 2) {
                                            actual_attribute._conf.nullable = {
                                                value: aux[1] == 'nullable',
                                                command: aux[0]
                                            };
                                        } else {
                                            actual_attribute._conf.nullable = {
                                                value: aux[0] == 'nullable',
                                                command: ''
                                            };
                                        }
                                    }
                                    code_body = code_body + '      ' + tokens[index].symbol.replace('u:','') + '\n';
                                    index++;
                                } else if (ycl_transpiler.db_type == 'nosql' 
                                    && (tokens[index].symbol == 'source' || tokens[index].symbol == 'u:source') && tokens[index + 1].symbol == '(') {
                                    actual_attribute._conf.source = {
                                        value: {},
                                        command: ''
                                    };
                                    if (tokens[index].symbol.startsWith('u:')) {
                                        actual_attribute._conf.source.command = 'u';
                                    }
                                    code_body = code_body + '      ' + tokens[index].symbol.replace('u:','') + ' ' + tokens[++index].symbol + '\n';
                                    code_body = code_body + '        ' + tokens[++index].symbol + '\n';
                                    actual_attribute._conf.source.value.url = tokens[index].symbol;
                                    code_body = code_body + '        ' + tokens[++index].symbol + '\n';
                                    actual_attribute._conf.source.value.field = tokens[index].symbol;
                                    if (tokens[++index].symbol == ')') {
                                        code_body = code_body + '      ' + tokens[index].symbol + '\n';
                                    } else throw new Error('error: unexpected token \''+tokens[index].symbol+'\' (in line: '+tokens[index].line+'). the expected token is \')\'');
                                    index++;
                                } else if (ycl_transpiler.db_type == 'nosql' 
                                    && (tokens[index].symbol == 'extension' || tokens[index].symbol == 'u:extension') && tokens[index + 1].symbol == '(') {
                                    actual_attribute._conf.extension = {
                                        value: '',
                                        command: ''
                                    };
                                    if (tokens[index].symbol.startsWith('u:')) {
                                        actual_attribute._conf.extension.command = 'u';
                                    }
                                    code_body = code_body + '      ' + tokens[index].symbol.replace('u:','') + ' ' + tokens[++index].symbol + '\n';
                                    index++;
                                    while (tokens[index].symbol != ')') 
                                    {
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n';
                                        actual_attribute._conf.extension.value = actual_attribute._conf.extension.value + tokens[index].symbol + '\n';
                                        index++;
                                    }
                                    code_body = code_body + '      ' + tokens[index].symbol + '\n';
                                    index++;
                                } else if ((tokens[index].symbol == 'comment' || tokens[index].symbol == 'u:comment') 
                                    && tokens[index + 1].symbol.startsWith('\'') && tokens[index + 1].symbol.endsWith('\'')) {
                                    actual_attribute._conf.comment = {
                                        value: '',
                                        command: ''
                                    };
                                    if (tokens[index].symbol.startsWith('u:')) {
                                        actual_attribute._conf.comment.command = 'u';
                                    }
                                    code_body = code_body + '      ' + tokens[index].symbol.replace('u:','') + ' ' + tokens[++index].symbol + '\n';
                                    actual_attribute._conf.comment.value = tokens[index].symbol;
                                    index++;
                                } else if (tokens[index].symbol == 'comment' && tokens[index + 1].symbol.startsWith('\'') && !tokens[index + 1].symbol.endsWith('\'')) {
                                    actual_attribute._conf.comment = {
                                        value: '',
                                        command: ''
                                    };
                                    if (tokens[index].symbol.startsWith('u:')) {
                                        actual_attribute._conf.comment.command = 'u';
                                    }
                                    code_body = code_body + '      ' + tokens[index].symbol.replace('u:','') + ' \'' + tokens[++index].symbol.replace('\'','');
                                    actual_attribute._conf.comment.value = tokens[index].symbol + '\n';
                                    index++;
                                    while (!tokens[index].symbol.endsWith('\'')) {
                                        code_body = code_body + ' ' + tokens[index].symbol;
                                        actual_attribute._conf.comment.value = actual_attribute._conf.comment.value + tokens[index].symbol + '\n';
                                        index++;
                                    }
                                    
                                    if (tokens[index].symbol.length == 1) {
                                        code_body = code_body + tokens[index].symbol + '\n';
                                    } else {
                                        code_body = code_body + ' '.concat(tokens[index].symbol) + '\n';
                                    }
                                    index++;
                                } else if (ycl_transpiler.types.includes(tokens[index].symbol.split(':')[tokens[index].symbol.split(':').length - 1])) {
                                    let symbol = tokens[index].symbol.split(':');
                                    actual_attribute._conf.type = {
                                        value: symbol[symbol.length - 1],
                                        command: ''
                                    };
                                    if (symbol.length == 2) {
                                        actual_attribute._conf.type.command = symbol[symbol.length - 2];
                                    }
                                    if (symbol[symbol.length - 1] == 'String') {
                                        if (!isNaN(tokens[index + 1].symbol)) {
                                            code_body = code_body + '      ' + symbol[symbol.length - 1] + ' ' + tokens[++index].symbol + '\n';
                                            actual_attribute._conf.length = tokens[index].symbol;
                                            index++;
                                        } else if (ycl_transpiler.types.includes(tokens[index + 1].symbol)
                                            || tokens[index + 1].symbol == 'unique' || tokens[index + 1].symbol == '!unique'
                                            || tokens[index + 1].symbol == 'nullable' || tokens[index + 1].symbol == '!nullable'
                                            || tokens[index + 1].symbol == 'comment' || tokens[index + 1].symbol == ')') {
                                            code_body = code_body + '      ' + tokens[index].symbol + '\n';
                                            index++;
                                        } else {
                                            console.log('error: unknow token. token \''+tokens[index + 1].symbol+'\', line '+tokens[index + 1].line+', position: '+tokens[index + 1].position+'. [from: '+from+']');
                                            return;
                                        }
                                    } else {
                                        code_body = code_body + '      ' + symbol[symbol.length - 1] + '\n';;
                                        index++;
                                    }
                                } else if (entity_names.includes(tokens[index].symbol)) {
                                    /* 
                                     * reconhece aqui a entidade da associação 
                                     * 
                                     */
                                    code_body = code_body + '      ' + tokens[index].symbol + '\n';
                                    index++;
                                } else {
                                    console.log('error: unknow token. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                    return;
                                }
                            }
                            code_body = code_body + '    ' + tokens[index].symbol + '\n';
                            index++;   
                        } else {
                            code_body = code_body + '\n';
                        }
                    } else {
                        console.log('error: token matches some reserved word or length is less than 2. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                        return;
                    }
                }
                code_body = code_body + '  ' + tokens[index].symbol + '\n'; // o '}' do 'entity <name> {'
                index++;
                from = 3;
            } else if (from == 4 && tokens[index].symbol == '{') {
                from = 5;
            } else {
                if ((tokens.length - 1) == index) {
                    console.log('code ok')
                } else {
                    console.log('* error: unknow token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                    return;
                }
                index++;
            } 
        }
        return { code: code.replace('BODY', code_body), schema: schema};
    },
    deploy: function(model, callback) {
        const schema = {
            name: model['name'],
            mutation: model['command']
        };
        if (model['command'] == 'c') {
            ycl_transpiler.createSchema(schema, callback);
        } else if (model['command'] == 'd') {
            ycl_transpiler.deleteSchema(schema, callback);
        } else {
            const control = { value:true }
            Object.keys(model['entities']).forEach(function(key2) {
                if (control.value) {
                    /* key2 é índice numerico no vetor entities */
                    const entity = {
                        name: model['entities'][key2]['name'],
                        _conf: {
                            dbType: model['entities'][key2]['_conf']['dbType'],
                            concurrencyControl: false,
                            businessRule: false,
                            accessControl: {
                                read: ['ROLE_ADMIN'],
                                write: ['ROLE_ADMIN']
                            },
                            uniqueKey: null,
                            indexKey: [],
                            source: {
                                url: null
                            },
                            extension: null,
                            comment: ''
                        },
                        attributes: []
                    };
                    if (model['entities'][key2]['command'] == 'c') {
                        let _conf = model['entities'][key2]['_conf'];
                        if (_conf.concurrencyControl && _conf.concurrencyControl.value) {
                            entity._conf.concurrencyControl = _conf.concurrencyControl.value;
                        }
                        if (_conf.businessRule && _conf.businessRule.value) {
                            entity._conf.businessRule = _conf.businessRule.value;
                        }
                        if (_conf.source && _conf.source.value) {
                            entity._conf.source.url = _conf.source.value;
                        }
                        if (_conf.extension && _conf.extension.value) {
                            entity._conf.extension = _conf.extension.value;
                        }
                        if (_conf.accessControl && _conf.accessControl.read
                            && _conf.accessControl.read.values) {
                            entity._conf.accessControl.read = _conf.accessControl.read.values;
                        }
                        if (_conf.accessControl && _conf.accessControl.write
                            && _conf.accessControl.write.values) {
                            entity._conf.accessControl.write = _conf.accessControl.write.values;
                        }
                        if (_conf.indexKey && _conf.indexKey.values) {
                            entity._conf.indexKey = _conf.indexKey.values;
                        }
                        if (_conf.dbType 
                            && (_conf.dbType == 'nosql(columnar)' || _conf.dbType == 'nosql(graph)')) {
                            entity._conf.uniqueKey = {};
                            if (_conf.uniqueKey.partitionKeys
                                && _conf.uniqueKey.partitionKeys.values) {
                                entity._conf.uniqueKey.partitionKeys = _conf.uniqueKey.partitionKeys.values;
                            }
                            if (_conf.uniqueKey.clusteringColumns
                                && _conf.uniqueKey.clusteringColumns.values) {
                                entity._conf.uniqueKey.clusteringColumns = _conf.uniqueKey.clusteringColumns.values;
                            }
                        }
                        Object.keys(model['entities'][key2]['attributes']).forEach(function(key4) {
                            let type_ = {
                                value: 'String',
                                length: 64
                            };
                            if (model['entities'][key2]['attributes'][key4]['_conf']['type']) {
                                type_.value = model['entities'][key2]['attributes'][key4]['_conf']['type'].value;
                                if (type_.value == 'String') {
                                    if (model['entities'][key2]['attributes'][key4]['_conf']['length']) {
                                        type_.length = model['entities'][key2]['attributes'][key4]['_conf']['length'].value;
                                    }
                                } else delete type_.length;
                            }
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
                            };
                            if (type_.length) {
                                attribute_.length = type_.length
                            }
                            if (model['entities'][key2]['attributes'][key4]['_conf']['nullable']) {
                                attribute_.nullable = model['entities'][key2]['attributes'][key4]['_conf']['nullable'].value
                            }
                            if (model['entities'][key2]['attributes'][key4]['_conf']['unique']) {
                                attribute_.unique = model['entities'][key2]['attributes'][key4]['_conf']['unique'].value
                            }
                            if (model['entities'][key2]['attributes'][key4]['_conf']['source']) {
                                attribute_.source = model['entities'][key2]['attributes'][key4]['_conf']['source'].value
                            }
                            if (model['entities'][key2]['attributes'][key4]['_conf']['extension']) {
                                attribute_.extension = model['entities'][key2]['attributes'][key4]['_conf']['extension'].value
                            }
                            entity.attributes.push(attribute_);
                        });
                        ycl_transpiler.createEntity(schema.name, entity, callback);
                        control.value = false;
                    } else if (model['entities'][key2]['command'] == 'd') {
                        ycl_transpiler.deleteEntity(schema.name, entity, callback);
                        control.value = false;
                    } else if (model['entities'][key2]['_conf']['concurrencyControl'] 
                        && model['entities'][key2]['_conf']['concurrencyControl']['command'] == 'u') {
                        ycl_transpiler.updateEntity(schema.name, entity.name, {
                            _conf: {
                                concurrencyControl: model['entities'][key2]['_conf']['concurrencyControl']['value']
                            }
                        }, callback);
                        control.value = false;
                    } else if (model['entities'][key2]['_conf']['businessRule'] 
                        && model['entities'][key2]['_conf']['businessRule']['command'] == 'u') {
                        ycl_transpiler.updateEntity(schema.name, entity.name, {
                            _conf: {
                                concurrencyControl: model['entities'][key2]['_conf']['businessRule']['value']
                            }
                        }, callback);
                        control.value = false;
                    } else if (model['entities'][key2]['_conf']['extension']
                        && model['entities'][key2]['_conf']['extension']['command'] == 'u') {
                        ycl_transpiler.updateEntity(schema.name, entity.name, {
                            _conf: {
                                extension: model['entities'][key2]['_conf']['extension']['value']
                            }
                        }, callback);
                        control.value = false;
                    } else if (model['entities'][key2]['_conf']['accessControl'] 
                        && model['entities'][key2]['_conf']['accessControl']['command'] == 'u') {
                        ycl_transpiler.updateEntity(schema.name, entity.name, {
                            _conf: {
                                accessControl: {
                                    read: model['entities'][key2]['_conf']['accessControl']['read']['values'],
                                    write: model['entities'][key2]['_conf']['accessControl']['write']['values']
                                }
                            }
                        }, callback);
                        control.value = false;
                    } else if (entity._conf.dbType == 'sql' && model['entities'][key2]['_conf']['uniqueKey'] 
                        && model['entities'][key2]['_conf']['uniqueKey']['command'] == 'u') {
                        ycl_transpiler.updateEntity(schema.name, entity.name, {
                            _conf: {
                                uniqueKey: model['entities'][key2]['_conf']['uniqueKey']['values']
                            }
                        }, callback);
                        control.value = false;
                    } else if (entity._conf.dbType == 'sql' && model['entities'][key2]['_conf']['indexKey'] 
                        && model['entities'][key2]['_conf']['indexKey']['command'] == 'u') {
                        ycl_transpiler.updateEntity(schema.name, entity.name, {
                            _conf: {
                                indexKey: model['entities'][key2]['_conf']['indexKey']['values']
                            }
                        }, callback);
                        control.value = false;
                    } else {
                        Object.keys(model['entities'][key2]['attributes']).forEach(function(key4) {
                            if (control.value) {
                                let type_ = {
                                    value: 'String',
                                    length: 64
                                };
                                if (model['entities'][key2]['attributes'][key4]['_conf']['type']) {
                                    type_.value = model['entities'][key2]['attributes'][key4]['_conf']['type'].value;
                                    if (type_.value == 'String') {
                                        if (model['entities'][key2]['attributes'][key4]['_conf']['length']) {
                                            type_.length = model['entities'][key2]['attributes'][key4]['_conf']['length'].value;
                                        }
                                    } else delete type_.length;
                                };
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
                                };
                                if (type_.length) {
                                    attribute_.length = type_.length
                                }
                                if (model['entities'][key2]['attributes'][key4]['command'] == 'c') {
                                    if (type_.value == 'String' && model['entities'][key2]['attributes'][key4]['_conf']['length']) {
                                        attribute_.length = model['entities'][key2]['attributes'][key4]['_conf']['length'];
                                    }
                                    if (model['entities'][key2]['attributes'][key4]['_conf']['nullable']) {
                                        attribute_.nullable = model['entities'][key2]['attributes'][key4]['_conf']['nullable'].value
                                    }
                                    if (model['entities'][key2]['attributes'][key4]['_conf']['unique']) {
                                        attribute_.unique = model['entities'][key2]['attributes'][key4]['_conf']['unique'].value
                                    }
                                    if (model['entities'][key2]['attributes'][key4]['_conf']['source']) {
                                        attribute_.source = model['entities'][key2]['attributes'][key4]['_conf']['source'].value
                                    }
                                    if (model['entities'][key2]['attributes'][key4]['_conf']['extension']) {
                                        attribute_.extension = model['entities'][key2]['attributes'][key4]['_conf']['extension'].value
                                    }
                                    ycl_transpiler.createAttribute(schema.name, entity.name, attribute_, callback);
                                    control.value = false;
                                } else if (model['entities'][key2]['attributes'][key4]['command'] == 'd') {
                                    ycl_transpiler.deleteAttribute(schema.name, entity.name, attribute, callback);
                                    control.value = false;
                                } else if (model['entities'][key2]['attributes'][key4]['_conf']['type']
                                    && model['entities'][key2]['attributes'][key4]['_conf']['type']['command'] == 'u') {
                                    let aux_attribute = {
                                        type: model['entities'][key2]['attributes'][key4]['_conf']['type']['value']
                                    };
                                    if (model['entities'][key2]['attributes'][key4]['_conf']['type']['value'] == 'String'
                                        && model['entities'][key2]['attributes'][key4]['_conf']['length']
                                        && model['entities'][key2]['attributes'][key4]['_conf']['length']['command'] == 'u') {
                                        aux_attribute.length = model['entities'][key2]['attributes'][key4]['_conf']['length'];
                                    }
                                    ycl_transpiler.updateAttribute(schema.name, entity.name, attribute.name, aux_attribute, callback);
                                    control.value = false;
                                } else if (model['entities'][key2]['attributes'][key4]['_conf']['nullable']
                                    && model['entities'][key2]['attributes'][key4]['_conf']['nullable']['command'] == 'u') {
                                    ycl_transpiler.updateAttribute(schema.name, entity.name, attribute.name, {
                                        nullable: model['entities'][key2]['attributes'][key4]['_conf']['nullable']['value']
                                    }, callback);
                                    control.value = false;
                                } else if (model['entities'][key2]['attributes'][key4]['_conf']['unique']
                                    && model['entities'][key2]['attributes'][key4]['_conf']['unique']['command'] == 'u') {
                                    ycl_transpiler.updateAttribute(schema.name, entity.name, attribute.name, {
                                        unique: model['entities'][key2]['attributes'][key4]['_conf']['unique']['value']
                                    }, callback);
                                    control.value = false;
                                } else if (model['entities'][key2]['attributes'][key4]['_conf']['extension']
                                    && model['entities'][key2]['attributes'][key4]['_conf']['extension']['command'] == 'u') {
                                    ycl_transpiler.updateAttribute(schema.name, entity.name, attribute.name, {
                                        extension: model['entities'][key2]['attributes'][key4]['_conf']['extension']['value']
                                    }, callback);
                                    control.value = false;
                                } else if (model['entities'][key2]['attributes'][key4]['_conf']['source']
                                    && model['entities'][key2]['attributes'][key4]['_conf']['source']['command'] == 'u') {
                                    ycl_transpiler.updateAttribute(schema.name, entity.name, attribute.name, {
                                        source: model['entities'][key2]['attributes'][key4]['_conf']['source']['value']
                                    }, callback);
                                    control.value = false;
                                }
                            }
                        });
                    }
                }
            });
            if (control.value && callback) {
                callback({ http: { status: 200 }, data: {}});
            }
        }
    },
    createSchema: function(schema, callback) {
        console.log('> create schema: ',schema);
        _gtools_lib.request(api.endpoint.modeling.schema.create, schema, callback);
        //callback({http:{status:201},data:{message:''}})
    },
    updateSchema: function (schema, body, callback) {
        console.log('update schema: ',schema, body);
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.schema.update));
        endpoint_.url = endpoint_.url.replace('{schemaName}', schema);
        _gtools_lib.request(endpoint_, body, callback);
    },
    deleteSchema: function (schema, callback) {
        console.log('delete schema: ',schema);
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.schema.delete));
        endpoint_.url = endpoint_.url.replace('{schemaName}', schema);
        _gtools_lib.request(endpoint_, null, callback);
    },
    createEntity: function (schema, entity, callback) {
        console.log('create entity: ', schema, entity);
        let endpoint = 
            JSON.parse(JSON.stringify(api.endpoint.modeling.schema.entity.create));
        endpoint.url = endpoint.url
                .replace('{schemaName}', schema);
        _gtools_lib.request(endpoint, entity, callback);
        callback({http:{status:201},data:{message:''}})
    },
    updateEntity: function (schema, entity, body, callback) {
        console.log('update entity: ', schema, entity, body);
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.schema.entity.update));
        endpoint_.url = endpoint_.url
                .replace('{schemaName}', schema)
                .replace('{entityName}', entity);
        _gtools_lib.request(endpoint_, body, callback);
    },
    deleteEntity: function (schema, entity, callback) {
        console.log('delete entity: ', schema, entity);
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.schema.entity.delete));
        endpoint_.url = endpoint_.url
                .replace('{schemaName}', schema)
                .replace('{entityName}', entity);
        _gtools_lib.request( endpoint_, null, callback);
    },
    createAttribute: function (schema, entity, attribute, callback) {
        console.log('create attribute: ', schema, entity, attribute);
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling. schema.entity.attribute.create));
        endpoint_.url = endpoint_.url
                .replace('{schemaName}', schema)
                .replace('{entityName}', entity);
        _gtools_lib.request(endpoint_, attribute, callback);
    },
    updateAttribute: function (schema, entity, attribute, body, callback) {
        console.log('update attribute: ', schema, entity, attribute, body);
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.schema.entity.attribute.update));
        endpoint_.url = endpoint_.url
                .replace('{schemaName}', schema)
                .replace('{entityName}', entity)
                .replace('{attributeName}', attribute);
        _gtools_lib.request(endpoint_, attribute, callback);
    },
    deleteAttribute: function (schema, entity, attribute, callback) {
        console.log('delete attribute: ', schema, entity, attribute);
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.schema.entity.attribute.delete));
        endpoint_.url = endpoint_.url
                .replace('{schemaName}', schema)
                .replace('{entityName}', entity)
                .replace('{attributeName}', attribute);
        _gtools_lib.request(endpoint_, null, callback);
    }
};

let response = ycl_transpiler.parse(__code);
document.querySelector('pre').innerHTML = response.code;
//console.log(response.code);*/
console.log(response.schema);
ycl_transpiler.deploy(response.schema, function () {});
