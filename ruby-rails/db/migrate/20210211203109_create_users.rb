class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :nuid, null: false
      t.string :email, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.timestamps
      t.index :nuid, unique: true
      t.index :email, unique: true
    end
  end
end
