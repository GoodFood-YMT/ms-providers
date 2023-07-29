import { BaseModel, beforeCreate, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Provider from './Provider'

export default class ProvidersIngredient extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public ingredient_id: string

  @hasMany(() => Provider)
  public provider_id: HasMany<typeof Provider>

  @beforeCreate()
  public static async setId(providersIngredient: ProvidersIngredient) {
    providersIngredient.id = cuid()
  }
}
