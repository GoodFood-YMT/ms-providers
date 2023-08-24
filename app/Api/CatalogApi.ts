import fetch from 'node-fetch'

export default class CatalogApi {
  public static ENDPOINT = 'http://ms-catalog.goodfood.svc.cluster.local/catalog'

  public static async getIngredient(
    restaurantId: string,
    ingredientId: string
  ): Promise<{
    id: string
    name: string
    quantity: number
  } | null> {
    const response = await fetch(`${this.ENDPOINT}/ingredients/${ingredientId}`, {
      headers: {
        RestaurantID: restaurantId,
      },
    })

    if (response.ok) {
      return response.json() as Promise<{ id: string; name: string; quantity: number }>
    }

    return null
  }
}
