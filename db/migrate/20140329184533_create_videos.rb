class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string  :name
      t.string  :description
      t.integer :song_id
      t.integer :cell_id
      t.string  :youtube_id
      t.integer :playlist_id

      t.timestamps
    end
  end
end
