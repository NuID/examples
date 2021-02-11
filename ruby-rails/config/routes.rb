Rails.application.routes.draw do
  match "/challenge", to: "sessions#challenge", via: :post
  match "/login", to: "sessions#login", via: :post
  match "/register", to: "users#create", via: :post
end
