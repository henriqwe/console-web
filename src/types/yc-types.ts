
// 1. para criação e gerenciamento de contas de usuários da plataforma Ycodify:
// account: {
//  id: Long,
//  email: String (128),
//  name: String (64) 
//  password: String (128),
//  shot: Integer,
//  status: Integer, 
//  username: String (24),
//  version: Integer,
//  created_at: Long,
//  updated_at: Long,
//  roles: [roles]
// }

// role: {
//  id: Long,
//  name: String (32) 
//  accounts: [account]
// }


// 2. para criação e gerenciamento de projetos e schemas na plataforma Ycodify. cada projeto é um schema em um banco de dados relacional e um schema em um não relacional.
// project: {
//  id: Long,
//  status: Integer,
//  schema_owner: String (64),
//  schema_name: String (64),
//  db_name: String (64),
//  db_user_name: String (64),
//  db_user_password: String (64),
//  db_driver_class_name: String (64),
//  db_version: String (32),
//  db_type: String (32),
//  db_minimum_conn_idle: Integer,
//  db_maximum_pool_size: Integer,
//  xa_datasource_class: String (256),
//  auto_ddl: Integer,
//  sql_server_name: String (256),
//  sql_server_port: Integer,
//  nosql_server_name: String (256),
//  nosql_server_port: Integer,
//  tag: String (32),
//  created_at: Long,
//  updated_at: Long,
//  schemas: [schema]
// }

// schema: {
//  id: Long,
//  project: project,
//  specification: String (256),
//  tag: String (256)
// }
