export type SchemaTable = {
  [entityName: string]: {
    [attributeName: string]: {
      comment: string
      createdat: number
      length: number
      nullable: boolean
      type: string
      unique: boolean
    }
  }
}