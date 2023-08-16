/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ProvidersController.index')
  Route.post('/', 'ProvidersController.store')
  Route.get('/:id', 'ProvidersController.show')
  Route.patch('/:id', 'ProvidersController.update')

  Route.get('/:id/ingredients', 'ProvidersController.getAllIngredients')
  Route.post('/:id/ingredients', 'ProvidersController.addIngredient')
  Route.delete('/:id/ingredients', 'ProvidersController.deleteIngredient')
}).prefix('/providers')
