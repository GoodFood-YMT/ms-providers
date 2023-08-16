import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Provider from 'App/Models/Provider'
import ProviderValidator from 'App/Validators/ProviderValidator'

export default class ProvidersController {
  public async index({ request, response }: HttpContextContract) {
    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      return response.status(400).json({ message: 'RestaurantID is required' })
    }

    const page = request.input('page', 1)
    const limit = 10

    const providers = await Provider.query()
      .where('restaurant_id', '=', restaurantId)
      .paginate(page, limit)
    return response.status(200).json(providers)
  }

  public async store({ request, response }: HttpContextContract) {
    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      return response.status(400).json({ message: 'RestaurantID is required' })
    }

    const data = await request.validate(ProviderValidator)
    const provider = await Provider.create({
      name: data.name,
      restaurantId: restaurantId,
    })
    return response.status(200).json(provider)
  }

  public async show({ request, params, response }: HttpContextContract) {
    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      return response.status(400).json({ message: 'RestaurantID is required' })
    }

    const provider = await Provider.findOrFail(params.id)

    if (provider.restaurantId !== restaurantId) {
      return response.status(400).json({ message: 'Unauthorized' })
    }

    return response.status(200).json(provider)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      return response.status(400).json({ message: 'RestaurantID is required' })
    }

    const data = await request.validate(ProviderValidator)
    const provider = await Provider.findOrFail(params.id)

    if (provider.restaurantId !== restaurantId) {
      return response.status(400).json({ message: 'Unauthorized' })
    }

    provider.name = data.name
    await provider.save()
    return response.status(200).json(provider)
  }
}
