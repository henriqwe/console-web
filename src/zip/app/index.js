var _editor = null;
var _tenantID = '';
var _jwtoken = '';
var _route = '';
var _account = null;
var _role = null;
var _table_data = null;
var _table_roles = null;
var _table_accounts = null;
var _table_log = null;
var _disable_cli = false;
var _commands = null;
var _line = 0;
var _schema = {
    edition: {
        object: {
            type: null,
            name: null
        },
        action: null
    }
};
var _node = null;
const HAS_ADMIN_ACCOUNT = 0;
const GENERATE_ADMIN_ACCOUNT_AND_SCHEMA_IN_EDITOR = 1
const _memorize = []


const _globals = {
    account: {
        id: null,
        username: null,
        name: null,
        email: null,
        session: {
            token: null
        }
    },
    context: null,
    schema: {
        $tree: null,
        metadata: {
            edited: [],
            original: null
        }
    },
    three_contextmenu: {
        disabled: false
    }
}

_memorize[HAS_ADMIN_ACCOUNT] = false;
_memorize[GENERATE_ADMIN_ACCOUNT_AND_SCHEMA_IN_EDITOR] = false;


const _delay = 200;


const _contexmenu_entries = [
    'schema_create', 'schema_delete', 'schema-cd_view', 'schema-_conf', 
    'entity_create', 'entity_read', 'entity_delete', 'entity-_conf', 
    'attribute_create', 'attribute_read', 'attribute_delete', 'attribute-_conf', 
    'relationship_create', 'relationship_read',  'relationship_delete', 'relationship-_conf', 
    'entity-_conf_rename', 'attribute-_conf_rename', 'relationship-_conf_rename',
    'account'
];


const _app = {
    panel: {
        data: {
            set_status: function(status) {
                _app.panel.data.status = status;
                _app.panel.users.status = !status;
                _app.panel.schema.status = !status;
                _app.panel.monitor.status = !status;
            },
            status: false
        },
        users: {
            set_status: function(status) {
                _app.panel.data.status = !status;
                _app.panel.users.status = status;
                _app.panel.schema.status = !status;
                _app.panel.monitor.status = !status;
            },
            status: false
        },
        schema: {
            set_status: function(status) {
                _app.panel.data.status = !status;
                _app.panel.users.status = !status;
                _app.panel.schema.status = status;
                _app.panel.monitor.status = !status;
            },
            status: false
        },
        monitor: {
            set_status: function(status) {
                _app.panel.data.status = !status;
                _app.panel.users.status = !status;
                _app.panel.schema.status = !status;
                _app.panel.monitor.status = status;
            },
            status: false
        },
        which_opened: function() {
            if (_app.panel.data.status) {
                return 'data';
            } else if (_app.panel.users.status) {
                return 'users';
            } else if (_app.panel.schema.status) {
                return 'schema';
            } else if (_app.panel.monitor.status) {
                return 'monitor';
            }
        }
    }
}


