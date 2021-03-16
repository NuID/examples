(ns nuid.examples.clojure-ring.db
  (:require
   [clojure.spec.alpha :as s]
   [clojure.pprint :as pp]
   [next.jdbc :as jdbc]
   [next.jdbc.sql :as sql]))

(s/def ::firstName string?)
(s/def ::lastName string?)
(s/def ::email string?)
(s/def ::nuid string?)
(s/def ::user
  (s/keys :req-un [::firstName ::lastName ::email ::nuid]))

(def db
  {:dbtype "sqlite" :dbname "db.sqlite"})

(def datasource
  (jdbc/get-datasource db))

(defn ensure!
  []
  (pp/pprint
   {:create-table
    (jdbc/execute!
     datasource
     ["CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        nuid TEXT NOT NULL UNIQUE,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE
       )"])}))

(defn find-by-email
  [email]
  (->> {:email email}
       (sql/find-by-keys datasource :users)
       (first)))

(defn user-insert!
  [user]
  (if (s/valid? ::user user)
    (sql/insert! datasource :users user)
    (s/explain ::user user)))
