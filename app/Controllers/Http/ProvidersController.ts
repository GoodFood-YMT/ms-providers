import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Provider from 'App/Models/Provider'

export default class ProvidersController {
  public async index({ response }: HttpContextContract) {
    const providers = await Provider.all()
    return response.status(200).json(providers)
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['name'])
    const provider = await Provider.create(data)
    return response.status(200).json(provider)
  }

  public async show({ params, response }: HttpContextContract) {
    const provider = await Provider.findOrFail(params.id)
    return response.status(200).json(provider)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const data = request.only(['name'])
    const provider = await Provider.findOrFail(params.id)
    provider.name = data.name
    await provider.save()
    return response.status(200).json(provider)
  }
}
