/*
{"password":"0OnG4AHqfRX0U65Z","username":"tester@biblioteca"}
{"password":"X7wAcm3BkV0Bpcq0","username":"jango@biblioteca"}

sdAjZtjTd1jjCTLo

tester@locadora: p1oWDA9CRioiJ1N7
 */

import { attributeType, callbackType, entityType } from './transpiler'

type endpointType = {
  url: string
  headers: {
    'Content-Type': string
    Authorization: string
  }
  httpMessageType: string
}

type dataType =
  | {
      _conf: {
        indexKey?: string[]
        uniqueKey?: string[]
        extension?: string
        accessControl?: {
          read: string[]
          write: string[]
        }
        concurrencyControl?: boolean
      }
    }
  | entityType
  | attributeType
  | string
  | null
export const PROTOCOL = 'http'
export const baas_address = 'api.ycodify.com:8080'
export const api = {
  credentials: {
    password: '',
    username: 'tester'
  },
  endpoint: {
    auth: {
      url: PROTOCOL + '://' + baas_address + '/api/security/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic '.concat(
          btoa('yc:c547d72d-607c-429c-81e2-0baec7dd068b')
        )
      },
      httpMessageType: 'POST'
    },
    account: {
      create: {
        url: PROTOCOL + '://' + baas_address + '/api/account/account',
        headers: {
          'X-TenantID': '',
          'Content-Type': 'application/json'
        },
        httpMessageType: 'POST'
      },
      update: {
        url:
          PROTOCOL +
          '://' +
          baas_address +
          '/api/account/account/username/{username}/version/{version}',
        headers: {
          'X-TenantID': '',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer {TOKEN}'
        },
        httpMessageType: 'PUT'
      },
      updatePassword: {
        url:
          PROTOCOL +
          '://' +
          baas_address +
          '/api/account/account/username/{username}/version/{version}/update-password',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer {TOKEN}'
        },
        httpMessageType: 'PUT'
      }
    },
    igrid: {
      log: {
        error: {
          get: {
            url:
              PROTOCOL +
              '://' +
              baas_address +
              '/api/s-monitor/log/error/operation/{operation}/time/{time}/{op}',
            headers: {
              Authorization: 'Bearer {TOKEN}',
              'X-TenantID': '',
              Accept: 'application/json'
            },
            httpMessageType: 'GET'
          }
        }
      }
    },
    backend: {
      ds: {
        data_backup: {
          url: PROTOCOL + '://' + baas_address + '/api/ds/data-bakcup',
          headers: {
            'X-TenantID': '',
            'Content-Type': 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'POST'
        },
        data_restore: {
          url: PROTOCOL + '://' + baas_address + '/api/ds/data-restore',
          headers: {
            'X-TenantID': '',
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'POST'
        }
      },
      account: {
        create: {
          url: PROTOCOL + '://' + baas_address + '/api/caccount/account',
          headers: {
            'X-TenantID': '',
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'POST'
        },
        get_all: {
          url: PROTOCOL + '://' + baas_address + '/api/caccount/account',
          headers: {
            'X-TenantID': '',
            Accept: 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'GET'
        },
        update: {
          url: PROTOCOL + '://' + baas_address + '/api/caccount/account',
          headers: {
            'X-TenantID': '',
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'PUT'
        },
        updatePassword: {
          url:
            PROTOCOL + '://' + baas_address + '/api/caccount/account/password',
          headers: {
            'X-TenantID': '',
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'PUT'
        },
        delete: {
          url:
            PROTOCOL +
            '://' +
            baas_address +
            '/api/caccount/account/username/{username}/version/{version}',
          headers: {
            'X-TenantID': '',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'DELETE'
        }
      },
      role: {
        create: {
          url: PROTOCOL + '://' + baas_address + '/api/caccount/role',
          headers: {
            'X-TenantID': '',
            'Content-Type': 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'POST'
        },
        get_all: {
          url: PROTOCOL + '://' + baas_address + '/api/caccount/role',
          headers: {
            'X-TenantID': '',
            Accept: 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'GET'
        },
        update: {
          url:
            PROTOCOL + '://' + baas_address + '/api/caccount/role/name/{name}',
          headers: {
            'X-TenantID': '',
            'Content-Type': 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'PUT'
        },
        delete: {
          url:
            PROTOCOL + '://' + baas_address + '/api/caccount/role/name/{name}',
          headers: {
            'X-TenantID': '',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'DELETE'
        }
      }
    },
    modeling: {
      parser: {
        parse: {
          url: PROTOCOL + '://' + baas_address + '/api/modeler/parser/parse',
          headers: {
            'Content-Type': 'text/plain',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'POST'
        },
        generate_cli: {
          url:
            PROTOCOL +
            '://' +
            baas_address +
            '/api/modeler/parser/generate-cli',
          headers: {
            'Content-Type': 'text/plain',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'POST'
        },
        generate_scripts: {
          url:
            PROTOCOL +
            '://' +
            baas_address +
            '/api/modeler/parser/generate-scripts/{script-type}',
          headers: {
            'Content-Type': 'text/plain',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'POST'
        },
        reverse: {
          url:
            PROTOCOL +
            '://' +
            baas_address +
            '/api/modeler/parser/reverse/{path-to-object}',
          headers: {
            Authorization: 'Bearer {TOKEN}',
            Accept: 'text/plain'
          },
          httpMessageType: 'GET'
        }
      },
      schema: {
        tagged: {
          create: {
            url:
              PROTOCOL +
              '://' +
              baas_address +
              '/api/modeler/schema/{schemaName}/tag-with/{tag}',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer {TOKEN}'
            },
            httpMessageType: 'POST'
          },
          get: {
            url:
              PROTOCOL +
              '://' +
              baas_address +
              '/api/modeler/schema/{schemaName}/tagged-by/{tag}',
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer {TOKEN}'
            },
            httpMessageType: 'GET'
          },
          get_all: {
            url:
              PROTOCOL +
              '://' +
              baas_address +
              '/api/modeler/schema/{schemaName}/taggeds',
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer {TOKEN}'
            },
            httpMessageType: 'GET'
          },
          delete: {
            url:
              PROTOCOL +
              '://' +
              baas_address +
              '/api/modeler/schema/{schemaName}/tagged-by/{tag}',
            headers: {
              Authorization: 'Bearer {TOKEN}'
            },
            httpMessageType: 'DELETE'
          }
        },
        create: {
          url: PROTOCOL + '://' + baas_address + '/api/modeler/schema',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'POST'
        },
        read: {
          url: PROTOCOL + '://' + baas_address + '/api/modeler/schema/sql',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'GET'
        },
        read_all: {
          url:
            PROTOCOL +
            '://' +
            baas_address +
            '/api/modeler/schema/{schemaName}/sql',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'GET'
        },
        update: {
          url:
            PROTOCOL +
            '://' +
            baas_address +
            '/api/modeler/schema/{schemaName}',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'PUT'
        },
        delete: {
          url:
            PROTOCOL +
            '://' +
            baas_address +
            '/api/modeler/schema/{schemaName}/sql',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'DELETE'
        },
        caa: {
          url:
            PROTOCOL +
            '://' +
            baas_address +
            '/api/modeler/schema/{schemaName}/create-admin-account',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'POST'
        },
        yumlCD: {
          url:
            PROTOCOL +
            '://' +
            baas_address +
            '/api/modeler/schema/{schemaName}/for-graphical-view/show-attributes/{hasAttr}',
          headers: {
            Accept: 'text/plain',
            Authorization: 'Bearer {TOKEN}'
          },
          httpMessageType: 'GET'
        },
        entity: {
          create: {
            url:
              PROTOCOL +
              '://' +
              baas_address +
              '/api/modeler/schema/{schemaName}/sql/entity',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer {TOKEN}'
            },
            httpMessageType: 'POST'
          },
          read: {
            url:
              PROTOCOL +
              '://' +
              baas_address +
              '/api/modeler/schema/{schemaName}/sql/entity/{entityName}',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer {TOKEN}'
            },
            httpMessageType: 'POST'
          },
          update: {
            url:
              PROTOCOL +
              '://' +
              baas_address +
              '/api/modeler/schema/{schemaName}/sql/entity/{entityName}',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer {TOKEN}'
            },
            httpMessageType: 'PUT'
          },
          delete: {
            url:
              PROTOCOL +
              '://' +
              baas_address +
              '/api/modeler/schema/{schemaName}/sql/entity/{entityName}',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer {TOKEN}'
            },
            httpMessageType: 'DELETE'
          },
          attribute: {
            create: {
              url:
                PROTOCOL +
                '://' +
                baas_address +
                '/api/modeler/schema/{schemaName}/sql/entity/{entityName}/attribute',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer {TOKEN}'
              },
              httpMessageType: 'POST'
            },
            update: {
              url:
                PROTOCOL +
                '://' +
                baas_address +
                '/api/modeler/schema/{schemaName}/sql/entity/{entityName}/attribute/{attributeName}',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer {TOKEN}'
              },
              httpMessageType: 'PUT'
            },
            delete: {
              url:
                PROTOCOL +
                '://' +
                baas_address +
                '/api/modeler/schema/{schemaName}/sql/entity/{entityName}/attribute/{attributeName}',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer {TOKEN}'
              },
              httpMessageType: 'DELETE'
            }
          },
          relationship: {
            create: {
              url:
                PROTOCOL +
                '://' +
                baas_address +
                '/api/modeler/schema/{schemaName}/sql/entity/{entityName}/association',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer {TOKEN}'
              },
              httpMessageType: 'POST'
            },
            update: {
              url:
                PROTOCOL +
                '://' +
                baas_address +
                '/api/modeler/schema/{schemaName}/sql/entity/{entityName}/association/{relationshipName}',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer {TOKEN}'
              },
              httpMessageType: 'PUT'
            },
            delete: {
              url:
                PROTOCOL +
                '://' +
                baas_address +
                '/api/modeler/schema/{schemaName}/sql/entity/{entityName}/association/{relationshipName}/type/{relationshipType}',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer {TOKEN}'
              },
              httpMessageType: 'DELETE'
            }
          }
        }
      }
    }
  },
  query: {
    action: 1,
    object: null,
    criterion: {
      connective: 'AND',
      toCount: false,
      orderBy: 'titulo',
      order: 'asc',
      maxRegisters: 20,
      firstRegister: 0
    },
    associations: {
      mode: false,
      level: 0
    }
  },
  livro: null
}

