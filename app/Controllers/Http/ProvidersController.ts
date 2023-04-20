import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Provider from 'App/Models/Provider'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class ProvidersController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10
    const providers = await Provider.query().paginate(page, limit)
    return response.status(200).json(providers)
  }

  public async store({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string(),
    })
    const data = await request.validate({
      schema: validationSchema,
    })
    const provider = await Provider.create(data)
    return response.status(200).json(provider)
  }

  public async show({ params, response }: HttpContextContract) {
    const provider = await Provider.findOrFail(params.id)
    return response.status(200).json(provider)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string(),
    })
    const data = await request.validate({
      schema: validationSchema,
    })
    const provider = await Provider.findOrFail(params.id)
    provider.name = data.name
    await provider.save()
    return response.status(200).json(provider)
  }
}
