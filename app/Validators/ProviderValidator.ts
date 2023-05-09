import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProviderValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string(),
  })

  public messages: CustomMessages = {
    'name.required': 'Le nom est obligatoire',
  }

  public validate() {
    const data = this.ctx.request.only(['name'])
    return this.ctx.request.validate({
      schema: this.schema,
      messages: this.messages,
      data,
    })
  }
}
