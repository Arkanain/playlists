class CreateNavigations < ActiveRecord::Migration
  def change
    create_table :navigations do |t|
      t.string  :title
      t.integer :parent_nav_id
      t.integer :rotation

      t.timestamps
    end
  end
end
