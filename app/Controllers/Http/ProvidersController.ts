import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CatalogApi from 'App/Api/CatalogApi'
import Provider from 'App/Models/Provider'
import ProvidersIngredient from 'App/Models/ProvidersIngredient'
import AddIngredientValidator from 'App/Validators/AddIngredientValidator'
import ProviderValidator from 'App/Validators/ProviderValidator'

export default class ProvidersController {
  public async index({ request, response }: HttpContextContract) {
    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      return response.status(400).json({ message: 'Unauthorized' })
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
      return response.status(400).json({ message: 'Unauthorized' })
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
      return response.status(400).json({ message: 'Unauthorized' })
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
      return response.status(400).json({ message: 'Unauthorized' })
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

  public async getAllIngredients({ params, request, response }: HttpContextContract) {
    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      return response.status(400).json({ message: 'Unauthorized' })
    }

    const provider = await Provider.findByOrFail('id', params.id)

    if (provider.restaurantId !== restaurantId) {
      return response.status(400).json({ message: 'Unauthorized' })
    }

    const page = request.input('page', 1)
    const limit = 10

    const ingredients = await ProvidersIngredient.query()
      .where('provider_id', '=', provider.id)
      .paginate(page, limit)

    // Populate ingredients data
    const ingredientsData: {
      ingredientId: string
      providerId: string
      name: string
      quantity: number
    }[] = []

    for (const ingredient of ingredients.all()) {
      const ingredientData = await CatalogApi.getIngredient(restaurantId, ingredient.ingredientId)

      if (!ingredientData) {
        continue
      }

      ingredientsData.push({
        ...ingredient,
        name: ingredientData.name,
        quantity: ingredientData.quantity,
      })
    }

    return {
      meta: ingredients.getMeta(),
      data: ingredientsData,
    }
  }

  public async addIngredient({ params, request, response }: HttpContextContract) {
    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      return response.status(400).json({ message: 'Unauthorized' })
    }

    const payload = await request.validate(AddIngredientValidator)

    const provider = await Provider.findByOrFail('id', params.id)

    if (provider.restaurantId !== restaurantId) {
      return response.status(400).json({ message: 'Unauthorized' })
    }

    const ingredientData = await CatalogApi.getIngredient(restaurantId, payload.ingredientId)
    if (!ingredientData) {
      return response.status(400).json({ message: 'Ingredient not found' })
    }

    const ingredient = await provider.related('ingredients').create({
      ingredientId: payload.ingredientId,
    })

    return ingredient
  }

  public async deleteIngredient({ params, request, response }: HttpContextContract) {
    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      return response.status(400).json({ message: 'Unauthorized' })
    }

    const payload = await request.validate(AddIngredientValidator)

    const provider = await Provider.findByOrFail('id', params.id)

    if (provider.restaurantId !== restaurantId) {
      return response.status(400).json({ message: 'Unauthorized' })
    }

    await ProvidersIngredient.query()
      .delete()
      .where('ingredient_id', '=', payload.ingredientId)
      .andWhere('provider_id', '=', provider.id)

    return response.status(200).json({ message: 'Ingredient deleted' })
  }
}
