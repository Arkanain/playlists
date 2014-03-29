class Playlist < Media
  has_many  :playlist_songs, class_name: 'PlaylistSong'
  has_many  :songs, through: :playlist_songs, class_name: 'Song', order: :track_number
  has_many  :videos, class_name: 'Video'

  attr_accessible :title

  validates_presence_of :title
end