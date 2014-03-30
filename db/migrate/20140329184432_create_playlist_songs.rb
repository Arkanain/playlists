class CreatePlaylistSongs < ActiveRecord::Migration
  def change
    create_table :playlist_songs do |t|
      t.integer :song_id
      t.integer :playlist_id
      t.integer :track_number

      t.timestamps
    end
  end
end
