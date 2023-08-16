import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeCreate, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import ProvidersIngredient from 'App/Models/ProvidersIngredient'

export default class Provider extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public restaurantId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => ProvidersIngredient, {
    foreignKey: 'providerId',
    localKey: 'id',
  })
  public ingredients: HasMany<typeof ProvidersIngredient>

  @beforeCreate()
  public static async setId(provider: Provider) {
    provider.id = cuid()
  }
}
