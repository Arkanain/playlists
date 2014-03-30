class Song < Media
  has_many  :playlist_songs, class_name: 'PlaylistSong'
  has_many  :playlists, through: :playlist_songs, class_name: 'Playlist'
  has_many  :videos, class_name: 'Video'
end