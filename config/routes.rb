Rails.application.routes.draw do
  resources :profiles
  resources :weights

  get "/weights/:id/new" => "weights#new"
  get "/" => "profiles#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