const _app_lib = {
    update_textarea: function(textarea_selector, line, commands) {
        let remain_lines_ = '';
        let remainLineIndex_ = Number(line + 1);
        for (; remainLineIndex_ < commands.length - 1; remainLineIndex_++) {
            remain_lines_ = remain_lines_ + commands[remainLineIndex_] + ';';
        }
        $(textarea_selector).val(remain_lines_.trim());
    },
    load_yUML_svg: function(text) {
        let code_ = '// {type:class}\n';
        let array = text.split('\n');
        for (let i = 0; i < array.length; i++) {
            if (array[i].trim().startsWith('>')) {
                code_ = code_ + '\n' + array[i].replace('>', '');
            }
        }
        return new yuml_diagram().processYumlDocument(
            code_.replace('|', ''), false);
    },
    tokenizer_yc_code: function(text) {
        let tokens_ = [];
        let aux_ = text.split(' ');
        for (let i = 0; i < aux_.length; i++) {
            let aux__ = aux_[i].split('\n');
            for (let j = 0; j < aux__.length; j++) {
                if (aux__[j].trim() != '') {
                    tokens_[tokens_.length] = aux__[j].trim();
                }
            }
        }
        return tokens_;
    },
    get_entities_names_from_yc_tokens: function(tokens) {
        let entities_names_ = [];
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] == 'entity') {
                entities_names_[entities_names_.length] = tokens[i + 1];
            }
        }
        return entities_names_;
    },
    update_data_browsing_panel: function(
        table_selector, toggle_selector, data_browsing_modal_selector, datas) {
        if (_table_data != null) {
            _table_data.clear().destroy();
        }

        let index_ = 0;
        let to_toggle_ = 'Toggle column: ';
        columns = [];
        for (var key in datas[0]) {
            let visible_ = true;
            if (key == 'createdat' || key == 'updatedat' || key == 'user' ||
                key == 'role' || key == 'version' || key == 'id' ||
                key == 'classUID') {
                visible_ = false;
            }
            columns.push({
                data: key,
                title: key,
                orderable: false,
                visible: visible_,
                render: function(data, type, row) {
                    if (Object.prototype.toString.call(data) === "[object Object]") {
                        let aux = JSON.parse(JSON.stringify(data));
                        delete aux.user;
                        delete aux.role;
                        delete aux.createdat;
                        delete aux.updatedat;
                        delete aux.classUID;
                        delete aux.version;
                        delete aux.id;
                        let span = '<span title="' + JSON.stringify(aux).replaceAll('"', '')
                            .replaceAll(',', ', ') + '">' + data.id + '</span>';
                        return span;
                    } else return data;
                }
            });
            to_toggle_ = to_toggle_ + '<a class="toggle-vis" data-column="' + index_ + '">' + key + '</a>, ';
            index_++;
        }

        columns.push({
            data: '',
            title: '',
            className: "dt-center todelete",
            defaultContent: '<i class="fa fa-trash"></i>',
            orderable: false
        });

        $(toggle_selector).empty();
        $(toggle_selector).html(to_toggle_.substring(0, to_toggle_.length - 2));

        $(table_selector.concat(' thead')).empty();
        $(table_selector.concat(' tbody')).empty();
        _table_data = $(table_selector).DataTable({
            data: [],
            paging: false,
            ordering: false,
            info: false,
            searching: false,
            columns: columns
        });

        _table_data.rows.add(datas).draw();

        $('a.toggle-vis').on('click', function(e) {
            e.preventDefault();
            var column_ = _table_data.column($(this).attr('data-column'));
            column_.visible(!column_.visible());
        });

        $(table_selector.concat(' tbody')).on('click', 'td', function() {
            if (!$($(this).closest('tr')).hasClass('selected')) {
                _table_data.$('tr.selected').removeClass('selected');
                $($(this).closest('tr')).addClass('selected');
            }

            if ($(this).hasClass('todelete')) {
                let register_ = _table_data.row($(this).closest('tr')).data();
                $('div#for-api textarea').val(JSON.stringify({
                    action: "DELETE",
                    object: {
                        classUID: register_.classUID,
                        id: register_.id,
                        role: register_.role
                    }
                }, null, 2));
                $(data_browsing_modal_selector).modal('hide');
            }
        });

        $(table_selector.concat(' tbody')).on('dblclick', 'tr', function() {
            let register_ = _table_data.row($(this).closest('tr')).data();
            delete register_.createdat;
            delete register_.updatedat;
            delete register_.user;
            $('div#for-api textarea').val(JSON.stringify({ action: "UPDATE", object: register_ }, null, 2));
            $(data_browsing_modal_selector).modal('hide');
        });

        $(data_browsing_modal_selector).modal('show');
    },
    run_cli_commands: function(cmds, button_run_commands_selector) {
        _commands = cmds.trim().split(';');
        _app_lib.pipe(_line = 0, button_run_commands_selector, 'div#work-area div#for-cli textarea');
    },
    pipe: function(lineIndex, button_run_commands_selector, textarea_selector) {
        if (lineIndex < _commands.length - 1) {
            _app_lib.realize(_commands[lineIndex].trim().split(' '), 
            button_run_commands_selector, textarea_selector);
        } else {
            _editor.setValue(_editor.getValue().replaceAll('c:', '').replaceAll('u:', '').replaceAll('d:', '')
                .replaceAll('r:', ''));

            $('div#work-area div#for-schema select option[value=2]').attr('selected', 'selected').change();
            $('div#work-area div#for-schema button#schema_editor_run').click();

            _app_lib.handle_success_message('model was successfully deployed!');
        }
    },
    realize: function(tokens, button_run_commands_selector, textarea_selector) {
        switch (tokens[0].trim()) {
            case 'yc': {
                switch (tokens[1].trim()) {
                    case 'create': {
                        switch (tokens[2].trim()) {
                            case 'schema': {
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(
                                    api.endpoint.modeling.schema.create, {
                                        name: tokens[3]
                                    },
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 201) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            case 'entity': {
                                let endpoint = JSON.parse(
                                    JSON.stringify(api.endpoint.modeling.schema.entity.create));
                                endpoint.url = endpoint.url.replace('{schemaName}', tokens[3]);
                                let spec;
                                if (tokens[5] != undefined && tokens[5].length > 4) {
                                    let aux = tokens[5].substring(0, tokens[5].length - 1).replace('\'', '').replace('\'', '');
                                    spec = JSON.parse(aux);
                                    spec.name = tokens[4];
                                } else {
                                    spec = { name: tokens[4] };
                                }
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(endpoint, spec,
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 201) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            case 'attribute': {
                                let endpoint_ = JSON.parse(
                                    JSON.stringify(api.endpoint.modeling. schema.entity.attribute.create));
                                endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3])
                                    .replace('{entityName}', tokens[4]);
                                let spec;
                                if (tokens[6] != undefined && tokens[6].length > 4) {
                                    let aux = tokens[6].substring(0, tokens[6].length - 1).replace('\'', '').replace('\'', '');
                                    spec = JSON.parse(aux);
                                    spec.name = tokens[5];
                                } else {
                                    spec = { name: tokens[5] };
                                }
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(endpoint_, spec, 
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 201) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            case 'relationship': {
                                let endpoint_ = JSON.parse(
                                    JSON.stringify(api.endpoint.modeling.schema.entity.relationship.create));
                                endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3])
                                    .replace('{entityName}', tokens[4]);
                                let spec;
                                if (tokens[6] != undefined && tokens[6].length > 4) {
                                    let aux = tokens[6].substring(0, tokens[6].length - 1).replace('\'', '').replace('\'', '');
                                    spec = JSON.parse(aux);
                                    spec.name = tokens[5];
                                } else {
                                    spec = { name: tokens[5] };
                                }
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(endpoint_, spec,
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 201) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            default: {
                                _app_lib.handle_error_message('yc command unknow yc "' 
                                    + tokens[1] + ' ' + tokens[2] + ' ..."');
                                break;
                            }
                        }
                        break;
                    }
                    case 'update': {
                        switch (tokens[2].trim()) {
                            case 'schema': {
                                let endpoint_ = JSON.parse(JSON.stringify(api.endpoint.modeling.schema.update));
                                endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3]);
                                let schema = JSON.parse(tokens[4].substring(1, tokens[4].length - 1));
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(endpoint_, schema,
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 200) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            case 'entity': {
                                let endpoint_ = JSON.parse(
                                    JSON.stringify(api.endpoint.modeling.schema.entity.update));
                                endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3])
                                    .replace('{entityName}', tokens[4]);
                                let entity = JSON.parse(tokens[5].substring(1, tokens[5].length - 1));
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(endpoint_, entity,
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 200) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            case 'attribute': {
                                let endpoint_ = JSON.parse(
                                    JSON.stringify(api.endpoint.modeling.schema.entity.attribute.update));
                                endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3])
                                    .replace('{entityName}', tokens[4]).replace('{attributeName}', tokens[5]);
                                let attribute = JSON.parse(tokens[6].substring(1, tokens[6].length - 1));
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(endpoint_, attribute,
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 200) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {_app_lib.pipe(++_line,button_run_commands_selector,
                                                    textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            case 'relationship': {
                                let endpoint_ = JSON.parse(
                                    JSON.stringify(api.endpoint.modeling.schema.entity.relationship.update));
                                endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3])
                                    .replace('{entityName}', tokens[4]).replace('{relationshipName}', tokens[5]);
                                let relationship = JSON.parse(tokens[6].substring(1, tokens[6].length - 1));
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(endpoint_, relationship,
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 200) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            default: {
                                _app_lib.handle_error_message('yc command unknow yc "' +
                                        tokens[1] + ' ' + tokens[2] + ' ..."');
                                break;
                            }
                        }
                        break;
                    }
                    case 'delete': {
                        switch (tokens[2].trim()) {
                            case 'schema': {
                                let endpoint_ = JSON.parse(
                                    JSON.stringify(api.endpoint.modeling.schema.delete));
                                endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3]);
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(endpoint_, null,
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 200) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            case 'entity': {
                                let endpoint_ = JSON.parse(
                                    JSON.stringify(api.endpoint.modeling.schema.entity.delete));
                                endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3])
                                    .replace('{entityName}', tokens[4]);
                                $(button_run_commands_selector).children('span.spinner-border').show();
                                _gtools_lib.request( endpoint_, null,
                                    function(response) {
                                        $(button_run_commands_selector).children('span.spinner-border').hide();
                                        if (response.http.status == 200) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            case 'attribute': {
                                let endpoint_ = JSON.parse(
                                    JSON.stringify(api.endpoint.modeling.schema.entity.attribute.delete));
                                endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3])
                                    .replace('{entityName}', tokens[4]).replace('{attributeName}', tokens[5]);
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(endpoint_, null,
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 200) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            case 'relationship': {
                                let endpoint_ = JSON.parse(
                                    JSON.stringify(api.endpoint.modeling.schema.entity.relationship.delete));
                                endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3])
                                    .replace('{entityName}', tokens[4]).replace('{relationshipName}', tokens[5])
                                    .replace('{relationshipType}', tokens[6]);
                                $(button_run_commands_selector).show();
                                _gtools_lib.request(endpoint_, null,
                                    function(response) {
                                        $(button_run_commands_selector).hide();
                                        if (response.http.status == 200) {
                                            _app_lib.update_textarea(textarea_selector, _line, _commands);
                                            setTimeout(function() {
                                                _app_lib.pipe(++_line, button_run_commands_selector, textarea_selector);
                                            }, 500);
                                        } else {
                                            _app_lib.handle_error_message(response.data);
                                        }
                                    });
                                break;
                            }
                            default: {
                                _app_lib.handle_error_message('yc command unknow yc "' 
                                    + tokens[1] + ' ' + tokens[2] + ' ..."');
                                break;
                            }
                        }
                        break;
                    }
                    case 'create-admin-account': {
                        if (tokens[2].trim() == 'schema') {
                            let endpoint_ = JSON.parse(JSON.stringify(api.endpoint.modeling.schema.caa));
                            endpoint_.url = endpoint_.url.replace('{schemaName}', tokens[3]);
                            $(button_run_commands_selector).show();
                            _gtools_lib.request(endpoint_, null,
                                function(response) {
                                    $(button_run_commands_selector).hide();
                                    if (response.http.status == 201) {
                                        response.data = JSON.parse(response.data);
                                        $('div#admin_account_infos_modal ' +
                                                'form#admin_account_infos input[name=username]')
                                            .val(response.data.username);
                                        $('div#admin_account_infos_modal ' +
                                                'form#admin_account_infos input[name=password]')
                                            .val(response.data.password);
                                        $('div#admin_account_infos_modal ' +
                                                'form#admin_account_infos input[name=tenantID]')
                                            .val(response.data.username);
                                        $('div#admin_account_infos_modal').modal('show');
                                    } else {
                                        _app_lib.handle_error_message(response.data);
                                    }
                                });
                        } else {
                            _app_lib.handle_error_message('yc command unknow yc "' + tokens[1] +
                                    ' ' + tokens[2] + ' ..."');
                        }
                        break;
                    }
                    default: {
                        _app_lib.handle_error_message('yc command unknow yc "' 
                            + tokens[1] + ' ..."');
                        break;
                    }
                }

                break;
            }
            default: {
                _app_lib.handle_error_message('yc command unknow');
                break;
            }
        }
    },
    accounts_table_constructor: function(datas) {
        let columns_ = [{
            data: 'name',
            title: 'Name',
            orderable: false
        }, {
            data: 'username',
            title: 'Username',
            orderable: false
        }, {
            data: 'email',
            title: 'e-mail',
            render: function(data, type, row) {
                if (data) {
                    return data;
                } else return '';
            },
            orderable: false
        }, {
            data: 'status',
            title: 'Status',
            render: function(data, type, row) {
                switch (data) {
                    case 0:
                        return 'SUSPENDED';
                    case 1:
                        return 'ACTIVE';
                    case 2:
                        return 'CANCELED';
                    default:
                        return '?unknow?';
                }
            },
            orderable: false
        }, {
            data: 'roles',
            title: 'Roles',
            orderable: false,
            render: function(data, type, row) {
                if (data) {
                    let s = '';
                    for (let i = 0; i < data.length; i++) {
                        s = s + data[i].name + ', ';
                    }
                    return s.substring(0, s.length - 2);
                } else return '';
            }
        }, {
            data: '',
            title: '',
            className: "dt-center todelete",
            defaultContent: '<i class="fa fa-trash"></i>',
            orderable: false
        }];

        $('table#accounts thead').empty();
        $('table#accounts tbody').empty();

        let table_accounts = $('table#accounts').DataTable({
            data: [],
            paging: false,
            ordering: false,
            info: false,
            searching: false,
            columns: columns_
        });

        table_accounts.rows.add(datas).draw();

        $('table#accounts tbody').on('click', 'td', function() {
            if (!$($(this).closest('tr')).hasClass('selected')) {
                table_accounts.$('tr.selected').removeClass('selected');
                $($(this).closest('tr')).addClass('selected');
            }

            if ($(this).hasClass('todelete')) {
                _account = table_accounts.row($(this).closest('tr')).data();
                _route = 'to_delete_account';
                $('div#app_login_modal').modal('show');
            }
        });

        $('table#accounts tbody').on('dblclick', 'tr', function() {
            let register_ = table_accounts.row($(this).closest('tr')).data();
            _gtools_lib.populate('form#account', register_);

            let s_ = '';
            for (let i = 0; i < register_.roles.length; i++) {
                s_ = s_ + register_.roles[i].name + ', ';
            }
            $('#accounts_modal form#account input[name=roles]')
                .val(s_.substring(0, s_.length - 2));

            $('#accounts_modal button#save_account').removeAttr('disabled');
            $('#accounts_modal button#save_account span.spinner-border').hide();
            $('#accounts_modal button#save_account span#text')
                .text('Update Account');
            $('#accounts_modal form#account input[name=password]')
                .prop('disabled', true);

            _route = 'to_update_account';
            $('div#app_login_modal').modal('show');
        });

        return table_accounts;
    },
    roles_table_constructor: function(datas) {
        let columns_ = [{
            data: 'name',
            title: 'Name',
            orderable: false
        }, {
            data: 'status',
            title: 'Status',
            orderable: false,
            render: function(data, type, row) {
                if (data == 1) {
                    return 'ACTIVE';
                } else return 'SUSPENDED';
            }
        }, {
            data: 'defaultUse',
            title: 'Default',
            orderable: false,
            render: function(data, type, row) {
                if (data) {
                    return 'YES';
                } else return 'NO';
            }
        }, {
            data: 'schema',
            title: 'Schema',
            orderable: false
        }, {
            data: '',
            title: '',
            className: "dt-center todelete",
            defaultContent: '<i class="fa fa-trash"></i>',
            orderable: false
        }];

        $('table#roles thead').empty();
        $('table#roles tbody').empty();
        let table_roles = $('table#roles').DataTable({
            data: [],
            paging: false,
            ordering: false,
            info: false,
            searching: false,
            columns: columns_
        });

        table_roles.rows.add(datas).draw();

        $('table#roles tbody').on('click', 'td', function() {
            if (!$($(this).closest('tr')).hasClass('selected')) {
                table_roles.$('tr.selected').removeClass('selected');
                $($(this).closest('tr')).addClass('selected');
            }

            if ($(this).hasClass('todelete')) {
                _role = table_roles.row($(this).closest('tr')).data();
                _route = 'to_delete_role';
                $('div#app_login_modal').modal('show');
            }
        });

        $('table#roles tbody').on('dblclick', 'tr', function() {
            let register_ = table_roles.row($(this).closest('tr')).data();
            _role = register_;
            _gtools_lib.populate('form#role', register_);

            $('#roles_modal form select[name=defaultUse] option[value=' +
                (_role.defaultUse ? 'YES' : 'NO') + ']').prop('selected', true);
            $('#roles_modal button#save_role span#text').text('Update Role');

            _route = 'to_update_role';
            $('div#app_login_modal').modal('show');
        });

        return table_roles;
    },
    update_table_by_object_type: function(endpoint, table) {
        $('div#for-accounts-and-roles div.spinner-border').show();
        _gtools_lib.baas.request(_tenantID, _jwtoken, null, function(response) {
             $('div#for-accounts-and-roles div.spinner-border').hide();
            if (response.http.status == 200) {
                table.clear().draw();
                table.rows.add(response.data).draw();
            } else if (response.http.status == 201) {
                _app_lib.handle_success_message('Operation performed successfully!');
            } else {
                _app_lib.handle_error_message(response.data);
            }
        }, 'accounts_and_roles', endpoint);
    },
    logs_table_constructor: function(datas) {
        let columns_ = [{
            data: 'username',
            title: 'Username',
            render: function(data, type, row) {
                if (data) {
                    return data;
                } else return '';
            },
            orderable: false
        }, {
            data: 'httpMethod',
            title: 'HTTP Method',
            render: function(data, type, row) {
                if (data) {
                    return data;
                } else return '';
            },
            orderable: false
        }, {
            data: 'endpointUrl',
            title: 'Endpoint',
            render: function(data, type, row) {
                if (data) {
                    return data;
                } else return '';
            },
            orderable: false
        }, {
            data: 'statusCode',
            title: 'SC',
            render: function(data, type, row) {
                if (data) {
                    return data;
                } else return '';
            },
            orderable: false
        }, {
            data: 'message',
            title: 'Message',
            render: function(data, type, row) {
                if (data) {
                    if (data.startsWith('error')) {
                        return '<span style="color: darkred">' + data + '</span>';
                    } else return data;
                } else return '';
            },
            orderable: false
        }, {
            data: 'action',
            title: 'Action',
            render: function(data, type, row) {
                if (data) {
                    return data;
                } else return '';
            },
            orderable: false
        }, {
            data: 'createdAt',
            title: 'Created at',
            render: function(data, type, row) {
                if (data) {
                    return _gtools_lib.date_format(data);
                } else return '--';
            },
            orderable: false
        }];

        $('table#backend-montor thead').empty();
        $('table#backend-montor tbody').empty();

        let table_logs = $('table#backend-montor').DataTable({
            data: [],
            paging: false,
            ordering: false,
            info: false,
            searching: false,
            columns: columns_,
            columnDefs: [{
                    width: '50px',
                    'targets': [1]
                },
                {
                    width: '35px',
                    'targets': [3]
                },
                {
                    width: '50px',
                    'targets': [5]
                },
                {
                    width: '65px',
                    'targets': [6]
                }
            ]
        });

        table_logs.rows.add(datas).draw();

        $('table#backend-montor tbody').on('dblclick', 'tr', function() {

        });

        return table_logs;
    },
    editor_constructor: function(selector) {
        let editor = CodeMirror.fromTextArea(document.getElementById(selector), {
            styleActiveLine: true,
            lineNumbers: true,
            lineWrapping: true,
            autoCloseBrackets: true,
            scrollbarStyle: "simple",
            matchTags: {
                bothTags: true
            },
            extraKeys: {
                "Alt-F": "findPersistent",
                "Ctrl-J": "toMatchingTag"
            },
            mode: "text/x-yc"
        });

        let basePadding_ = 4;
        editor.on("renderLine", function(cm, line, elt) {
            var off_ = CodeMirror.countColumn(line.text, null, cm
                .getOption("tabSize")) * editor.defaultCharWidth();
            elt.style.textIndent = "-" + off_ + "px";
            elt.style.paddingLeft = (basePadding_ + off_) + "px";
        });
        editor.refresh();

        return editor;
    },
    code_snippet: function(selector, mode) {
        tinymce.init({
            selector: selector,
            plugins: 'codesample',
            codesample_languages: [{ text: 'JavaScript', value: 'javascript' }],
            toolbar: false,
            menubar: false,
            content_style: ".mce-content-body { font-size: 13px; font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;}",
            height: 356
        });
    },
    create_tagged_schema: function(schema_name, tag, schema, callback) {
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.schema.tagged.create));
        endpoint_.url = endpoint_.url.replace('{schemaName}', schema_name).replace('{tag}', tag);
        _gtools_lib.request(endpoint_, schema, callback);
    },
    get_tagged_schema: function(schema_name, tag, callback) {
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.schema.tagged.get));
        endpoint_.url = endpoint_.url.replace('{schemaName}', schema_name).replace('{tag}', tag);
        _gtools_lib.request(endpoint_, null, callback);
    },
    get_tagged_schemas: function(schema_name, callback) {
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.schema.tagged.get_all));
        endpoint_.url = endpoint_.url.replace('{schemaName}', schema_name);
        _gtools_lib.request(endpoint_, null, callback);
    },
    delete_tagged_schema: function(schema_name, tag, callback) {
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.schema.tagged.delete));
        endpoint_.url = endpoint_.url.replace('{schemaName}', schema_name).replace('{tag}', tag);
        _gtools_lib.request(endpoint_, null, callback);
    },
    callback_to_create_tagged_schema: function(response) {
        $('div#for-schema button#schema_editor_run').children('i').show();
        $('div#for-schema button#schema_editor_run').children('span.spinner-border').hide();
        if (response.http.status == 201) {
            _app_lib.handle_success_message('Operation performed successfully!');
        } else {
            _app_lib.handle_error_message(response.data);
        }
    },
    callback_to_get_tagged_schema: function(response) {
        $('div#for-schema button#schema_editor_run').children('i').show();
        $('div#for-schema button#schema_editor_run').children('span.spinner-border').hide();
        if (response.http.status == 200) {
            _editor.setValue(response.data);
        } else if (response.http.status == 404) {
            _app_lib.handle_error_message('tagged schema not found!');
        } else {
            _app_lib.handle_error_message(response.data);
        }
    },
    callback_to_get_tagged_schemas: function(response) {
        $('div#for-schema button#schema_editor_run').children('i').show();
        $('div#for-schema button#schema_editor_run').children('span.spinner-border').hide();
        if (response.http.status == 200) {
            let names_ = '';
            for (let i = 0; i < response.data.length; i++) {
                names_ = names_ + 'schema ' + _gtools_lib.baas.schema.name + '@' + response.data[i] + '\n';
            }
            _editor.setValue(names_);
        } else if (response.http.status == 404) {
            _app_lib.handle_error_message('tagged schema not found!');
        } else {
            _app_lib.handle_error_message(response.data);
        }
    },
    callback_to_delete_tagged_schema: function(response) {
        $('div#for-schema button#schema_editor_run').children('i').show();
        $('div#for-schema button#schema_editor_run').children('span.spinner-border').hide();
        if (response.http.status == 200) {
            _app_lib.handle_success_message('Operation performed successfully!');
            _editor.setValue('');
        } else if (response.http.status == 404) {
            _app_lib.handle_error_message('tagged schema not found!');
        } else {
            _app_lib.handle_error_message(response.data);
        }
    },
    build_schema_tree: function(schema) {
        if (_globals.schema.$tree) {
            _globals.schema.$tree.fancytree("getTree").clear();
            _globals.schema.$tree.fancytree("getTree").destroy();
        }

        _globals.schema.$tree = $('#tree').fancytree({
            //extensions: ['contextMenu'],
            source: schema,
            //activate: function (event, data) {
            //  var node = data.node;
            //  console.log(node.li)
            //  console.log(event)
            //},
            // Tree events
            blurTree: function(event, data) {
                // log_event(event, data);
            },
            create: function(event, data) {
                // log_event(event, data);
            },
            init: function(event, data, flag) {
                // log_event(event, data, "flag=" + flag);
            },
            focusTree: function(event, data) {
                // log_event(event, data);
            },
            // Node events
            activate: function(event, data) {
                // log_event(event, data);
                // var node = data.node;
                // acces node attributes
                // $("#echoActive").text(node.title);
                // if (!$.isEmptyObject(node.data)) {
                //          alert("custom node data: " + JSON.stringify(node.data));
                // }
            },
            beforeActivate: function(event, data) {
                // log_event(event, data, "current state=" + data.node.isActive());
                // return false to prevent default behavior (i.e. activation)
                //              return false;
            },
            beforeExpand: function(event, data) {
                // log_event(event, data, "current state=" + data.node.isExpanded());
                // return false to prevent default behavior (i.e. expanding or collapsing)
                //        return false;
            },
            beforeSelect: function(event, data) {
                //        console.log("select", event.originalEvent);
                // log_event(event, data, "current state=" + data.node.isSelected());
                // return false to prevent default behavior (i.e. selecting or deselecting)
                //        if( data.node.isFolder() ){
                //          return false;
                //        }
            },
            blur: function(event, data) {
                // log_event(event, data);
                // $("#echoFocused").text("-");
            },
            click: function(event, data) {
                //_app_lib.log_event(event, data, ", targetType=" + data.targetType);
                // return false to prevent default behavior (i.e. activation, ...)
                //return false;
            },
            collapse: function(event, data) {
                // log_event(event, data);
            },
            createNode: function(event, data) {
                // Optionally tweak data.node.span or bind handlers here
                // log_event(event, data);
            },
            dblclick: function(event, data) {
                // log_event(event, data);
                //        data.node.toggleSelect();
            },
            deactivate: function(event, data) {
                // log_event(event, data);
                // $("#echoActive").text("-");
            },
            expand: function(event, data) {
                // log_event(event, data);
            },
            focus: function(event, data) {
                // log_event(event, data);
                // $("#echoFocused").text(data.node.title);
            },
            keydown: function(event, data) {
                // log_event(event, data);
                //switch (event.which) {
                //  case 32: // [space]
                //      data.node.toggleSelected();
                //      return false;
                //}
            },
            keypress: function(event, data) {
                // currently unused
                // log_event(event, data);
            },
            //lazyload: function(event, data) {
            // log_event(event, data);
            // return children or any other node source
            // data.result = {url: "ajax-sub2.json"};
            //        data.result = [
            //          {title: "A Lazy node", lazy: true},
            //          {title: "Another node", selected: true}
            //          ];
            //},
            loadChildren: function(event, data) {
                // log_event(event, data);
            },
            postProcess: function(event, data) {
                // log_event(event, data);
                // either modify the ajax response directly
                // data.response[0].title += " - hello from postProcess";
                // or setup and return a new response object
                //        data.result = [{title: "set by postProcess"}];
            },
            renderNode: function(event, data) {
                // Optionally tweak data.node.span
                //              $(data.node.span).text(">>" + data.node.title);
                // log_event(event, data);
            },
            renderTitle: function(event, data) {
                // NOTE: may be removed!
                // When defined, must return a HTML string for the node title
                // log_event(event, data);
                //        return "new title";
            },
            select: function(event, data) {
                // log_event(event, data, "current state=" + data.node.isSelected());
                // var s = data.tree.getSelectedNodes().join(", ");
                // $("#echoSelected").text(s);
            }
        });

        _globals.schema.$tree.fancytree("getTree").getRootNode().sortChildren(null, true);
    },
    get_schema_and_build_tree: function(schema_name) {
        let endpoint_ = JSON.parse(JSON.stringify(
            api.endpoint.modeling.schema.read_all));
        endpoint_.url = endpoint_.url.replace('{schemaName}', schema_name)
        _gtools_lib.request(endpoint_, schema_name, function(response) {
            if (response.http.status == 200) {
                let tokens = _app_lib.tokenizer_yc_code(_editor.getValue());
                if (!(tokens[0] == 'schema' && tokens[2] == '(' 
                    && (tokens[3] == 'enabled' || tokens[3] == '!enabled'))) {
                    _app_lib.handle_error_message('can not retrive schema status.');
                    return;
                }
                _globals.schema.metadata.edited.clear();
                let schema = {
                    "key": 'schema',
                    "value": _gtools_lib.baas.schema.name,
                    "title": '<span style="color:#707070">schema</span> <span style="color:orange">'
                        .concat(_gtools_lib.baas.schema.name).concat('</span>'),
                    "children": []
                };

                schema.children.push({
                    "key": 'schema'.concat('-_conf'),
                    "value": "_conf",
                    "title": '<span style="color:black">_conf</span>',
                    "children": [{
                        "key": 'schema'.concat('-_conf').concat('-enabled'),
                        "value": tokens[3],
                        "title": '<span style="color:#707070">'.concat(tokens[3]).concat('</span>')
                    }],
                    "type": null
                });

                for (var entity_name in response.data) {
                    var entity = {
                        "key": 'entity',
                        "value": entity_name,
                        "title": '<span style="color:#707070">entity</span> <span style="color:orange">'
                            .concat(entity_name).concat('</span>'),
                        "children": [],
                    }

                    for (var attribute_name in response.data[entity_name]) {
                        if (attribute_name == '_classDef') {
                            let concurrencyControl_ = 'concurrencyControl';
                            if (!response.data[entity_name][attribute_name]['_concurrencyControl']) {
                                concurrencyControl_ = '!concurrencyControl';
                            }
                            let businessRule_ = 'businessRule';
                            if (!response.data[entity_name][attribute_name]['_applyBusinessRule']) {
                                businessRule_ = '!businessRule';
                            }

                            let accessControl = [];
                            accessControl.push({
                                "key":  'entity'.concat("-_conf").concat("-accessControl").concat("-read-name"),
                                "value": 'read.name',
                                "title": '<span style="color:#707070">read</span>',
                                "children":[{
                                    "key": 'entity'.concat("-_conf").concat("-accessControl").concat("-read"),
                                    "value": response.data[entity_name][attribute_name]
                                        ['_rolesByAccessType']['-_read'],
                                    "title": '<span style="color:#707070">'.concat(
                                        JSON.stringify(response.data[entity_name][attribute_name]
                                        ['_rolesByAccessType']['_read'])).concat('</span>')
                                }]
                            });

                            accessControl.push({
                                "key":  'entity'.concat("-_conf").concat("-accessControl").concat("-write-name"),
                                "value": 'write.name',
                                "title": '<span style="color:#707070">write</span>',
                                "children":[{
                                    "key": 'entity'.concat("-_conf").concat("-accessControl").concat("-write"),
                                    "value": response.data[entity_name][attribute_name]
                                        ['_rolesByAccessType']['._write'],
                                    "title": '<span style="color:#707070">'.concat(
                                        JSON.stringify(response.data[entity_name][attribute_name]
                                        ['_rolesByAccessType']['_write'])).concat('</span>')
                                }]
                            });

                            let persistence = [];
                            persistence.push({
                                "key": 'entity'.concat("-_conf").concat("-persistence").concat("-uniqueKey-name"),
                                "value": 'uniqueKey.name',
                                "title": '<span style="color:#707070">uniqueKey</span>',
                                "children":[{
                                    "key": 'entity'.concat("-_conf").concat("-persistence").concat("-uniqueKey"),
                                    "title": '<span style="color:#707070">'.concat(
                                        JSON.stringify(response.data[entity_name][attribute_name]
                                        ['_composedKey'])).concat('</span>'),
                                    "value": response.data[entity_name][attribute_name]
                                        ['_composedKey']
                                }]
                            });

                            persistence.push({
                                "key": 'entity'.concat("-_conf").concat("-persistence").concat("-indexKey-name"),
                                "value": 'indexKey.name',
                                "title": '<span style="color:#707070">indexKey</span>',
                                "children":[{
                                    "key": 'entity'.concat("-_conf").concat("-persistence").concat("-indexKey"),
                                    "title": '<span style="color:#707070">'.concat(
                                        JSON.stringify(response.data[entity_name][attribute_name]
                                        ['_composedIndex'])).concat('</span>'),
                                    "value": response.data[entity_name][attribute_name]
                                        ['_composedIndex']
                                }]
                            });

                            entity.children.push({
                                "key": 'entity'.concat("-_conf"),
                                "value": '_conf',
                                "title": '<span style="color:black">_conf</span>',
                                "children": [{
                                        "key": 'entity'.concat("-_conf").concat("-concurrencyControl"),
                                        "value": response.data[entity_name][attribute_name]['_concurrencyControl'],
                                        "title": '<span style="color:#707070">'.concat(concurrencyControl_)
                                            .concat('</span>')
                                    },{
                                        "key": 'entity'.concat("-_conf").concat("-businessRule"),
                                        "value": response.data[entity_name][attribute_name]['_applyBusinessRule'],
                                        "title": '<span style="color:#707070">'.concat(businessRule_).concat('</span>')
                                    },{
                                        "key": 'entity'.concat("-_conf").concat("-accessControl"),
                                        "title": '<span style="color:#707070">accessControl</span>',
                                        "value": 'accessControl',
                                        "children": accessControl
                                    },{
                                        "key": 'entity'.concat("-_conf").concat("-persistence"),
                                        "title": '<span style="color:#707070">persistence</span>',
                                        "value": 'persistence',
                                        "children": persistence
                                    }
                                ],
                                "value": response.data[entity_name][attribute_name]
                            });
                            
                            continue
                        }

                        let color = '#707070';
                        let object_type_ = '';
                        if (_gtools_lib.type.Java.indexOf(response.data[entity_name][attribute_name]['type']) >= 0) {
                            object_type_ = 'attribute';
                        } else {
                            object_type_ = 'relationship';
                            color = 'orange';
                        }

                        let type_ = response.data[entity_name][attribute_name]['type'];
                        if (type_ == 'String') {
                            type_ = type_ + ' ' + response.data[entity_name][attribute_name]['length']
                        }
                        let unique_ = 'unique';
                        if (!response.data[entity_name][attribute_name]['isUnique']) {
                            unique_ = '!unique';
                        }
                        let nullable_ = 'nullable';
                        if (!response.data[entity_name][attribute_name]['isUnique']) {
                            nullable_ = '!nullable';
                        }

                        entity.children.push({
                            "key": object_type_,
                            "value": attribute_name,
                            "title": '<span style="color:orange">'.concat(attribute_name).concat('</span>'),
                            "children": [{
                                "key": object_type_.concat('-_conf'),
                                "title": '<span style="color:black">_conf</span>',
                                "value": '_conf',
                                "children": [{
                                        "key": object_type_.concat("-_conf").concat("-type"),
                                        "title": '<span style="color:' + color + '">'.concat(type_).concat('</span>'),
                                        "value": response.data[entity_name][attribute_name]['type']
                                    }, {
                                        "key": object_type_.concat("-_conf").concat("-unique"),
                                        "title": '<span style="color:#707070">'.concat(unique_).concat('</span>'),
                                        "value": response.data[entity_name][attribute_name]['isUnique']
                                    }, {
                                        "key": object_type_.concat("-_conf").concat("-nullable"),
                                        "title": '<span style="color:#707070">'.concat(nullable_).concat('</span>'),
                                        "value": response.data[entity_name][attribute_name]['isNullable']
                                    }
                                ]
                            }]
                        });
                    }
                    schema.children.push(entity);
                }
                _globals.schema.metadata.edited.push(schema);
                _globals.schema.metadata.original = response.data;
                _app_lib.build_schema_tree(_globals.schema.metadata.edited);
            }
        });
    },
    log_event: function(event, data, msg) {
        const path = data.node.key.split('.');
    },
    open_accounts_and_roles_panel: function() {
        _route = 'accounts_and_roles_panel';
        _gtools_lib.baas.schema = { name: _editor.getValue().trim().split(' ')[1] };
        $('#for-accounts-and-roles #schema_name').html(_gtools_lib.baas.schema.name);
        $('div#app_login_modal button#authenticate span.spinner-border').hide();
        $('div#app_login_modal').modal('show');
    },
    launch_panel: function(option) {
        switch (option) {
            case 'monitor': {
                /*
                 * Opção para acesso ao serviço de relatório de situação
                 * de backend para um schema implantado
                 * 
                 */
                if (!_editor.getValue().trim().split(' ')[1]) {
                    $.confirm({
                        title: 'Alert Message ...',
                        content: 'Can not get the schema name from schema editor' +
                            ' area. First, load a schema into schema editor!',
                        buttons: {
                            close: function() {
                                $('div#for-schema button#schema_editor_run').children('i').show();
                                $('div#for-schema button#schema_editor_run').children('span.spinner-border').hide();
                            }
                        }
                    });
                    return;
                }

                $('div#for-schema button#schema_editor_run').children('i').show();
                $('div#for-schema button#schema_editor_run').children('span.spinner-border').hide();

                _route = 'monitor_report_panel';
                _gtools_lib.baas.schema = { name: _editor.getValue().trim().split(' ')[1] };
                $('div#app_login_modal button#authenticate span.spinner-border').hide();
                $('div#app_login_modal').modal('show');
                break;
            }
            case 'users': {
                if (!_memorize[HAS_ADMIN_ACCOUNT]) {
                    $.confirm({
                        title: 'Read the message below!',
                        content: 'This menu option should only be used with a' +
                            ' data schema and schema administrator account' +
                            ' already created. For the following authentication' +
                            ' procedure, use your schema/backend administrator' +
                            ' account. There is some?',
                        buttons: {
                            no: function() {},
                            thereIs: {
                                text: 'Yes, there is!',
                                action: function() {
                                    _memorize[HAS_ADMIN_ACCOUNT] = false;
                                    _app_lib.open_accounts_and_roles_panel();
                                }
                            },
                            thereIsAndMemorize: {
                                btnClass: 'btn-dark',
                                text: 'Yes! And memorize this answer.',
                                action: function() {
                                    _memorize[HAS_ADMIN_ACCOUNT] = true;
                                    _app_lib.open_accounts_and_roles_panel();
                                }
                            }
                        }
                    });
                } else {
                    _app_lib.open_accounts_and_roles_panel();
                }
                break;
            }
            case 'schema': {
                _app.panel.schema.set_status(true);
                $('div#work-area div#app_login_modal form input[name=password]').val('');

                $('div#work-area div#for-schema button').removeAttr('disabled');
                $('div#work-area div#for-schema textarea').removeAttr('disabled');

                _editor.setOption('readOnly', false);

                $('div#work-area div#for-schema-tree').show();
                $('div#work-area div#for-schema').show();
                $('div#work-area div#for-cli').hide();
                $('div#work-area div#for-api').hide();
                $('div#work-area div#for-accounts-and-roles').hide();
                $('div#work-area div#for-backend-monitor-panel').hide();
                break;
            }
            case 'data': {
                _app.panel.data.set_status(true);
                $('div#work-area div#app_login_modal form input[name=password]').val('');

                $('div#work-area div#for-schema button').removeAttr('disabled');
                $('div#work-area div#for-schema textarea').removeAttr('disabled');

                _editor.setOption('readOnly', true);

                $('div#work-area div#for-schema-tree').show();
                $('div#work-area div#for-schema').hide();
                $('div#work-area div#for-cli').hide();
                $('div#work-area div#for-api').show();
                $('div#work-area div#for-accounts-and-roles').hide();
                $('div#work-area div#for-backend-monitor-panel').hide();
                break;
            }
            case 'logout': {
                location.reload();
                break;
            }
            default:
                break;
        }
    },
    generate_admin_account_for_a_schema: function() {
        /*
         * gera, a partir do schema no editor de schema, o comando CLI necessário
         * para criação de conta admin para o schema
         * 
         */
        $('div#work-area div#for-cli textarea').val('yc create-admin-account schema '
            .concat(_editor.getValue().trim().split(' ')[1])
            .concat(';'));
    },
    handle_error_message: function(data) {
        console.log('error:', data);
        if (data.message && data.message.trim().length > 0) {
            $.confirm({
                title: '[ERROR] Message:',
                content: data.message,
                buttons: {
                    close: function() {}
                }
            });
        } else if (data.error && data.error.trim().length > 0) {
            $.confirm({
                title: '[ERROR] Message:',
                content: data.error,
                buttons: {
                    close: function() {}
                }
            });
        } else if (data) {
            $.confirm({
                title: '[ERROR] Message:',
                content: data,
                buttons: {
                    close: function() {}
                }
            });
        } else {
            $.confirm({
                title: '[ERROR] Message:',
                content: 'error unknow!',
                buttons: {
                    close: function() {}
                }
            });
        }
    },
    handle_success_message: function(message) {
        $.confirm({
            title: 'Message:',
            content: message,
            buttons: {
                ok: function() {}
            }
        });
    },
    reset_contextmenu_entries: function() {
        for (var entity_index_ = 0; entity_index_ < _contexmenu_entries.length - 1; entity_index_++) {
            $("#tree").contextmenu("enableEntry", _contexmenu_entries[entity_index_], false);
            $("#tree").contextmenu("showEntry", _contexmenu_entries[entity_index_], false);
        }
    },
    insert_spec: function(node, object_name) {
        if (node._action == 'schema_create') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, object_name));
        } else if (node._action == 'entity_create') {
             _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.data.value, 
                 object_name));
        } else if (node._action == 'attribute_create') {
             _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.parent.data.value, 
                 node.data.value, object_name));
        } else if (node._action == 'relationship_create') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.parent.data.value, 
                node.data.value, object_name));
        } else if (node._action == 'schema_delete') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.data.value));
        } else if (node._action == 'entity_delete') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.parent.data.value, 
                node.data.value));
        } else if (node._action == 'attribute_delete') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.parent.parent.data.value, 
                node.parent.data.value, node.data.value));
        } else if (node._action == 'relationship_delete') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.parent.parent.data.value, 
                node.parent.data.value, node.data.value));
        } else if (node._action == 'schema-_conf-enabled_change') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), 'schema-_conf-enabled_change'));
        } else  if (node._action == 'entity-_conf-concurrencyControl_change') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.data.value));
        } else if (node._action == 'entity-_conf-businessRule_change') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.data.value));
        } else if (node._action == 'attribute-_conf-nullable_change') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.parent.data.value, 
                node.data.value));
        } else if (node._action == 'attribute-_conf-unique_change') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.parent.data.value, 
                node.data.value));
        } else if (node._action == 'relationship-_conf-nullable_change') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.parent.data.value, 
                node.data.value));
        } else if (node._action == 'relationship-_conf-unique_change') {
            _editor.setValue(ycl_parse.parse(_editor.getValue(), node._action, node.parent.data.value, 
                node.data.value));
        } else {
            throw 'error: command unknow \''+node._action+'\'';
        }
    },
    generate_code: function() {
        if (!(_editor.getValue().includes(' c:') || _editor.getValue().includes(' r:') ||
                _editor.getValue().includes(' u:') || _editor.getValue().includes(' d:'))) {
            _app_lib.handle_error_message('no command was recognized!');
            return;
        }

        $('div#work-area div#for-schema-tree').children('span.spinner-border').show();
        let protocol_ = $('div#work-area div#for-api input[type=radio][name=protocol]:checked').val();
        let endpoint_ = JSON.parse(
            JSON.stringify(api.endpoint.modeling.parser.generate_scripts).replace('{script-type}', protocol_));

        _gtools_lib.request(endpoint_, _editor.getValue(),
            function(response) {
                $('div#work-area div#for-schema-tree').children('span.spinner-border').hide();
                if (response.http.status == 200) {
                    if (protocol_ == 'YC') {
                        $('div#work-area div#for-api textarea').val(response.data);
                    } else if (protocol_ == 'REST') {
                        let body_ = JSON.parse(response.data);
                        if (body_.action == 'CREATE') {
                            delete body_.object.classUID;
                            $('div#work-area div#for-api textarea').val(JSON.stringify(body_.object, null, 2));
                        } else if (body_.action == 'READ') {
                            $(' p#curl-script #http_message_type').text('GET');
                            $(' p#curl-script #content_type').html('');
                            $(' p#curl-script #url').text('http://api.ycodify.com/baas/interpreters-grid/s/rest/'
                                    .concat(body_.object.classUID).concat('/{id}/role/{role}/version/{version}'));
                        } else if (body_.action == 'UPDATE') {
                            $(' p#curl-script #http_message_type').text('PUT');
                            $(' p#curl-script #content_type').html('-H "Content-Type: application/json" \\<br>');
                            $(' p#curl-script #url').text('http://api.ycodify.com/baas/interpreters-grid/s/rest/'
                                    .concat(body_.object.classUID).concat('/{id}'));
                            delete body_.object.classUID;
                            $(' textarea').val(JSON.stringify(body_.object, null, 2));
                        } else if (body_.action == 'DELETE') {
                            $(' p#curl-script #http_message_type').text('DELETE');
                            $(' p#curl-script #content_type').html('');
                            $(' p#curl-script #url').text('http://api.ycodify.com/baas/interpreters-grid/s/rest/'
                                .concat(body_.object.classUID)
                                .concat('/{id}/role/{role}/version/{version}'));
                        }
                    } else {
                        _app_lib.handle_error_message('protocol unknow');
                    }
                    _gtools_lib.baas.schema = { name: _editor.getValue().trim().split(' ')[1] };
                } else {
                    _app_lib.handle_error_message(response.data);
                }
            }
        );
    },
    _async: {
        callbacks: [],
        run: function(target) {
            for (var key in _app_lib._async.callbacks) {
                if (target == _app_lib._async.callbacks[key].to) {
                    _app_lib._async.callbacks[key].run();
                }
            }
        }
    }
};


