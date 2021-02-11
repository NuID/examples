require "nuid/sdk/api/auth"

class ApplicationController < ActionController::API
  def nuid_api
    @nuid_api ||= ::NuID::SDK::API::Auth.new(Rails.configuration.x.nuid.auth_api_key)
  end

  def render_error(error, status)
    render(json: {errors: [error]}, status: status)
  end
end
