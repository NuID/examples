(ns nuid.examples.clojure-ring.api
  (:require
   [bidi.ring :as bidi.ring]
   [muuntaja.middleware :as muuntaja.mw]
   [nuid.examples.clojure-ring.db :as db]
   [nuid.sdk.api.auth :as auth]
   [ring.adapter.jetty :as jetty]
   [ring.middleware.cors :as ring.cors]))

(def not-found
  (constantly
   {:status 404}))

(defn fail-res
  [status error-message]
  {:status status
   :body   {:errors [error-message]}})

(defn user->from-db
  [user]
  (reduce (fn [u [k v]] (assoc u (keyword (name k)) v))
          {}
          user))

;; 401, 200
(defn challenge-handler
  [{:keys [body-params]}]
  (if-let [user (db/find-by-email (:email body-params))]
    (let [credential-res (auth/credential-get (:users/nuid user))
          credential     (get-in credential-res [:body "nuid/credential"])
          challenge-res  (when (= 200 (:status credential-res))
                           (auth/challenge-get credential))
          challenge-jwt  (get-in challenge-res [:body "nuid.credential.challenge/jwt"])]
      (if (= 201 (:status challenge-res))
        {:status 200
         :body   {:challengeJwt challenge-jwt}}
        (fail-res 401 "Unauthorized")))
    (fail-res 401 "Unauthorized")))

;; 401 200
(defn login-handler
  [{:keys [body-params]}]
  (if-let [user (db/find-by-email (:email body-params))]
    (let [{:keys [challengeJwt proof]} body-params
          verify-res                   (auth/challenge-verify challengeJwt proof)]
      (if (= 200 (:status verify-res))
        {:status 200
         :body   {:user (user->from-db user)}}
        (fail-res 401 "Unauthorized")))
    (fail-res 401 "Unauthorized")))

;; 400, 201
(defn register-handler
  [{:keys [body-params]}]
  (if-let [_ (db/find-by-email (:email body-params))]
    (fail-res 400 "Email address already taken")
    (let [register-res (auth/credential-create (:credential body-params))
          nuid         (get-in register-res [:body "nu/id"])
          user-params  (-> (select-keys body-params [:email :firstName :lastName])
                           (assoc :nuid nuid))

          user (when (= 201 (:status register-res))
                 (db/user-insert! user-params)
                 (db/find-by-email (:email body-params)))]
      (if user
        {:status 201
         :body   {:user (user->from-db user)}}
        (fail-res 400 "Invalid request")))))

(def routes
  ["/"
   [["challenge" challenge-handler]
    ["login"     login-handler]
    ["register"  register-handler]
    [true        not-found]]
   [true         not-found]])

(def handler
  (->
   routes
   (bidi.ring/make-handler)
   (muuntaja.mw/wrap-format)
   (ring.cors/wrap-cors
    :access-control-allow-origin [#"http://localhost:3000"]
    :access-control-allow-methods [:post])))

(defn start!
  ([]
   (start! (System/getenv)))
  ([{:strs [NUID_API_KEY NUID_API_HOST PORT]}]
   (db/ensure!)
   (auth/merge-opts! {::auth/api-key NUID_API_KEY ::auth/host NUID_API_HOST})
   (jetty/run-jetty
    handler
    {:port  (Integer/parseInt PORT)
     :join? false})))

(comment
  (require
   '[clojure.string :as string]
   '[clojure.pprint :as pp])

  (def server
    (let [env-lines (-> (slurp "examples/.envrc")
                        (string/split  #"\n"))
          reducer   (fn [acc line]
                      (let [[k v] (string/split line #"=")
                            k     (string/replace k #"^export " "")]
                        (assoc acc k v)))
          env       (reduce reducer {"PORT" "4001"} env-lines)
          _         (pp/pprint env)]
      (start! env)))

  (.stop server)

  ;;
  )