export const _gtools_lib = {
  type: {
    Java: [
      'String',
      'Long',
      'Timestamp',
      'Boolean',
      'Integer',
      'Double',
      'Date'
    ]
  },
  //   copy_clipboard: function (id, value) {
  //     if (id) {
  //       var element = document.getElementById(id)
  //       element.select()
  //       text = new String(element.value)
  //     }

  //     var $temp = $('<input>')
  //     $('body').append($temp)
  //     $temp.val(value).select()
  //     document.execCommand('copy')
  //     $temp.remove()
  //     console.log('in!')
  //   },
  //   date_format: function (date) {
  //     let _date = new Date(date)
  //     let dd = String(_date.getDate()).padStart(2, '0')
  //     let mm = String(_date.getMonth() + 1).padStart(2, '0')
  //     let yyyy = _date.getFullYear()

  //     return dd + '/' + mm + '/' + yyyy
  //   },
  //   populate: function (frm, data) {
  //     $.each(data, function (key, value) {
  //       $('[name=' + key + ']', frm).val(value)
  //     })
  //   },
  request: function (
    endpoint: endpointType,
    data: dataType,
    callback: callbackType,
    type?: string
  ) {
    let xhttp = new XMLHttpRequest()
    if (type == 'login') {
      /*
            callback({
                http: {
                    status: 200
                },
                data: JSON.stringify({
                    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJ0ZXN0ZXIiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwibmFtZSI6bnVsbCwiaWQiOiI4OSIsImV4cCI6MTY1NDA5NjA1NCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DTElFTlQiXSwianRpIjoiNTNjMjA4ZDAtNzc0NS00ODFkLWE1NTMtNmY1MGUxMDJhM2ZhIiwiZW1haWwiOiJ0ZXN0ZXJAeWMuY29tIiwiY2xpZW50X2lkIjoieWMiLCJ1c2VybmFtZSI6InRlc3RlciIsInN0YXR1cyI6MX0.gOcRPOEhZCrFrpclKKAPBTwEeHCfsYRqLpxIvcrbhHA",
                    username: 'tester'
                })
            });
            return;
             */
      xhttp.open(endpoint.httpMessageType, endpoint.url, true)
      xhttp.setRequestHeader('Content-Type', endpoint.headers['Content-Type'])
      xhttp.setRequestHeader('Authorization', endpoint.headers['Authorization'])
      xhttp.send(data)
    } else {
      xhttp.open(endpoint.httpMessageType, endpoint.url, true)
      xhttp.setRequestHeader('Content-Type', endpoint.headers['Content-Type'])
      if (endpoint.headers['Authorization']) {
        xhttp.setRequestHeader(
          'Authorization',
          endpoint.headers['Authorization'].replace(
            '{TOKEN}',
            api.credentials.access_token
          )
        )
      }
      if (endpoint.headers['Content-Type'] == 'application/json') {
        xhttp.send(JSON.stringify(data))
      } else {
        xhttp.send(data)
      }
    }

    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4) {
        let response = null
        try {
          let _data = ''
          if (
            xhttp.responseText != null &&
            xhttp.responseText.trim().length > 0
          ) {
            if (endpoint.headers['Accept'] == 'application/json') {
              _data = JSON.parse(xhttp.responseText)
            } else {
              _data = xhttp.responseText
            }
          }

          response = {
            http: {
              status: xhttp.status
            },
            data: _data
          }
        } catch (err) {
          console.log(err.message + ' in ' + xhttp.responseText)
        }

        callback(response)
      }
    }
  }
  //   baas: {
  //     request: function (tenantID, jwtoken, data, callback, type, endpoint) {
  //       let xhttp = new XMLHttpRequest()
  //       if (type == 'login') {
  //         xhttp.open(
  //           'POST',
  //           PROTOCOL + '://' + baas_address + '/api/csecurity/oauth/token',
  //           true
  //         )
  //         xhttp.setRequestHeader(
  //           'Content-Type',
  //           'application/x-www-form-urlencoded'
  //         )
  //         xhttp.setRequestHeader(
  //           'Authorization',
  //           'Basic '.concat(btoa('yc:c547d72d-607c-429c-81e2-0baec7dd068b'))
  //         )
  //         xhttp.send(data)
  //         endpoint = {
  //           headers: {}
  //         }
  //         endpoint.headers['Accept'] = 'application/json'
  //       } else if (type == 'data') {
  //         const URL = PROTOCOL + '://' + baas_address + '/api/interpreter-p/s'
  //         console.log(URL)

  //         xhttp.open('POST', URL, true)
  //         xhttp.setRequestHeader('X-TenantID', tenantID)
  //         xhttp.setRequestHeader('Content-Type', 'application/json')
  //         xhttp.setRequestHeader('Authorization', 'Bearer '.concat(jwtoken))
  //         console.log('data: ', data)
  //         xhttp.send(JSON.stringify(data))
  //         endpoint = {
  //           headers: {
  //             Accept: 'application/json'
  //           }
  //         }
  //       } else if (type == 'accounts_and_roles') {
  //         xhttp.open(endpoint.httpMessageType, endpoint.url, true)
  //         xhttp.setRequestHeader('X-TenantID', tenantID)
  //         xhttp.setRequestHeader('Authorization', 'Bearer '.concat(jwtoken))
  //         if (
  //           endpoint.httpMessageType == 'POST' ||
  //           endpoint.httpMessageType == 'PUT'
  //         ) {
  //           xhttp.setRequestHeader('Content-Type', 'application/json')
  //           xhttp.send(JSON.stringify(data))
  //         } else if (
  //           endpoint.httpMessageType == 'GET' ||
  //           endpoint.httpMessageType == 'DELETE'
  //         ) {
  //           if (endpoint.headers['Content-Type']) {
  //             xhttp.setRequestHeader('Accept', endpoint.headers['Content-Type'])
  //           }
  //           xhttp.send()
  //         }
  //       }

  //       xhttp.onreadystatechange = function () {
  //         if (xhttp.readyState == 4) {
  //           let response = null
  //           try {
  //             let _data = ''
  //             if (
  //               xhttp.responseText != null &&
  //               xhttp.responseText.trim().length > 0
  //             ) {
  //               if (endpoint.headers['Accept'] == 'application/json') {
  //                 _data = JSON.parse(xhttp.responseText)
  //               } else {
  //                 _data = xhttp.responseText
  //               }
  //             }
  //             response = {
  //               http: {
  //                 status: xhttp.status
  //               },
  //               data: _data
  //             }
  //           } catch (err) {
  //             console.log(err.message + ' in ' + xhttp.responseText)
  //           }
  //           callback(response)
  //         }
  //       }
  //     },
  //     ds_data_backup_request: function (tenantID, jwtoken, data, callback) {
  //       let xhttp = new XMLHttpRequest()
  //       xhttp.open(
  //         api.endpoint.backend.ds.data_backup.httpMessageType,
  //         api.endpoint.backend.ds.data_backup.url,
  //         true
  //       )
  //       xhttp.responseType = 'arraybuffer'
  //       xhttp.setRequestHeader('X-TenantID', tenantID)
  //       xhttp.setRequestHeader(
  //         'Content-Type',
  //         api.endpoint.backend.ds.data_backup.headers['Content-Type']
  //       )
  //       xhttp.setRequestHeader('Authorization', 'Bearer '.concat(jwtoken))
  //       xhttp.onload = function () {
  //         if (this.status === 200) {
  //           var filename = ''
  //           var disposition = xhttp.getResponseHeader('Content-Disposition')
  //           if (disposition && disposition.indexOf('attachment') !== -1) {
  //             var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  //             var matches = filenameRegex.exec(disposition)
  //             if (matches != null && matches[1]) {
  //               filename = matches[1].replace(/['"]/g, '')
  //             }
  //           }
  //           var type = xhttp.getResponseHeader('Content-Type')

  //           var blob = new Blob([this.response], { type: type })
  //           if (typeof window.navigator.msSaveBlob !== 'undefined') {
  //             window.navigator.msSaveBlob(blob, filename)
  //             callback({
  //               status: 200
  //             })
  //           } else {
  //             var URL = window.URL || window.webkitURL
  //             var downloadUrl = URL.createObjectURL(blob)

  //             if (filename) {
  //               var a = document.createElement('a')
  //               if (typeof a.download === 'undefined') {
  //                 window.location = downloadUrl
  //               } else {
  //                 a.href = downloadUrl
  //                 a.download = filename
  //                 document.body.appendChild(a)
  //                 a.click()
  //               }
  //             } else {
  //               window.location = downloadUrl
  //             }

  //             setTimeout(function () {
  //               URL.revokeObjectURL(downloadUrl)
  //             }, 500)
  //             callback({
  //               status: 200
  //             })
  //           }
  //         } else {
  //           callback({
  //             status: xhttp.status,
  //             data: xhttp.responseText
  //           })
  //         }
  //       }
  //       xhttp.send(JSON.stringify(data))
  //     },
  //     ds_data_restore_request: function (tenantID, jwtoken, data, callback) {
  //       let xhttp = new XMLHttpRequest()
  //       xhttp.open(
  //         api.endpoint.backend.ds.data_restore.httpMessageType,
  //         api.endpoint.backend.ds.data_restore.url,
  //         true
  //       )
  //       xhttp.setRequestHeader('X-TenantID', tenantID)
  //       xhttp.setRequestHeader('Authorization', 'Bearer '.concat(jwtoken))
  //       xhttp.onreadystatechange = function () {
  //         if (xhttp.readyState == 4) {
  //           callback({
  //             http: {
  //               status: xhttp.status
  //             },
  //             data: xhttp.responseText
  //           })
  //         } else console.log(xhttp.readyState)
  //       }
  //       xhttp.send(data)
  //     }
  //   }
}

