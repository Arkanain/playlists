class Video < ActiveRecord::Base
  belongs_to :song, class_name: 'Song'
  belongs_to :playlist, class_name: 'Playlist'

  attr_accessible :name, :description, :youtube_id, :song_id, :cell_id, :playlist_id

  def youtube_image
    "http://img.youtube.com/vi/#{self.youtube_id}/default.jpg"
  end

  def youtube_url
    "http://youtu.be/#{self.youtube_id}"
  end
end