$(document).ready(function() {
    $('div#credentials-area').show();
    $('div#credentials-area div#account-login').show();
    $('div#credentials-area div#account-register').hide();
    $('div#work-area').hide();
    $('div#work-area div#for-schema button').removeAttr('disabled');
    $('div#work-area div#for-schema textarea').removeAttr('disabled');
    $('div#work-area div#for-accounts-and-roles').hide();
    $('div#work-area div#for-accounts-and-roles table#account').show();
    $('div#work-area div#for-accounts-and-roles table#roles').hide();
    $('div#work-area div#for-backend-monitor-panel').hide();
    $('div#work-area div#for-backend-monitor-panel table#error-montor').show();
    $('.spinner-border').hide();

    $('div#work-area div#for-cli textarea').prop('readonly', true);

    _table_accounts = _app_lib.accounts_table_constructor([]);
    _table_roles = _app_lib.roles_table_constructor([]);
    _table_log = _app_lib.logs_table_constructor([]);
    _editor = _app_lib.editor_constructor("code");

    $('div#work-area .CodeMirror').css('height', '380px');

    $('#to_register').click(function(e) {
        $('div#account-login').hide();
        $('div#account-register').show();
    });

    $('#to_login').click(function(e) {
        $('div#account-login').show();
        $('div#account-register').hide();
    });


    /*
     * o evento aqui gatilha o login para uma dada conta de usuário
     * 
     */
    $('div#account-login button#login').click(function(e) {
        $('div#account-login .spinner-border').show();
        $('div#account-login button#login').prop('disabled', true);
        let credentials_ = $('div#account-login form').serializeJSON();
        _gtools_lib.request(api.endpoint.auth,
            'grant_type=password'
            .concat('&username=').concat(credentials_.username)
            .concat('&password=').concat(credentials_.password),
            function(response) {
                $('div#account-login form input#password').val('');
                $('div#account-login .spinner-border').hide();
                $('div#account-login button#login').removeAttr('disabled');
                if (response.http.status == 200) {
                    _editor.setValue('');
                    $('div#nav').show();
                    $('div#account-login form input#username').val('');
                    $('textarea').val('');
                    $('div#credentials-area').hide();
                    $('div#account-login').hide();
                    $('div#account-register').hide();
                    $("select").find('option').attr("selected", false);
                    $('input[type=radio]').removeAttr('checked');
                    $('div#work-area div#for-schema-tree').show();
                    $('div#work-area div#for-schema').show();
                    $('div#work-area div#for-schema .spinner-border').hide();
                    $('div#work-area div#for-cli').hide();
                    $('div#work-area div#for-api').hide(); // show
                    $('div#work-area div#for-accounts-and-roles').hide();
                    $('div#work-area div#for-backend-monitor-panel').hide();
                    $('div#work-area div#for-schema select option[value=2]').prop('selected', true);
                    $('div#work-area div#for-api input[type=radio][name=protocol][value=YC]')
                        .prop('checked', true).change();
                    _app.panel.schema.set_status(true);
                    $('div#work-area').show();
                    api.credentials = JSON.parse(response.data);
                } else if (response.http.status == 401) {
                    _app_lib.handle_error_message('unauthorized access!');
                } else {
                    _app_lib.handle_error_message('login fails. '.concat(
                            JSON.stringify(response.data)));
                }
            },
            'login');
    });


    /*
     * o evento aqui gatilha o registro de uma nova conta de usuário
     * 
     */
    $('button#register').click(function(e) {
        $('div#account-register .spinner-border').show();
        $(this).prop('disabled', true);
        let account_ = $('div#account-register form').serializeJSON();
        if (!account_.username.isAlphaNumeric()) {
            $.confirm({
                title: 'Alert:',
                content: 'your account username must be a alphanumeric name.',
                buttons: {
                    close: function() {}
                }
            });
            return;
        }
        let endpoint_ = api.endpoint.account.create;
        _gtools_lib.request(endpoint_, account_, function(response) {
            setTimeout(function() {
                $('div#account-register .spinner-border').hide();
                $('div#account-register button#register').removeAttr('disabled');
            }, 200);
            if (response.http.status == 201) {
                $.confirm({
                    title: 'Message:',
                    content: 'account successfully registered!',
                    buttons: {
                        login: function() {
                            $('div#account-login form input[name=username]').val(account_.username);
                            $('div#account-login form input[name=password]').val(account_.password);
                            $('button#login').click();
                            setTimeout(function() {
                                $('#to_login').click();
                            }, 1000);
                        }
                    }
                });
            } else {
                console.log('error:', response);
                _app_lib.handle_error_message('error: register fails. '.concat(JSON.stringify(response.data)));
            }
        });
    });

    _app_lib.code_snippet('textarea#snippet');

    $('div#for-api button#show-js-service-code').click(function(e) {
        $('div#service-code-modal').modal('show');
        $('div.tox-statusbar').css('display', 'none');
    });

    $('div#for-api button#show-axios-service-code').attr('disabled', true);

    $('div#work-area [data-toggle="tooltip"]').tooltip();

    $('div#work-area div#for-cli button#clear_textarea').click(function(e) {
        $('div#for-cli textarea').val('');
    });

    $('div#work-area div#for-api button#run-script').click(function(e) {
        _route = 'data_browsing_panel';
        $('div#app_login_modal').modal('show');
    });

    $('div#work-area input#disable-cli').change(function(e) {
        if (_disable_cli) {
            $('div#work-area div#for-cli textarea').prop('readonly', true);
        } else {
            $('div#work-area div#for-cli textarea').removeAttr('readonly');
        }
        _disable_cli = !_disable_cli;
    });

    $('div#work-area div#for-cli button#copy_clipboard').click(function(e) {
        _gtools_lib.copy_clipboard('cli');
    });

    $('div#work-area div#for-schema button#copy_schema_to_clipboard').click(function(e) {
        _gtools_lib.copy_clipboard('code', _editor.getValue());
    });

    $('div#admin_account_infos_modal button#admin_account_infos_close').click(function(e) {
        $('div#admin_account_infos_modal').modal('hide');
    });

    $('div#admin_account_infos_modal button#admin_account_infos_copy_clipboard').click(function(e) {
        let message = ' username: ' + $('div#admin_account_infos_modal form#admin_account_infos input[name=username]').val();
        message = message + '\n password: ' + $('div#admin_account_infos_modal form#admin_account_infos input[name=password]').val();
        message = message + '\n X-TenantID: ' + $('div#admin_account_infos_modal form#admin_account_infos input[name=tenantID]').val();
        copyToClipboard(message);
    });

    $('div#work-area #protocol-default').click();

    $('div#work-area div#for-schema-tree input#schema_name_for_search').keypress(function(e) {
        $(this).val($(this).val().toLowerCase());
        if (e.keyCode == 13) {
            _editor.setValue('schema '.concat($(this).val()));
            $('div#work-area div#for-schema select option').removeAttr('selected');
            $('div#work-area div#for-schema select option[value=2]').prop('selected', true);

            $('div#work-area div#for-schema-tree .spinner-border').show();
            _app_lib._async.callbacks.push({
                to: 'schema_editor_run',
                run: function() {
                    $('div#work-area div#for-schema-tree .spinner-border').hide();
                }
            });

            $('div#work-area div#for-schema button#schema_editor_run').click();
        }
    });


    /* 
     * O evento gatilhado pelo click aqui implica gerar os comandos para o CLI
     * 
     */
    $('div#work-area div#for-schema button#deploy-schema').click(function(e) {
        if (!(_editor.getValue().includes(' c:') ||
                _editor.getValue().includes(' u:') ||
                _editor.getValue().includes(' d:'))) {
            _app_lib.handle_error_message('no command was recognized!');
            return;
        }

        _gtools_lib.request(api.endpoint.modeling.parser.generate_cli,
            _editor.getValue(),
            function(response) {
                if (response.http.status == 200) {
                    let text_ = '';
                    let lines_ = response.data.split(';');
                    for (let i = 0; i < lines_.length; i++) {
                        text_ = text_ + lines_[i] + ';\n';
                    }
                    $('div#work-area div#for-cli textarea').val(text_.substring(0, text_.length - 2));
                    _app_lib.run_cli_commands($('div#work-area div#for-cli textarea').val(),
                        'div#work-area div#for-schema button#deploy-schema span.spinner-border');
                } else {
                    _app_lib.handle_error_message(response.data);
                }
            }
        );
    });


    /*
     * O evento gatilhado aqui implica gerar o JSON do body da mesagem POST 
     * a ser enviada aos interpretadores
     *
     */


    /*
     * o click aqui gatilha uma das operações selecionadas no select-box no
     * tipo da area de edicao de schema de dados via YCL. esse é o botão RUN. 
     * 
     */
    $('div#work-area div#for-schema button#schema_editor_run').click(function(e) {
        e.preventDefault();
        let target_id = 'schema_editor_run';

        $('div#work-area div#for-schema button#schema_editor_run').children('i').hide();
        $('div#work-area div#for-schema button#schema_editor_run').children('span.spinner-border')
            .show();
        
        _app_lib._async.callbacks.push({
            to: target_id,
            run: function() {
                $('div#work-area div#for-schema button#schema_editor_run').children('i').show();
                $('div#work-area div#for-schema button#schema_editor_run').children('span.spinner-border')
                    .hide();
            }
        });

        let option_ = $('div#work-area div#for-schema select option:selected').val();
        if (option_ == 2 && _editor.getValue().trim().length == 0) {
            option_ = 0;
        }
        if (option_ == 0) {
            /*
             * Opção em que se deseja carregar a lista de todos os schemas 
             * implatados
             * 
             */
            let endpoint = api.endpoint.modeling.schema.read;
            _gtools_lib.request(endpoint, null, function(response) {
                _app_lib._async.run(target_id);
                if (response.http.status == 200) {
                    var lines_ = '';
                    for (let index in response.data) {
                        if (index < response.data.length) {
                            lines_ += 'schema ' + response.data[index] + '\n';
                        }
                    }
                    _editor.setValue(lines_);
                } else {
                    _app_lib.handle_error_message(response.data);
                }
            });
        } else if (option_ == 2) {
            /*
             * Opção em que se deseja carregar a especificação de um
             * schema implantado
             * 
             */
            if (!_editor.getValue().trim().split(' ')[1]) {
                _app_lib.handle_error_message('Can not get the schema name from schema editor' +
                        ' area. First, load a schema into schema editor!');
                _app_lib._async.run(target_id);
                return;
            }

            const obj_name_ = _editor.getValue().trim().split(' ')[1];
            let endpoint = JSON.parse(
                JSON.stringify(api.endpoint.modeling.parser.reverse));
            endpoint.url = endpoint.url.replace("{path-to-object}", obj_name_);
            _gtools_lib.request(endpoint, null, function(response) {
                _app_lib._async.run(target_id);
                if (response.http.status == 200) {
                    _gtools_lib.baas.schema = { name: obj_name_ };
                    _editor.setValue(response.data);
                    _app_lib.get_schema_and_build_tree(_gtools_lib.baas.schema.name);
                } else {
                    _app_lib.handle_error_message(response.data);
                }
            });
        } else if (option_ == 5) {
            /*
             * Opção para realização de backup de dados de um schema
             * de dados já implantado
             * 
             */
            if (!_editor.getValue().trim().split(' ')[1]) {
                _app_lib.handle_error_message('Can not get the schema name from schema editor' +
                        ' area. First, load a schema into schema editor!');
                _app_lib._async.run(target_id);
                return;
            }

            _app_lib._async.run(target_id);
            _gtools_lib.baas.schema = { name: _editor.getValue().trim().split(' ')[1] };

            _route = 'do_data_backup';
            $('div#app_login_modal').modal('show');
        } else if (option_ == 6) {
            /*
             * Opção para restauração de dados para a base de dados de um
             * schema já implantado, tendo por princípio um arquivo gerado
             * pela opção de backup
             * 
             */
            if (!_editor.getValue().split(' ')[1]) {
                _app_lib.handle_error_message('Can not get the schema name from schema editor' +
                        ' area. First, load a schema into schema editor!');
                _app_lib._async.run(target_id);
                return;
            }

            _app_lib._async.run(target_id);
            _gtools_lib.baas.schema = { name: _editor.getValue().trim().split(' ')[1] };

            _route = 'restore_backup';
            $('div#app_login_modal').modal('show');
        } else if (option_ == 9) {
            /*
             * Serviço de etiquetagem para uma dada especificação de um schema
             * 
             */
            if (!_editor.getValue().trim().split(' ')[1]) {
                _app_lib.handle_error_message('Can not get the schema name from schema editor' +
                        ' area. First, load a schema into schema editor!');
                _app_lib._async.run(target_id);
                return;
            }

            let schema_name = '';
            let tag = '';

            try {
                let schema_name_tagged = _editor.getValue().trim().split(' ')[1];
                schema_name = schema_name_tagged.trim().split('@')[0];
                tag = schema_name_tagged.trim().split('@')[1];
            } catch (error) {
                _app_lib.handle_error_message(error);
                return;
            }
            _app_lib.create_tagged_schema(schema_name, tag, _editor.getValue(),
                _app_lib.callback_to_create_tagged_schema);
        } else if (option_ == 10) {
            /*
             * Recuperação de um schema de dados etiquetado. Se houver uma 
             * declaração de schema no editor, recupera o q estiver informado 
             * aí. Caso não haja qq informação, recupera a lista de todos 
             * schemas etiquetados
             * 
             */
            if (!_editor.getValue().trim().split(' ')[1]) {
                _app_lib.handle_error_message('Can not get the schema name from schema editor' +
                        ' area. First, load a schema into schema editor!');
                _app_lib._async.run(target_id);
                return;
            }

            let schema_name_tagged = '';
            let schema_name = '';

            try {
                schema_name_tagged = _editor.getValue().trim().split(' ')[1];
                schema_name = schema_name_tagged.trim().split('@')[0];

                _gtools_lib.baas.schema = { name: schema_name };
            } catch (error) {
                _app_lib.handle_error_message(error);
                return;
            }

            if (schema_name && schema_name.length < 3) {
                _app_lib.handle_error_message('schema name has less than 3 characters');
                return;
            }

            if (schema_name_tagged.includes('@')) {
                let tag = schema_name_tagged.trim().split('@')[1];
                if (tag && tag.length < 2) {
                    _app_lib.handle_error_message('tag has less than 2 characters');
                    return;
                }
                _app_lib.get_tagged_schema(schema_name, tag, app_lib.callback_to_get_tagged_schema);
            } else {
                _app_lib.get_tagged_schemas(schema_name, _app_lib.callback_to_get_tagged_schemas);
            }
        } else if (option_ == 11) {
            /*
             * Serviço de deleção de uma especificação de um schema
             * etiquetado.
             * 
             */
            if (!_editor.getValue().trim().split(' ')[1]) {
                _app_lib.handle_error_message('Can not get the schema name from schema editor' +
                        ' area. First, load a schema into schema editor!');
                _app_lib._async.run(target_id);
                return;
            }

            let schema_name = '';
            let tag = '';

            try {
                let schema_name_tagged = _editor.getValue().trim().split(' ')[1];
                schema_name = schema_name_tagged.trim().split('@')[0];
                tag = schema_name_tagged.trim().split('@')[1];
            } catch (error) {
                _app_lib.handle_error_message(error);
                return;
            }
            _app_lib.delete_tagged_schema(schema_name, tag, _app_lib.callback_to_delete_tagged_schema);
        }
    });


    /*
     * click que gatilha o evento de autenticação de um usuário de 
     * backend de um dado schema implantado
     * 
     */
    $('div#app_login_modal button#authenticate').click(function(e) {
        e.preventDefault();

        $('div#app_login_modal button#authenticate').children('span.spinner-border').show();
        $('div#app_login_modal button#authenticate').prop('disabled', true);

        let credentials = $('div#app_login_modal form').serializeJSON();
        let data_ = 'grant_type=password'.concat('&username=').concat(credentials.username)
            .concat('&password=').concat(credentials.password);
        _gtools_lib.baas.request(null, null, data_, function(response) {
            $('div#app_login_modal button#authenticate').children('span.spinner-border').hide();
            $('div#app_login_modal button#authenticate').removeAttr('disabled');
            if (response.http.status == 200) {
                _jwtoken = response.data.access_token;
                _tenantID = credentials.username;
                $('div#app_login_modal').modal('hide');
                if (_route == 'accounts_and_roles_panel') {
                    /*
                     * A opcao um especifica a os dados exibidos sejam de contas
                     * de usuarios no momento em que o panel de contas e papeis
                     * é renderizado.
                     * 
                     */
                    _app.panel.users.set_status(true)

                    _editor.setOption('readOnly', true);

                    $('div#work-area div#for-accounts-and-roles select option[value=1]')
                        .attr('selected', 'selected').change();
                    $('div#work-area div#for-schema-tree').show();
                    $('div#work-area div#for-schema').hide();
                    $('div#work-area div#for-cli').hide();
                    $('div#work-area div#for-api').hide();
                    $('div#work-area div#for-accounts-and-roles').show();
                    $('div#work-area div#for-backend-monitor-panel').hide();
                } else if (_route == 'change_account_password_panel') {
                    /*
                     * Aqui a apresentacao da caixa de diálogo para mudança de senha
                     * 
                     */
                    $('div#change_account_password_modal').modal('show');
                } else if (_route == 'monitor_report_panel') {
                    /*
                     * Aqui a apresentacao do painel de report de estados e erros]
                     * de backend para o schema de uma aplicação qualquer
                     * 
                     */
                    $('div#work-area div#for-schema-tree').show();
                    $('div#work-area div#for-schema').hide();
                    $('div#work-area div#for-cli').hide();
                    $('div#work-area div#for-api').hide();
                    $('div#work-area div#for-accounts-and-roles').hide();
                    $('div#work-area div#for-backend-monitor-panel').show();
                    _app.panel.monitor.set_status(true);

                    _editor.setOption('readOnly', true);

                    let endpoint_ = null;
                    let type = $('div#work-area #for-backend-monitor-panel'
                        +' select[name=type] option:selected').val();
                    if (type == 'ERROR') {
                        let limit_ = new Date().getTime() - (24 * 3600 * 1000);
                        endpoint_ = JSON.parse(JSON.stringify(api.endpoint.igrid.log.error.get));
                        endpoint_.url = endpoint_.url.replace('{operation}', "all").replace('{time}', limit_)
                            .replace('{op}', "gte");
                    } else if (type == 'INFO') {
                        endpoint_ = JSON.parse(
                            JSON.stringify(api.endpoint.igrid.log.info.get));
                    } else if (type == 'CONSUMPTION') {
                        endpoint_ = JSON.parse(
                            JSON.stringify(api.endpoint.igrid.log.consumption.get));
                    }

                    $('div#work-area #for-backend-monitor-panel div.spinner-border').show();

                    _gtools_lib.baas.request(
                        _tenantID, _jwtoken, null,
                        function(response) {
                            _table_log.clear().draw();
                            $('div#work-area #for-backend-monitor-panel div.spinner-border').hide();
                            if (response.http.status == 200) {
                                _table_log.rows.add(response.data).draw();
                                _app_lib.handle_success_message('Operation performed successfully!')
                            } else if (response.http.status == 404) {
                                _app_lib.handle_error_message('logs not found!');
                            } else {
                                _app_lib.handle_error_message(JSON.parse(response.data).message);
                            }
                        }, 'accounts_and_roles', endpoint_);
                } else if (_route == 'to_delete_account') {
                    /*
                     * aqui a possibilitade de deleção de um registro de conta
                     * de usuário de dados de um schema implantado
                     * 
                     */
                    let endpoint_ = JSON.parse(JSON.stringify(api.endpoint.backend.account.delete));
                    endpoint_.url = endpoint_.url.replace('{username}', _account.username)
                        .replace('{version}', _account.version);
                    $('div#work-area div#for-accounts-and-roles div.spinner-border').show();
                    _gtools_lib.baas.request(_tenantID, _jwtoken, null,
                        function(response) {
                            $('div#work-area div#for-accounts-and-roles div.spinner-border').hide();
                            if (response.http.status == 200) {
                                _table_accounts.row('.selected').remove().draw(false);
                                _app_lib.handle_success_message('Operation performed successfully!');
                            } else {
                                _app_lib.handle_error_message(response.data);
                            }
                        }, 'accounts_and_roles', endpoint_);
                } else if (_route == 'to_update_account') {
                    /*
                     * aqui a possibilitade de atualização de um registro de conta
                     * de usuário de dados de um schema implantado
                     * 
                     */
                    $('#accounts_modal').modal('show');
                } else if (_route == 'to_delete_role') {
                    /*
                     * aqui a possibilitade de deleção de um registro de papel
                     * de usuário de dados de um schema implantado
                     * 
                     */
                    let endpoint_ = JSON.parse(JSON.stringify(api.endpoint.backend.role.delete));
                    endpoint_.url = endpoint_.url.replace('{name}', _role.name).replace('{version}', _role.version);
                    $('div#work-area div#for-accounts-and-roles div.spinner-border').show();
                    _gtools_lib.baas.request(_tenantID, _jwtoken, null,
                        function(response) {
                            $('div#work-area div#for-accounts-and-roles div.spinner-border').hide();
                            if (response.http.status == 200) {
                                _table_roles.row('.selected').remove().draw(false);
                                _app_lib.handle_success_message('Operation performed successfully!');
                            } else {
                                _app_lib.handle_error_message(response.data);
                            }
                        }, 'accounts_and_roles', endpoint_);
                } else if (_route == 'to_update_role') {
                    /*
                     * aqui a possibilitade de atualização de um registro de papel
                     * de usuário de dados de um schema implantado
                     * 
                     */
                    $('#roles_modal').modal('show');
                } else if (_route == 'do_data_backup') {
                    /*
                     * após confirmada a autenticação do super usuario de
                     * backend para um schema implantado, segue a operação
                     * de backup de dados do schema implantado
                     * 
                     */
                    $('div#work-area div#for-schema').children('i').hide();
                    $('div#work-area div#for-schema').children('span.spinner-border').show();

                    let entities_ = _app_lib.get_entities_names_from_yc_tokens(
                        _app_lib.tokenizer_yc_code(_editor.getValue()));
                    _gtools_lib.baas.ds_data_backup_request(_tenantID, _jwtoken, entities_,
                        function(response) {
                            $('div#work-area div#for-schema').children('i').show();
                            $('div#work-area div#for-schema').children('span.spinner-border').hide();
                            if (response.status != 200) {
                                _app_lib.handle_error_message(response.data);
                            }
                        });
                } else if (_route == 'data_browsing_panel') {
                    /*
                     * após confirmada a autenticação do super usuario de
                     * backend para um schema implantado, segue a operação
                     * de operação sobre os dados da base de dados do
                     * schema implantado
                     * 
                     */
                    $('div#work-area div#for-api button#run-script').children('span.spinner-border').show();
                    $('div#work-area div#for-api button#run-script').prop('disabled', true);

                    let data__ = JSON.parse($('div#work-area div#for-api textarea').val());
                    _gtools_lib.baas.request(
                        _tenantID, _jwtoken, data__,
                        function(response) {
                            $('div#work-area div#for-api button#run-script').children('span.spinner-border').hide();
                            $('div#work-area div#for-api button#run-script').removeAttr('disabled');
                            if (response.http.status == 200) {
                                if (data__.action == 'READ') {
                                    _app_lib
                                        .update_data_browsing_panel('table#data_browsing', 'div#to_toggle',
                                            'div#data_browsing_modal', response.data.data);
                                } else {
                                    _app_lib.handle_success_message('Operation performed successfully!');
                                }
                            } else if (response.http.status == 201) {
                                _app_lib.handle_success_message('Operation performed successfully!');
                            } else if (response.http.status == 404 &&
                                data__.action == 'READ') {
                                _app_lib.handle_error_message('data not found!');
                            } else {
                                _app_lib.handle_error_message(response.data);
                            }
                        }, 'data');
                } else if (_route == 'restore_backup') {
                    $('div#restore_backup_modal').modal('show');
                }
            } else {
                _app_lib.handle_error_message(response.data);
            }
        }, 'login');
    });


    /*
     * A ação gatilhada aqui definitá o formato do protocolo YC
     * empregado para conformar, tanto a URL do serviço, quanto
     * o JSON que eventualmente seja demandado o uso
     * 
     */
    $('div#work-area div#for-api input[type=radio][name=protocol]').change(function(e) {
        if (this.value == 'YC') {
            $(' p#curl-script #http_message_type').text('POST');
            $(' p#curl-script #content_type').html('-H "Content-Type: application/json" \\<br>');
            $(' p#curl-script #url').text('http://api.ycodify.com/baas/interpreters-grid/s');
            $(' textarea').val('');
            $(' button#run-script').removeAttr('disabled');
        } else if (this.value == 'REST') {
            $(' p#curl-script #http_message_type').text('POST');
            $(' p#curl-script #content_type').html('-H "Content-Type: application/json" \\<br>');
            $(' p#curl-script #url').text('http://api.ycodify.com/baas/interpreters-grid/s/rest/{classUID}');
            $(' textarea').val('');
            $(' button#run-script').prop('disabled', true);
        }
    });


    /*
     * Aqui a mudança desse select implicará a exibição da tabela
     * do painel com conteudo (1) de contas de usuários; (2) com
     * papeis de contas de usuários para schemas implantados.
     * 
     */
    $('div#work-area div#for-accounts-and-roles select').change(function(e) {
        $('div#work-area div#for-schema button').prop('disabled', true);
        $('div#work-area div#for-schema textarea').prop('disabled', true);

        _gtools_lib.baas.schema = {
            name: _editor.getValue().trim().split(' ')[1]
        };

        if (this.value == 1) {
            $('div#work-area div#for-accounts-and-roles table#accounts').show();
            $('div#work-area div#for-accounts-and-roles table#roles').hide();
            $('div#work-area div#for-accounts-and-roles #object_type').html('Account');
            $('#accounts_modal #object_type').html('Account');
            _app_lib.update_table_by_object_type(
                JSON.parse(JSON.stringify(api.endpoint.backend.account.get_all)), _table_accounts);
        } else if (this.value == 2) {
            $('div#work-area div#for-accounts-and-roles table#accounts').hide();
            $('div#work-area div#for-accounts-and-roles table#roles').show();
            $('div#work-area div#for-accounts-and-roles #object_type').html('Role');
            $('#accounts_modal #object_type').html('Role');
            _app_lib.update_table_by_object_type(JSON.parse(
                    JSON.stringify(api.endpoint.backend.role.get_all)), _table_roles);
        } else if (this.value == 3) {
            _route = 'change_account_password_panel';
            $('#change_account_password_modal button#change_account_password span.spinner-border').hide();
            $('div#app_login_modal').modal('show');
        } else {
            _app_lib.handle_error_message('render panel fails');
            $('div#work-area div#for-accounts-and-roles table#accounts').hide();
            $('div#work-area div#for-accounts-and-roles table#roles').hide();
            $('div#work-area div#for-accounts-and-roles #object_type').html('');
            $('#accounts_modal #object_type').html('');
        }
    });

    $('button#create-account-or-role').click(function(e) {
        if ($('div#work-area div#for-accounts-and-roles select').val() == 1) {
            $('#accounts_modal button#save_account').removeAttr('disabled');
            $('#accounts_modal button#save_account span.spinner-border').hide();
            $('#accounts_modal form select[name=status] option[value=1]').prop('selected', true);
            $('#accounts_modal form input[name=password]').prop('disabled', false);
            $('#accounts_modal button#save_account span#text').text('Create Account');
            $('#accounts_modal').modal('show');
        } else if ($('div#work-area div#for-accounts-and-roles select').val() == 2) {
            _role = null;
            $('#roles_modal button#save_role').removeAttr('disabled');
            $('#roles_modal button#save_role span.spinner-border').hide();
            $('#roles_modal form select[name=status] option[value=1]').prop('selected', true);
            $('#roles_modal form select[name=defaultUse] option[value=NO]').prop('selected', true);
            $('#roles_modal button#save_role span#text').text('Create Role');
            $('#roles_modal').modal('show');
        }
    });

    $('button#save_account').click(function(e) {
        let account_ = $('div#accounts_modal form').serializeJSON();
        account_.status = $('div#accounts_modal form select[name=status] option:selected').val();

        if (!account_.name || account_.name.length <= 4) {
            _app_lib.handle_error_message('you must define a value to the name field.');
            return;
        }

        if (!account_.email || account_.email.length == 0 || account_.email.indexOf('@') < 0) {
            _app_lib.handle_error_message('you must define a value to the email field.');
            return;
        }

        if (!account_.status || !(Number(account_.status) == 0 || Number(account_.status) == 1)) {
            _app_lib.handle_error_message('you must define a value to the status field.');
            return;
        }

        if (!account_.username || account_.username.length <= 3) {
            _app_lib.handle_error_message('the username must be at least 4 characters long.');
            return;
        }

        if ($('div#accounts_modal button#save_account span#text').text() == 'Create Account') {
            if (!account_.password || account_.password.length <= 5) {
                _app_lib.handle_error_message('the password must be at least 6 characters long.');
                return;
            }
        }

        if (!account_.roles || account_.roles.length == 0) {
            _app_lib.handle_error_message('you must define a value to the roles field.');
            return;
        }

        account_.roles = account_.roles.split(',');
        let roles = [];
        for (let i = 0; i < account_.roles.length; i++) {
            roles.push({
                name: account_.roles[i]
            });
        }
        account_.roles = roles;
        account_.status = Number(account_.status);

        let endpoint_;
        if ($('div#accounts_modal button#save_account span#text').text() == 'Create Account') {
            endpoint_ = api.endpoint.backend.account.create;
        } else if ($('div#accounts_modal button#save_account span#text').text() == 'Update Account') {
            delete account_.password;
            endpoint_ = api.endpoint.backend.account.update;
        } else {
            _app_lib.handle_error_message('unknow operation.');
            return;
        }

        $('div#accounts_modal button#save_account').children('span.spinner-border').show();
        $('div#accounts_modal button#save_account').prop('disabled', true);

        _gtools_lib.baas.request(_tenantID, _jwtoken, account_,
            function(response) {
                $('div#accounts_modal button#save_account').children('span.spinner-border').hide();
                $('div#accounts_modal button#save_account').removeAttr('disabled');
                if (response.http.status == 201) {
                    _table_accounts.row.add(account_).draw();
                    $('#accounts_modal').modal('hide');
                    _app_lib.handle_success_message('Operation performed successfully!');
                } else if (response.http.status == 200) {
                    _app_lib.update_table_by_object_type(JSON.parse(
                            JSON.stringify(api.endpoint.backend.account.get_all)), _table_accounts);
                    $('#accounts_modal').modal('hide');
                    _app_lib.handle_success_message('Operation performed successfully!');
                } else {
                    _app_lib.handle_error_message(response.data);
                }
            }, 'accounts_and_roles', endpoint_);
    });

    $('button#save_role').click(function(e) {
        let role_ = $('div#roles_modal form').serializeJSON();

        role.status = Number($('#roles_modal select[name=status] option:selected').val());
        role_.defaultUse = 
            $('#roles_modal select[name=defaultUse] option:selected').val() == 'YES' ? true : false;

        if (!role_.name || role_.name.length == 0) {
            _app_lib.handle_error_message('you must define a value to the name field.');
            return;
        }
        role_.name = role_.name.toUpperCase();

        if ((Number(role_.status) != 0 && Number(role_.status) != 1)) {
            _app_lib.handle_error_message('you must define a value to the status field.');
            return;
        }
        role_.status = Number(role_.status);

        let endpoint_ = '';
        if ($('div#roles_modal button#save_role span#text').text() == 'Create Role') {
            endpoint_ = api.endpoint.backend.role.create;
        } else if ($('div#roles_modal button#save_role span#text').text() == 'Update Role') {
            endpoint_ = JSON.parse(JSON.stringify(api.endpoint.backend.role.update));
            endpoint_.url = endpoint_.url.replace('{name}', role_.name);
        }

        $('div#roles_modal button#save_role').children('span.spinner-border').show();
        $('div#roles_modal button#save_role').prop('disabled', true);

        _gtools_lib.baas.request(
            _tenantID, _jwtoken, role_,
            function(response) {
                $('div#roles_modal button#save_role').children('span.spinner-border').hide();
                $('div#roles_modal button#save_role').removeAttr('disabled');
                if (response.http.status == 201) {
                    role_.schema = _gtools_lib.baas.schema.name;
                    _table_roles.row.add(role_).draw();
                    $('#roles_modal').modal('hide');
                    _app_lib.handle_success_message('Operation performed successfully!');
                } else if (response.http.status == 200) {
                    _app_lib.update_table_by_object_type(JSON.parse(
                            JSON.stringify(api.endpoint.backend.role.get_all)), _table_roles);
                    $('#roles_modal').modal('hide');
                    _app_lib.handle_success_message('Operation performed successfully!');
                } else {
                    _app_lib.handle_error_message(response.data);
                }
            }, 'accounts_and_roles', endpoint_);
    });

    $('#change_account_password_modal button#change_account_password').click(function(e) {
            let account = $('div#change_account_password_modal form#account_for_change_password')
                .serializeJSON();
            let endpoint_ = JSON.parse(JSON.stringify(api.endpoint.backend.account.updatePassword));
            $('#change_account_password_modal button#change_account_password').prop('disabled', true);
            $('#change_account_password_modal button#change_account_password span.spinner-border')
                .show();
            _gtools_lib.baas.request(_tenantID, _jwtoken, account, function(response) {
                $('#change_account_password_modal button#change_account_password').removeAttr('disabled');
                $('#change_account_password_modal button#change_account_password span.spinner-border')
                    .hide();
                if (response.http.status == 200) {
                    $('#change_account_password_modal form input').val('');
                    $('#change_account_password_modal').modal('hide');
                    _app_lib.handle_success_message('Operation performed successfully!');
                } else {
                    _app_lib.handle_error_message(response.data);
                }
            }, 'accounts_and_roles', endpoint_);
        });

    $('#restore_backup_modal #formToRestoreBackup button').click(function(e) {
        $('#restore_backup_modal #formToRestoreBackup button').children('span.spinner-border').show();
        $('#restore_backup_modal #formToRestoreBackup button').prop('disabled', true);

        const formData = new FormData();
        formData.append('file', document.getElementById('file_to_upload').files[0]);

        _gtools_lib.baas.ds_data_restore_request(_tenantID, _jwtoken, formData,
            function(response) {
                $('#restore_backup_modal #formToRestoreBackup button').children('span.spinner-border')
                    .hide();
                $('#restore_backup_modal #formToRestoreBackup button').removeAttr('disabled');

                if (response.http.status == 200) {
                    _app_lib.handle_success_message('Operation performed successfully!');
                    $('div#restore_backup_modal').modal('hide');
                } else {
                    _app_lib.handle_error_message(response.data);
                }
            });
    });


    /*
     * para o modal com o input para nomear os objetos q 
     * optou-se por criar no schema
     * 
     */
    $('#metadata-modal').on('shown.bs.modal', function(e) {

    })
    .on('click', 'button', function() {
        let object_name_ = $('#metadata-modal input#metadata').val();
        if (object_name_ != null && object_name_.length >= 3) {
            _node._action = $('#metadata-modal input#command').val();
            _app_lib.insert_spec(_node, object_name_);
        } else {
            $.confirm({
                title: '[WARNING] Read the below:',
                content: 'you must correctly type the object name!',
                buttons: {
                    close: function() {
                        $('#metadata-modal').modal('show');
                    }
                }
            });
        }
        $('#metadata-modal').modal('hide');
    });

    $('#metadata-modal input#metadata').keypress(function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });

    $("div#work-area #tree").contextmenu({
        delegate: "span.fancytree-title",
        autoFocus: true,
        menu: [
            // Schema
            { title: "Schema Create", cmd: "schema_create" },
            { title: "Schema Delete", cmd: "schema_delete" },
            { title: "Schema (_conf)", cmd: 'schema-_conf',
                children: [
                    { title: "Change Status", cmd: "schema-_conf-enabled_change" }
                ]
            },
            { title: "Schema Class Diagram", cmd: "schema-cd_view" }, 
            // Entity
            { title: "Entity Rename", cmd: "entity-_conf_rename" },
            { title: "Entity Create", cmd: "entity_create" },
            { title: "Entity Read", cmd: "entity_read" },
            { title: "Entity Delete", cmd: "entity_delete" },
            { title: "Entity (_conf)", cmd: 'entity-_conf',
                children: [
                    { title: "Change Concurrency Control", cmd: "entity-_conf-concurrencyControl_change" },
                    { title: "Change Business Rule", cmd: "entity-_conf-businessRule_change" },
                    { title: "Access Control", cmd: "entity-_conf_accessControl",
                        children: [
                            { title: "Change Read", cmd: "entity-_conf-accessControl-read_change" },
                            { title: "Change Write", cmd: "entity-_conf-accessControl-write_change" }
                        ]
                    },
                    { title: "Persistence", cmd: "entity-_conf-persistence",
                        children: [
                            { title: "Change Unique Key", cmd: "entity-_conf-persistence-uniqueKey_change" },
                            { title: "Change Index Key", cmd: "entity-_conf-persistence-indexKey_change" }
                        ]
                    }
                ]
            },
            // Attribute 
            { title: "Attribute Rename", cmd: "attribute-_conf_rename" },
            { title: "Attribute Create", cmd: "attribute_create" },
            { title: "Attribute Delete", cmd: "attribute_delete" },
            { title: "Attribute (_conf)", cmd: 'attribute-_conf',
                children: [
                    { title: "Change nullable", cmd: "attribute-_conf-nullable_change" },
                    { title: "Change unique", cmd: "attribute-_conf-unique_change" }
                ]
            },
            // Relationship
            { title: "Relationship Rename", cmd: "relationship-_conf_rename" },
            { title: "Relationship Create", cmd: "relationship_create" },
            { title: "Relationship Delete", cmd: "relationship_delete" },
            { title: "Relationship (_conf)", cmd: 'relationship-_conf',
                children: [
                    { title: "Change nullable", cmd: "relationship-_conf-nullable_change" },
                    { title: "Change unique", cmd: "relationship-_conf-unique_change" }
                ]
            },
            { 
                title: "----", cmd: 'separator'
            }, {
                title: "Account", cmd: 'account',
                children: [
                    { title: "Create Admin", cmd: "account-admin_create" },
                    { title: "Create User", cmd: "account-user_create" },
                    { title: "Update User", cmd: "account-user_update" },
                    { title: "Delete User", cmd: "account-user_delete" }
                ]
            }
        ],
        beforeOpen: function(event, ui) {
            if (!_app.panel.schema.status && !_app.panel.data.status) {
                event.preventDefault();
            }

            var node = $.ui.fancytree.getNode(ui.target);;
            node.setActive();

            _app_lib.reset_contextmenu_entries();
            $("#tree").contextmenu("showEntry", "account", false);
            $("#tree").contextmenu("showEntry", "separator", false);
            $("#tree").contextmenu("enableEntry", "account", false);
            $("#tree").contextmenu("enableEntry", "separator", false);

            if (_app.panel.data.status) {
                $("#tree").contextmenu("showEntry", "entity_create", true);
                $("#tree").contextmenu("showEntry", "entity_read", true);
                $("#tree").contextmenu("showEntry", "entity_update", true);
                $("#tree").contextmenu("showEntry", "entity_delete", true);
                $("#tree").contextmenu("showEntry", "entity-_conf", true);
                $("#tree").contextmenu("showEntry", "separator", false);

                $("#tree").contextmenu("enableEntry", "entity_create", true);
                $("#tree").contextmenu("enableEntry", "entity_read", true);
                $("#tree").contextmenu("enableEntry", "entity_update", true);
                $("#tree").contextmenu("enableEntry", "entity_delete", true);
                $("#tree").contextmenu("enableEntry", "entity-_conf", true);
                $("#tree").contextmenu("enableEntry", "separator", false);
            } else if (node.title.trim() == 'No data.') {
                $("#tree").contextmenu("showEntry", "schema_create", true);
                $("#tree").contextmenu("showEntry", "account", false);
                $("#tree").contextmenu("showEntry", "separator", false);

                $("#tree").contextmenu("enableEntry", "schema_create", true);
                $("#tree").contextmenu("enableEntry", "account", false);
                $("#tree").contextmenu("enableEntry", "separator", false);
            } else if (node.key.trim() == 'schema' && _app.panel.schema.status) {
                $("#tree").contextmenu("showEntry", "schema", true);
                $("#tree").contextmenu("showEntry", "schema_create", true);
                $("#tree").contextmenu("showEntry", "schema_delete", true);
                $("#tree").contextmenu("showEntry", "schema-cd_view", true);
                $("#tree").contextmenu("showEntry", "schema-_conf", true);
                $("#tree").contextmenu("showEntry", "entity", true);
                $("#tree").contextmenu("showEntry", "entity_create", true);
                $("#tree").contextmenu("showEntry", "account", true);
                $("#tree").contextmenu("showEntry", "separator", true);

                $("#tree").contextmenu("enableEntry", "schema", true);
                $("#tree").contextmenu("enableEntry", "schema_create", true);
                $("#tree").contextmenu("enableEntry", "schema_delete", true);
                $("#tree").contextmenu("enableEntry", "schema-cd_view", true);
                $("#tree").contextmenu("enableEntry", "schema-_conf", true);
                $("#tree").contextmenu("enableEntry", "entity", true);
                $("#tree").contextmenu("enableEntry", "entity_create", true);
                $("#tree").contextmenu("enableEntry", "account", true);
                $("#tree").contextmenu("enableEntry", "separator", true);
            } else if (node.key.trim() == 'entity' && _app.panel.schema.status) {
                $("#tree").contextmenu("showEntry", "entity-_conf_rename", true);
                $("#tree").contextmenu("showEntry", "entity_read", false);
                $("#tree").contextmenu("showEntry", "entity_delete", true);
                $("#tree").contextmenu("showEntry", "entity-_conf", true);
                $("#tree").contextmenu("showEntry", "attribute_create", true);
                $("#tree").contextmenu("showEntry", "relationship_create", true);
                $("#tree").contextmenu("showEntry", "account", false);
                $("#tree").contextmenu("showEntry", "separator", false);

                $("#tree").contextmenu("enableEntry", "entity-_conf_rename", false);
                $("#tree").contextmenu("enableEntry", "entity_read", false);
                $("#tree").contextmenu("enableEntry", "entity_delete", true);
                $("#tree").contextmenu("enableEntry", "entity-_conf", true);
                $("#tree").contextmenu("enableEntry", "attribute_create", true);
                $("#tree").contextmenu("enableEntry", "relationship_create", true);
                $("#tree").contextmenu("enableEntry", "account", false);
                $("#tree").contextmenu("enableEntry", "separator", false);
            } else if (node.key.trim() == 'attribute' && _app.panel.schema.status) {
                $("#tree").contextmenu("showEntry", "attribute-_conf_rename", true);
                $("#tree").contextmenu("showEntry", "attribute_delete", true);
                $("#tree").contextmenu("showEntry", "attribute-_conf", true);
                $("#tree").contextmenu("showEntry", "account", false);
                $("#tree").contextmenu("showEntry", "separator", false);

                $("#tree").contextmenu("enableEntry", "attribute-_conf_rename", false);
                $("#tree").contextmenu("enableEntry", "attribute_delete", true);
                $("#tree").contextmenu("enableEntry", "attribute-_conf", true);
                $("#tree").contextmenu("enableEntry", "account", false);
                $("#tree").contextmenu("enableEntry", "separator", false);
            } else if (node.key.trim() == 'relationship' && _app.panel.schema.status) {
                $("#tree").contextmenu("showEntry", "relationship-_conf_rename", true);
                $("#tree").contextmenu("showEntry", "relationship_delete", true);
                $("#tree").contextmenu("showEntry", "relationship-_conf", true);
                $("#tree").contextmenu("showEntry", "account", false);
                $("#tree").contextmenu("showEntry", "separator", false);

                $("#tree").contextmenu("enableEntry", "relationship-_conf_rename", false);
                $("#tree").contextmenu("enableEntry", "relationship_delete", true);
                $("#tree").contextmenu("enableEntry", "relationship-_conf", true);
                $("#tree").contextmenu("enableEntry", "account", false);
                $("#tree").contextmenu("enableEntry", "separator", false);
            }

            // Disable tree keyboard handling
            ui.menu.prevKeyboard = node.tree.options.keyboard;
            node.tree.options.keyboard = false;
        },
        close: function(e, ui) {
            var node = $.ui.fancytree.getNode(ui.target);
            node.tree.options.keyboard = ui.menu.prevKeyboard;
            node.setFocus();
        },
        select: function(e, ui) {
            let flow = 1;
            _node = $.ui.fancytree.getNode(ui.target);
            _node._action = ui.cmd;

            switch (ui.cmd) {
                case 'schema_create': {
                    $('#metadata-modal #title').html('Type the schema name');
                    $('#metadata-modal input#command').val('schema_create');
                    $('#metadata-modal input#metadata').val('');
                    $('#metadata-modal input#metadata').attr('placeholder', 'Name');
                    flow = 0;
                    break;
                }
                case 'entity_create': {
                    if (_app.panel.data.status) {
                        flow = 2;
                    } else {
                        $('#metadata-modal #title').html('Type the entity name');
                        $('#metadata-modal input#command').val('entity_create');
                        $('#metadata-modal input#metadata').attr('placeholder', 'Name');
                        flow = 0;
                    }
                    break;
                }
                case 'attribute_create': {
                    $('#metadata-modal #title').html('Type the attribute name');
                    $('#metadata-modal input#command').val('attribute_create');
                    $('#metadata-modal input#metadata').attr('placeholder', 'Name');
                    flow = 0;
                    break;
                }
                case 'relationship_create': {
                    $('#metadata-modal #title').html('Type the relationship name');
                    $('#metadata-modal input#command').val('relationship_create');
                    $('#metadata-modal input#metadata').attr('placeholder', 'Name');
                    flow = 0;
                    break;
                }
                case 'entity_read': {
                    flow = 2;
                    break;
                }
                case 'entity_delete': {
                    if (_app.panel.data.status) {
                        flow = 2;
                    }
                    break;
                }
                case 'schema-cd_view': {
                    /*
                     * Opção em que se deseja carregar o script YUML para
                     * o diagrama de classes de um schema já implantado
                     * 
                     */
                    $('div#work-area div#for-schema-tree .spinner-border').show();

                    let obj_name_ = _node.key;
                    let endpoint = JSON.parse(JSON.stringify(api.endpoint.modeling.schema.yumlCD));
                    endpoint.url = endpoint.url.replace("{schemaName}",obj_name_.replace('.', '-'))
                        .replace("{hasAttr}", "false");
                    _gtools_lib.request(endpoint, null, function(response) {
                        $('div#work-area div#for-schema-tree .spinner-border').hide();
                        if (response.http.status == 200) {
                            $('div#yuml_modal #svg').empty();
                            $('div#yuml_modal #svg').append(_app_lib.load_yUML_svg(response.data));
                            $('div#yuml_modal').modal('show');
                        } else {
                            _app_lib.handle_error_message(response.data);
                        }
                    });
                    flow = -1;
                    break;
                }
                case 'account-admin_create': {
                    $.confirm({
                        title: 'Read the message below!',
                        content: 'This option should only be used for a data schema that does not' +
                            ' have an administrator account already created. This schema has a administrator' +
                            ' account?',
                        buttons: {
                            no: function() {},
                            thereIs: {
                                text: 'Yes!',
                                action: function() {
                                    _memorize[GENERATE_ADMIN_ACCOUNT_AND_SCHEMA_IN_EDITOR] = false;
                                    _app_lib.generate_admin_account_for_a_schema();
                                    _app_lib.run_cli_commands($('div#work-area div#for-cli textarea').val(),
                                        'div#work-area div#for-schema button#deploy-schema span.spinner-border');
                                }
                            }
                        }
                    });
                    return;
                }
                case 'account-user_create': {
                    _app_lib.launch_panel('users');
                    flow = -1;
                    break;
                }
                case 'account-user_update': {
                    _app_lib.launch_panel('users');
                    flow = -1;
                    break;
                }
                case 'account-user_delete': {
                    _app_lib.launch_panel('users');
                    flow = -1;
                    break;
                }
                default:
                    break;
            }

            switch (flow) {
                case 0: {
                    $('#metadata-modal').modal('show');
                    break;
                }
                case 1: {
                    _app_lib.insert_spec(_node);
                    break;
                }
                case 2: {
                    _app_lib.insert_spec(_node);
                    _app_lib.generate_code();
                    break;
                }
                default:
                    break;
            }
        }
    });


    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('do')) {
        if (urlParams.get('do') == 'r') {
            $('#to_register').click();
            urlParams.delete('do');
        }
    }


    _app_lib.build_schema_tree({
        "key": "null",
        "title": '<span style="color:#707070">schema</span> <span style="color:darkred"> </span>',
        "extraClasses": "my-extra-class",
        "tooltip": "",
        "folder": false,
        "children": []
    });


    setTimeout(function() {
        $('div.tox.tox-silver-sink.tox-tinymce-aux').hide();
    }, 750);
    
    $("#work-area #for-schema-tree #nav a.item.discord").on("click",function(){
        window.open('https://discord.gg/SMdmP82kVA','_blank');
    });
    
    $("#work-area #for-schema-tree #nav a.item.github").on("click",function(){
        window.open('https://github.com/ycodify-tech/documentation','_blank');
    });
});


