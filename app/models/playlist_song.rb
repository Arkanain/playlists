class PlaylistSong < ActiveRecord::Base
  belongs_to :playlist, foreign_key: :playlist_id, class_name: 'Playlist'
  belongs_to :song, foreign_key: :song_id, class_name: 'Song'

  attr_accessible :song_id, :playlist_id, :track_number

  validates_presence_of :song_id, :playlist_id
end
