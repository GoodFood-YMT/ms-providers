import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ProvidersIngredient extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ingredientId: string

  @column()
  public providerId: string
}
