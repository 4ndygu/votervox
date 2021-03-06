class CreateAhoyEvents < ActiveRecord::Migration
  def change
    create_table :ahoy_events do |t|
      t.integer :visit_id

      # user
      t.integer :volunteer_id
      # add t.string :user_type if polymorphic

      t.string :name
      t.json :properties
      t.timestamp :time
    end

    add_index :ahoy_events, [:visit_id, :name]
    add_index :ahoy_events, [:volunteer_id, :name]
    add_index :ahoy_events, [:name, :time]
  end
end