$(window).load(function() {
    var tl = new TimelineMax({
            paused: true
        }),
        tlback = new TimelineMax({
            paused: true
        });

    tl
        .to('.hello', 0.3, {
            autoAlpha: 0
        })
        .set('.home', {
            className: '+=active'
        })
        .set('.item', {
            scale: 1
        }) // fix for a bug when on of the item was appearing at 0.5 scale
        .to('.home', 0.1, {
            scale: 1.2,
            yoyo: true,
            repeat: 1
        })
        .to('.home', 0.3, {
            x: 0,
            y: 0,
            ease: Elastic.easeOut.config(1, 0.5)
        }, 0)
        .staggerFrom('.item', 0.7, {
            left: 0,
            top: 0,
            autoAlpha: 0,
            scale: 0.5,
            ease: Elastic.easeOut.config(1, 0.5)
        }, 0.1);

    tlback
        .set('.home', {
            className: '-=active'
        })
        .staggerTo('.item', 0.7, {
            left: 20,
            top: 20,
            autoAlpha: 0,
            scale: 0.5,
            ease: Elastic.easeOut.config(1, 0.5)
        }, 0.1)
        .to('.hello', 0.3, {
            autoAlpha: 1
        })
        .to('.home', 0.3, {
            x: 0,
            y: 0,
            ease: Power2.easeOut
        }, 0.2);

    $(document).on('click', '.home:not(.active)', function(e) {
        e.preventDefault();
        tl.play(0);
        $('.close').css('left', '-2px');
    });

    $(document).on('click', '.home.active, .item', function(e) {
        e.preventDefault();
        _app_lib.launch_panel($(this).attr('class').replace('item ', ''));
        TweenMax.to($(this), 0.1, {
            scale: 1.2,
            yoyo: true,
            repeat: 1,
            onComplete: function() {
                tlback.play(0)
            }
        });
    });
});