// /*
// Plugin Name: Simple Menu
// Developer: Prashen Jeet Roy
// Version: 1
// functionality: onclick dropdown, body click hide,
// */
// ;(function ($) {
//   $.fn.simpleMenu = function (options) {
//     'use strict'
//     var $a = $(this),
//       $b = $(this).find('a').next()
//     $a.on('click', 'a', function (e) {
//       e.stopPropagation()
//       var $c = $(this).next().hasClass('sub-menu')
//       if ($c === true) {
//         e.preventDefault()
//       }

//       $(this)
//         .next()
//         .slideToggle(300)
//         .parent()
//         .siblings()
//         .children('ul')
//         .not($(this).next())
//         .hide()
//     })
//     $(document).on('click', $b, function (e) {
//       $b.hide(200)
//     })
//   }
// })(jQuery)

// $('.simple-menu').simpleMenu()

// $('.simple-menu .sub-menu a').click(function (e) {
//   $('.sub-menu').hide(200)
// })

// String.prototype.replaceAll = function (search, replacement) {
//   return this.split(search).join(replacement)
// }

// String.prototype.isAlphaNumeric = function () {
//   var regExp = /^[A-Za-z0-9]+$/
//   return this.match(regExp)
// }

// if (!Array.prototype.clear) {
//   Array.prototype.clear = function () {
//     this.splice(0, this.length)
//   }
// }

// /* *************** *
//  * Confirme Dialog *
//  * *************** */

// export const ui = {
//   confirm: async (message) => createConfirmDialog(message)
// }

// export const createConfirmDialog = (message) => {
//   return new Promise((complete, failed) => {
//     $('#confirmMessage').text(message)

//     $('#confirmYes').off('click')
//     $('#confirmNo').off('click')

//     $('#confirmYes').on('click', () => {
//       $('.confirm').hide()
//       complete(true)
//     })
//     $('#confirmNo').on('click', () => {
//       $('.confirm').hide()
//       complete(false)
//     })

//     $('.confirm').show()
//   })
// }

// export const launchConfirmDialog = async (message) => {
//   const confirm = await ui.confirm(message)

//   if (confirm) {
//     alert('yes clicked')
//   } else {
//     alert('no clicked')
//   }
// }

// export function copyToClipboard(value) {
//   $('#to_clipboard').val(value).select()
//   document.execCommand('copy')
// }
