class SessionsController < ApplicationController
  def challenge
    user = User.where(email: params[:email].strip.downcase).first
    return render_error("User not found", :unauthorized) unless user

    credential_res = nuid_api.credential_get(user.nuid)
    unless credential_res.code == 200
      return render_error("Credential not found", :unauthorized)
    end

    credential = credential_res.parsed_response["nuid/credential"]
    challenge_res = nuid_api.challenge_get(credential)
    unless challenge_res.code == 201
      return render_error("Cannot create a challenge", 500)
    end

    challenge_jwt = challenge_res.parsed_response["nuid.credential.challenge/jwt"]
    render(json: { challengeJwt: challenge_jwt }, status: :ok)
  rescue => exception
    render_error(exception.message, 500)
  end

  def login
    user = User.where(email: params[:email].strip.downcase).first
    return render_error("User not found", :unauthorized) unless user

    challenge_res = nuid_api.challenge_verify(params[:challengeJwt], params[:proof])
    unless challenge_res.code == 200
      return render_error("Verification failed", :unauthorized)
    end

    render(json: { user: user }, status: :ok)
  rescue => exception
    render_error(exception.message, 500)
  end

  private

  def render_error(error, status)
    render(json: {errors: [error]}, status: status)
  end
end
