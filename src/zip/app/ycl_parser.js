    const code = 'schema pandemic (\n'
    +'  enabled\n'
    +') {\n'
    +'  entity covid19 (\n'
    +'    nosql ( dataset )\n'
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
    'Text','File','_classDef','_conf','extension','source','nosql','dataset','dataset',
    'partitionKeys','clusteringColumns'];

const ycl_parse = {
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
                    if (!ycl_parse.ycl_reserved_word_contains(aux[0])) {
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
                        if (!ycl_parse.ycl_reserved_word_contains(entity_name_) 
                            && ycl_parse.check_schema_object_name(entity_name_)) {
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
    parse: function (src, command, schema_name, entity_name, attribute_name) {
        let code = '';
        if (command == 'schema_create') {
            return 'schema c:'+schema_name+' {\n}'
        }

        let entity_names = [];
        let tokens = ycl_parse.tokenizer_yc_code(src, entity_names);
        let code_body = '';
        let index = 0;
        let from = 0;
        let actual_entity_name = '';
        let concurrencyControlFlag = true;
        let businessRuleFlag = true;

        while (index < tokens.length) {
            if (from == 0 && tokens[index].symbol == 'schema') {
                if (!ycl_parse.ycl_reserved_word_contains(tokens[index + 1].symbol) 
                    && ycl_parse.check_schema_object_name(tokens[index + 1].symbol)) {
                    /*
                     * reconhecer a declaração de schema
                     *  
                     */
                    let symbol = tokens[index + 1].symbol;
                    if (command == 'schema_delete') {
                        symbol = 'd:' + symbol;
                    }
                    code = code + tokens[index].symbol + ' ' + symbol + ' ';
                    index++;
                    index++;
                    from = 1;
                } else {
                    console.log('error: the token format is not lowercase, or matches some reserved word, or does not match only alpha characters. token \''+tokens[index + 1].symbol+'\', line '+tokens[index + 1].line+', position: '+tokens[index + 1].position+'. [from: '+from+']');
                    return;
                }
                // console.log('from 1, code: ', code);
            } else if (from == 1 && tokens[index].symbol == '('
                && (tokens[index + 1].symbol == 'enabled' || tokens[index + 1].symbol == '!enabled')
                && tokens[index + 2].symbol == ')') {
                    /*
                     * reconhecer a declaração de configuracao de schema
                     *  
                     */
                let symbol = '';
                if (command == 'schema-_conf-enabled_change') {
                    if (tokens[index + 1].symbol == 'enabled') {
                        symbol = 'u:!enabled';
                    } else {
                        symbol =  'u:enabled';
                    }
                } else {
                    symbol = tokens[index + 1].symbol;
                }
                code = code + '(\n' + '  ' + symbol + ' \n)';
                index = index + 3;
                from = 2
                // console.log('from 2, code: ', code);
            } else if (from == 1 && tokens[index].symbol == '{') {
                /*
                 * encaminhar para reconhecer a declaração de corpo de schema
                 *  
                 */
                from = 2
                // console.log('from 1>2, code: ', code);
            } else if (from == 2 && (tokens[index].symbol == '{' && tokens[tokens.length - 1].symbol == '}')) {
                if (command == 'entity_create') {
                    let snippet = '  entity c:' + entity_name + ' {\n  }\n';
                    code = code + ' {\n'+snippet+'BODY}';
                } else {
                    code = code + ' {\nBODY}';
                }
                index++;
                from = 3;
                // console.log('from 3, code: ', code);
            } else if (from == 3 && tokens[index].symbol == 'entity') {
                if (!ycl_parse.ycl_reserved_word_contains(tokens[index + 1].symbol) 
                    && ycl_parse.check_schema_object_name(tokens[index + 1].symbol)) {
                    actual_entity_name = tokens[index + 1].symbol;
                    if (actual_entity_name == entity_name) {
                        if (command == 'entity_delete') {
                            actual_entity_name = 'd:'+actual_entity_name;
                        }
                    }
                    code_body = code_body + '  ' + tokens[index].symbol + ' ' + actual_entity_name;
                    index++;
                    index++;
                    from = 4;

                    concurrencyControlFlag = true;
                    businessRuleFlag = true;
                    // console.log('from 4, code_body: ', code_body);
                } else {
                    console.log('error: the token format is not lowercase, or matches some reserved word, or does not match only alpha characters. token \''+tokens[index + 1].symbol+'\', line '+tokens[index + 1].line+', position: '+tokens[index + 1].position+'. [from: '+from+']');
                    return
                }
            } else if (from == 4 && tokens[index].symbol == '(') { // <<<<<<< PODE Ñ SER (, ou seja vir {. tratar isso!
                code_body = code_body + ' ' + tokens[index].symbol + ' \n';
                // console.log('from 5, code_body: ', code_body);
                index++;
                while (tokens[index].symbol  != ')') {
                    if (tokens[index].symbol == 'nosql' || tokens[index].symbol == 'sql') {
                        ycl_parse.db_type = tokens[index].symbol;
                        code_body = code_body + '    ' + tokens[index].symbol;
                        if (tokens[++index].symbol == '(') {
                            code_body = code_body + ' ' + tokens[index].symbol;
                            if (tokens[++index].symbol == 'dataset' || tokens[index].symbol == 'timeseries') {
                                code_body = code_body + ' ' + tokens[index].symbol;
                                if (tokens[++index].symbol == ')') {
                                    code_body = code_body + ' ' + tokens[index].symbol;
                                } else throw new Error('error: unexpected token \''+tokens[index].symbol+'\'. the expected token is \')\'');
                            } else throw new Error('error: unexpected token \''+tokens[index].symbol+'\'. the expected token is \'dataset\'or \'timeseries\'');
                        }
                        code_body = code_body + '\n';
                        index++;
                    } else if (tokens[index].symbol == 'concurrencyControl' || tokens[index].symbol == '!concurrencyControl'
                        /* || tokens[index].symbol == 'u:concurrencyControl' || tokens[index].symbol == 'u:!concurrencyControl' */) {
                        let symbol = '';
                        if (command == 'entity-_conf-concurrencyControl_change' && entity_name == actual_entity_name) {
                            if (tokens[index].symbol == 'concurrencyControl') {
                                symbol = 'u:!concurrencyControl';
                            } else {
                                symbol =  'u:concurrencyControl';
                            }
                            concurrencyControlFlag = false;
                        } else {
                            symbol = tokens[index].symbol;
                        }
                        code_body = code_body + '    ' + symbol + '\n';
                        // console.log('from 5.1, tokens['+index+']: ', tokens[index].symbol);
                        index++;
                    } else if (tokens[index].symbol == 'businessRule' || tokens[index].symbol == '!businessRule'
                        /* || tokens[index].symbol == 'u:businessRule' || tokens[index].symbol == 'u:!businessRule' */) {
                        let symbol = '';
                        if (command == 'entity-_conf-businessRule_change' && entity_name == actual_entity_name) {
                            if (tokens[index].symbol == 'businessRule') {
                                symbol = 'u:!businessRule';
                            } else {
                                symbol =  'u:businessRule';
                            }
                            businessRuleFlag = false;
                        } else {
                            symbol = tokens[index].symbol;
                        }
                        code_body = code_body + '    ' + symbol + '\n';
                        // console.log('from 5.2, tokens['+index+']: ', tokens[index].symbol);
                        index++;
                    } else if (ycl_parse.db_type == 'nosql' && tokens[index].symbol == 'source' && tokens[index + 1].symbol == '('
                        /* || tokens[index].symbol == 'u:businessRule' || tokens[index].symbol == 'u:!businessRule' */) {
                        let symbol = '';
                        if (command == 'entity-_conf-source_change' && entity_name == actual_entity_name) {
                            symbol =  'u:' + tokens[index].symbol;
                            businessRuleFlag = false;
                        } else {
                            symbol = tokens[index].symbol;
                        }
                        code_body = code_body + '    ' + symbol + ' ' + tokens[++index].symbol + '\n';
                        code_body = code_body + '      ' + tokens[++index].symbol + '\n';
                        if (tokens[++index].symbol == ')') {
                            code_body = code_body + '    ' + tokens[index].symbol + '\n';
                        }
                        index++;
                    } else if (ycl_parse.db_type == 'nosql' && tokens[index].symbol == 'extension' && tokens[index + 1].symbol == '('
                        /* || tokens[index].symbol == 'u:businessRule' || tokens[index].symbol == 'u:!businessRule' */) {
                        let symbol = '';
                        if (command == 'entity-_conf-extension_change' && entity_name == actual_entity_name) {
                            symbol =  'u:' + tokens[index].symbol;
                            businessRuleFlag = false;
                        } else {
                            symbol = tokens[index].symbol;
                        }
                        code_body = code_body + '    ' + symbol + ' ' + tokens[++index].symbol + '\n';
                        code_body = code_body + '      ' + tokens[++index].symbol + '\n';
                        if (tokens[++index].symbol == ')') {
                            code_body = code_body + '    ' + tokens[index].symbol + '\n';
                        }
                        index++;
                    } else if (tokens[index].symbol == 'persistence' && tokens[index + 1].symbol == '(') {
                        code_body = code_body + '    ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                        // console.log('from 5.3, tokens['+(index-1)+']: ', tokens[index-1].symbol);
                        index++;
                        while (tokens[index].symbol  != ')') {
                            if (ycl_parse.db_type == 'sql' && tokens[index].symbol == 'uniqueKey' && tokens[index + 1].symbol == '[') {
                                code_body = code_body + '      ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                // console.log('from 5.3.1, tokens['+(index-1)+']: ', tokens[index-1].symbol);
                                index++;
                                while (tokens[index].symbol  != ']') {
                                    if (!ycl_parse.ycl_reserved_word_contains(tokens[index].symbol) 
                                        && ycl_parse.check_schema_object_name(tokens[index].symbol)) {
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n';
                                        // console.log('from 5.3.1.1, tokens['+(index)+']: ', tokens[index].symbol);
                                        index++;
                                    } else {
                                        console.log('error: attribute name incorrect into uniqueKey. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                        return;
                                    }
                                }
                                code_body = code_body + '      ' + tokens[index].symbol + '\n'; // o ']' do 'uniqueKey ['
                                // console.log('from 5.3.2, tokens['+(index)+']: ', tokens[index].symbol);
                                index++;
                            } else if (ycl_parse.db_type == 'nosql' && tokens[index].symbol == 'uniqueKey' && tokens[index + 1].symbol == '(') {
                                code_body = code_body + '      ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                // console.log('from 5.3.1, tokens['+(index-1)+']: ', tokens[index-1].symbol);
                                let flag = true, hasPK = false;
                                index++;
                                while (flag) {
                                    if (tokens[index].symbol == 'partitionKeys' && tokens[index + 1].symbol == '[') {
                                        code_body = code_body + '        ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                        index++;
                                        while (tokens[index].symbol  != ']') {
                                            if (tokens[index].symbol.includes(',')) {
                                                let aux 
                                            } else {
                                                if (!ycl_parse.ycl_reserved_word_contains(tokens[index].symbol) 
                                                    && ycl_parse.check_schema_object_name(tokens[index].symbol)) {
                                                    code_body = code_body + '          ' + tokens[index].symbol + '\n';
                                                    // console.log('from 5.3.1.1, tokens['+(index)+']: ', tokens[index].symbol);
                                                    index++;
                                                    hasPK = true;
                                                } else {
                                                    console.log('error: attribute name incorrect into uniqueKey. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                                    return;
                                                }
                                            }
                                        }
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n'; // o ']' do 'partitionKeys ['
                                        // console.log('from 5.3.2, tokens['+(index)+']: ', tokens[index].symbol);
                                        index++;
                                    } else if (tokens[index].symbol == 'clusteringColumns' && tokens[index + 1].symbol == '[') {
                                        code_body = code_body + '        ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                        index++;
                                        while (tokens[index].symbol  != ']') {
                                            if (!ycl_parse.ycl_reserved_word_contains(tokens[index].symbol) 
                                                && ycl_parse.check_schema_object_name(tokens[index].symbol)) {
                                                code_body = code_body + '          ' + tokens[index].symbol + '\n';
                                                // console.log('from 5.3.1.1, tokens['+(index)+']: ', tokens[index].symbol);
                                                index++;
                                                hasPK = true;
                                            } else {
                                                console.log('error: attribute name incorrect into uniqueKey. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                                return;
                                            }
                                        }
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n'; // o ']' do 'clusteringColumns ['
                                        // console.log('from 5.3.2, tokens['+(index)+']: ', tokens[index].symbol);
                                        index++;
                                    } else flag = false;
                                }

                                if (!hasPK) {
                                    throw new Error('error: primary key undefined');
                                }

                                if (tokens[index].symbol == ')') {
                                    code_body = code_body + '        ' + tokens[index].symbol + '\n'; // o ')' do 'primaryKey ('
                                } else throw new Error('error: unexpected token \''+tokens[index].symbol+'\' (in line: '+tokens[index].line+'). the expected token is \')\'');
                                index++
                            } else if (tokens[index].symbol == 'indexKey' && tokens[index + 1].symbol == '[') {
                                code_body = code_body + '      ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                // console.log('from 5.3.3, tokens['+(index-1)+']: ', tokens[index-1].symbol);
                                index++;
                                while (tokens[index].symbol  != ']') {
                                    if (!ycl_parse.ycl_reserved_word_contains(tokens[index].symbol) 
                                        && ycl_parse.check_schema_object_name(tokens[index].symbol)) {
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n';
                                        // console.log('from 5.3.3.1, tokens['+(index)+']: ', tokens[index].symbol);
                                        index++;
                                    } else {
                                        console.log('error: attribute name incorrect into indexKey. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                        return;
                                    }
                                }
                                code_body = code_body + '      ' + tokens[index].symbol + '\n'; // o ']' do 'indexKey ['
                                // console.log('from 5.3.4, tokens['+(index)+']: ', tokens[index].symbol);
                                index++;
                            } else {
                                console.log('error: unknow token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                return;
                            }
                        }
                        code_body = code_body + '    ' + tokens[index].symbol + '\n'; // o ')' do 'persistence ('
                        // console.log('from 5.3>, tokens['+index+']: ', tokens[index].symbol);
                        index++;
                    } else if (tokens[index].symbol == 'accessControl' && tokens[index + 1].symbol == '(') {
                        code_body = code_body + '    ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                        // console.log('from 5.4, tokens['+index+']: ', tokens[index].symbol);
                        index++;
                        while (tokens[index].symbol  != ')') {
                            if (tokens[index].symbol == 'read' && tokens[index + 1].symbol == '[') {
                                code_body = code_body + '      ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                // console.log('from 5.4.1, tokens['+(index-1)+']: ', tokens[(index-1)].symbol);
                                index++;
                                while (tokens[index].symbol  != ']') {
                                    if (!ycl_parse.ycl_reserved_word_contains(tokens[index].symbol) 
                                        && ycl_parse.is_role_name_ok(tokens[index].symbol)
                                        && tokens[index].symbol.startsWith('ROLE_')) {
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n';
                                        // console.log('from 5.4.1.1, tokens['+index+']: ', tokens[index].symbol);
                                        index++;
                                    } else {
                                        console.log('error: token format is not capitalized, or matches some reserved word, or does not start with \'ROLE_\'. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                        return;
                                    }
                                }
                                code_body = code_body + '      ' + tokens[index].symbol + '\n'; // o ']' do 'read ['
                                // console.log('from 5.4.2, tokens['+(index)+']: ', tokens[index].symbol);
                                index++;
                            } else if (tokens[index].symbol == 'write' && tokens[index + 1].symbol == '[') {
                                code_body = code_body + '      ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                // console.log('from 5.4.3, tokens['+(index-1)+']: ', tokens[(index-1)].symbol);
                                index++;
                                while (tokens[index].symbol  != ']') {
                                    if (!ycl_parse.ycl_reserved_word_contains(tokens[index].symbol) 
                                        && ycl_parse.is_role_name_ok(tokens[index].symbol)
                                        && tokens[index].symbol.startsWith('ROLE_')) {
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n';
                                        // console.log('from 5.4.3.1, tokens['+index+']: ', tokens[index].symbol);
                                        index++;
                                    } else {
                                        console.log('error: token format is not capitalized, or matches some reserved word, or does not start with \'ROLE_\'. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                        return;
                                    }
                                }
                                code_body = code_body + '      ' + tokens[index].symbol + '\n'; // o ']' do 'write ['
                                // console.log('from 5.4.4, tokens['+(index)+']: ', tokens[index].symbol);
                                index++;
                            } else {
                                console.log('error: unknow token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                return;
                            }
                        }

                        code_body = code_body + '    ' + tokens[index].symbol + '\n'; // o ')' do 'accessControl ('
                        // console.log('from 5.4>, tokens['+index+']: ', tokens[index].symbol);
                        index++;
                    } else {
                        console.log('error: unknow token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                        return;
                    }
                }

                if (command == 'entity-_conf-concurrencyControl_change' && concurrencyControlFlag
                    && entity_name == actual_entity_name) {
                    code_body = code_body + '    u:concurrencyControl\n';
                    concurrencyControlFlag = false;
                }

                if (command == 'entity-_conf-businessRule_change' && businessRuleFlag
                    && entity_name == actual_entity_name) {
                    code_body = code_body + '    u:businessRule\n';
                    businessRuleFlag = false;
                }

                code_body = code_body + '  ' + tokens[index].symbol; // o ')' do 'accessControl ('
                // console.log('from 5.5>, tokens['+index+']: ', tokens[index].symbol);
                index++;
                from = 5;
            } else if (from == 5 && tokens[index].symbol == '{') {
                /* 
                 * avaliar o corpo de uma entidade
                 */

                if (command == 'entity-_conf-concurrencyControl_change' && concurrencyControlFlag
                    && entity_name == actual_entity_name) {
                    code_body = code_body + ' (\n    u:concurrencyControl\n  )';
                    concurrencyControlFlag = false;
                }

                if (command == 'entity-_conf-businessRule_change' && businessRuleFlag
                    && entity_name == actual_entity_name) {
                    code_body = code_body + ' (\n    u:businessRule\n  )';
                    businessRuleFlag = false;
                }

                code_body = code_body + ' ' + tokens[index].symbol + ' \n';

                if ((command == 'attribute_create' || command == 'relationship_create')
                    && actual_entity_name == entity_name) {
                    let snippet = '    c:' + attribute_name + '\n';
                    code_body = code_body + snippet;
                }

                // console.log('from 6, code_body: ', code_body);
                index++;
                while (tokens[index].symbol != '}') {
                    if ((!ycl_parse.ycl_reserved_word_contains(tokens[index].symbol) 
                        && ycl_parse.check_schema_object_name(tokens[index].symbol))) {

                        let uniqueFlag = true;
                        let nullableFlag = true;

                        let actual_attribute_name = tokens[index].symbol;
                        if (actual_attribute_name == attribute_name && entity_name == actual_entity_name) {
                            if (command == 'attribute_delete' || command == 'relationship_delete') {
                                actual_attribute_name = 'd:'+actual_attribute_name;
                            }
                        }
                        code_body = code_body + '    ' + tokens[index].symbol 
                        // console.log('from 6.1, tokens['+index+']: ', tokens[index].symbol);
                        index++;
                        if (tokens[index].symbol == '(') {
                            code_body = code_body + ' ' + tokens[index].symbol + '\n'; 
                            // console.log('from 6.1.0, tokens['+index+']: ', tokens[index].symbol);
                            index++;
                            while (tokens[index].symbol != ')') {
                                if (tokens[index].symbol == 'unique' || tokens[index].symbol == '!unique'
                                    /* || tokens[index].symbol == 'u:unique' || tokens[index].symbol == 'u:!unique' */) {
                                    let symbol = '';
                                    if (command == 'attribute-_conf-unique_change' && entity_name == actual_entity_name 
                                        && attribute_name == actual_attribute_name) {
                                        if (tokens[index].symbol == 'unique') {
                                            symbol = 'u:!unique';
                                        } else {
                                            symbol = 'u:unique';
                                        }
                                        uniqueFlag = false;
                                    } else {
                                        symbol = tokens[index].symbol;
                                    }
                                    code_body = code_body + '      ' + symbol + '\n';
                                    // console.log('from 6.1.1, tokens['+index+']: ', tokens[index].symbol);
                                    index++;
                                } else if (tokens[index].symbol == 'nullable' || tokens[index].symbol == '!nullable'
                                    /* || tokens[index].symbol == 'u:nullable' || tokens[index].symbol == 'u:!nullable' */) {
                                    let symbol = '';
                                    if (command == 'attribute-_conf-nullable_change' && entity_name == actual_entity_name 
                                            && attribute_name == actual_attribute_name) {
                                        if (tokens[index].symbol == 'nullable') {
                                            symbol = 'u:!nullable';
                                        } else {
                                            symbol = 'u:nullable';
                                        }
                                        nullableFlag = false;
                                    } else {
                                        symbol = tokens[index].symbol;
                                    }
                                    code_body = code_body + '      ' + symbol + '\n';
                                    // console.log('from 6.1.2, tokens['+index+']: ', tokens[index].symbol);
                                    index++;
                                } else if (ycl_parse.db_type == 'nosql' && tokens[index].symbol == 'source' && tokens[index + 1].symbol == '('
                                    /* || tokens[index].symbol == 'u:businessRule' || tokens[index].symbol == 'u:!businessRule' */) {
                                    let symbol = '';
                                    if (command == 'attribute-_conf-source_change' && entity_name == actual_entity_name) {
                                        symbol =  'u:' + tokens[index].symbol;
                                        businessRuleFlag = false;
                                    } else {
                                        symbol = tokens[index].symbol;
                                    }
                                    code_body = code_body + '      ' + symbol + ' ' + tokens[++index].symbol + '\n';
                                    code_body = code_body + '        ' + tokens[++index].symbol + '\n';
                                    code_body = code_body + '        ' + tokens[++index].symbol + '\n';
                                    if (tokens[++index].symbol == ')') {
                                        code_body = code_body + '      ' + tokens[index].symbol + '\n';
                                    } else throw new Error('error: unexpected token \''+tokens[index].symbol+'\' (in line: '+tokens[index].line+'). the expected token is \')\'');
                                    index++;
                                } else if (ycl_parse.db_type == 'nosql' && tokens[index].symbol == 'extension' && tokens[index + 1].symbol == '('
                                    /* || tokens[index].symbol == 'u:businessRule' || tokens[index].symbol == 'u:!businessRule' */) {
                                    let symbol = '';
                                    if (command == 'attribute-_conf-extension_change' && entity_name == actual_entity_name) {
                                        symbol =  'u:' + tokens[index].symbol;
                                        businessRuleFlag = false;
                                    } else {
                                        symbol = tokens[index].symbol;
                                    }
                                    code_body = code_body + '      ' + symbol + ' ' + tokens[++index].symbol + '\n';
                                    index++;
                                    while (tokens[index].symbol != ')') 
                                    {
                                        code_body = code_body + '        ' + tokens[index].symbol + '\n';
                                        index++;
                                    }
                                    code_body = code_body + '      ' + tokens[index].symbol + '\n';
                                    index++;
                                } else if (tokens[index].symbol == 'comment' && tokens[index + 1].symbol.startsWith('\'') && tokens[index + 1].symbol.endsWith('\'')) {
                                    code_body = code_body + '      ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                    // console.log('from 6.1.3, tokens['+(index - 1)+']: ', tokens[(index - 1)].symbol);
                                    index++;
                                } else if (tokens[index].symbol == 'comment' && tokens[index + 1].symbol.startsWith('\'') && !tokens[index + 1].symbol.endsWith('\'')) {
                                    code_body = code_body + '      ' + tokens[index].symbol + ' \'' + tokens[++index].symbol.replace('\'','');
                                    // console.log('from 6.1.3>, tokens['+(index - 1)+']: ', tokens[(index - 1)].symbol);
                                    // console.log('from 6.1.3>, tokens['+index+']: ', tokens[index].symbol.replace('\'',''));
                                    index++;
                                    while (!tokens[index].symbol.endsWith('\'')) {
                                        code_body = code_body + ' ' + tokens[index].symbol;
                                        // console.log('from 6.1.3.1, tokens['+index+']: ', tokens[index].symbol);
                                        index++;
                                    }
                                    
                                    if (tokens[index].symbol.length == 1) {
                                        code_body = code_body + tokens[index].symbol + '\n';
                                    } else {
                                        code_body = code_body + ' '.concat(tokens[index].symbol) + '\n';
                                    }
                                    // console.log('from 6.1.4, tokens['+index+']: ', tokens[index].symbol);
                                    index++;
                                } else if (ycl_parse.types.includes(tokens[index].symbol)) {
                                    if (tokens[index].symbol == 'String') {
                                        if (!isNaN(tokens[index + 1].symbol)) {
                                            code_body = code_body + '      ' + tokens[index].symbol + ' ' + tokens[++index].symbol + '\n';
                                            // console.log('from 6.1.5, tokens['+(index - 1)+']: ', tokens[(index - 1)].symbol);
                                            index++;
                                        } else if (ycl_parse.types.includes(tokens[index + 1].symbol)
                                            || tokens[index + 1].symbol == 'unique' || tokens[index + 1].symbol == '!unique'
                                            || tokens[index + 1].symbol == 'nullable' || tokens[index + 1].symbol == '!nullable'
                                            || tokens[index + 1].symbol == 'comment' || tokens[index + 1].symbol == ')') {
                                            code_body = code_body + '      ' + tokens[index].symbol + '\n';
                                            // console.log('from 6.1.6, tokens['+index+']: ', tokens[index].symbol);
                                            index++;
                                        } else {
                                            console.log('error: unknow token. token \''+tokens[index + 1].symbol+'\', line '+tokens[index + 1].line+', position: '+tokens[index + 1].position+'. [from: '+from+']');
                                            return;
                                        }
                                    } else {
                                        code_body = code_body + '      ' + tokens[index].symbol + '\n';
                                        // console.log('from 6.1.7, tokens['+index+']: ', tokens[index].symbol);
                                        index++;
                                    }
                                } else if (entity_names.includes(tokens[index].symbol)) {
                                    /* reconhece aqui a entidade da associação */
                                    code_body = code_body + '      ' + tokens[index].symbol + '\n';
                                    // console.log('from 6.1.8, tokens['+index+']: ', tokens[index].symbol);
                                    index++;
                                } else {
                                    console.log('error: unknow token. token \''+tokens[index].symbol+'\', line '+tokens[index].line+', position: '+tokens[index].position+'. [from: '+from+']');
                                    return;
                                }
                            }
                            code_body = code_body + '    ' + tokens[index].symbol + '\n';
                            // console.log('from 6.1.9, tokens['+index+']: ', tokens[index].symbol);
                            index++;   
                        } else {
                            if (command == 'attribute-_conf-nullable_change' && nullableFlag 
                                && entity_name == actual_entity_name && attribute_name == actual_attribute_name) {
                                code_body = code_body + ' (\n      u:!nullable\n    )';
                                nullableFlag = false;
                            }

                            if (command == 'attribute-_conf-unique_change' && uniqueFlag 
                                && entity_name == actual_entity_name && attribute_name == actual_attribute_name) {
                                code_body = code_body + ' (\n      u:unique\n    )';
                                uniqueFlag = false;
                            }

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
        return code.replace('BODY', code_body);
    }
};

//console.log(ycl_parse.parse(document.querySelector('pre').innerHTML));
document.querySelector('pre').innerHTML = code;
console.log(ycl_parse.parse(code));
