class UsersController < ApplicationController
  def create
    credential_res = nuid_api.credential_create(params[:credential])
    unless credential_res.code == 201
      return render_error("Unable to create the credential", :bad_request)
    end

    user = User.create!({
      email: params[:email].strip.downcase,
      first_name: params[:firstName],
      last_name: params[:lastName],
      nuid: credential_res.parsed_response["nu/id"]
    })

    render(json: { user: user }, status: :created)
  rescue => exception
    render_error(exception.message, 500)
  end

  private

  def render_error(error, status)
    render(json: {errors: [error]}, status: status)
  end
end
