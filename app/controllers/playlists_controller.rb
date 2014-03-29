class PlaylistsController < ApplicationController
  before_filter :find_playlist, except: [ :index, :new, :create, :new_song_entry]
  before_filter :get_basket, only: [  :show,
                                      :add_to_basket,
                                      :remove_from_basket,
                                      :add_video,
                                      :remove_video,
                                      :change_track_number,
                                      :create_song_entry,
                                      :remove_song_entry
                                   ]

  def index
    @playlists = Playlist.order(:id).all
  end

  def show
    @max_length = 4
    @playlist.songs.each { |song| @max_length = song.videos.length if song.videos.length > @max_length }
  end

  def new
    @playlist = Playlist.new
  end

  def create
    @playlist = Playlist.create(params[:playlist])
  end

  def update
    @playlist.update_attributes(params[:playlist])
  end

  def destroy
    @playlist.destroy
  end

  def new_song_entry
    @songs = Song.all
  end

  def create_song_entry
    unless PlaylistSong.exists?(playlist_id: params[:playlist_id], song_id: params[:song_id])
      last_song = PlaylistSong.order(:track_number).where(playlist_id: params[:playlist_id]).last
      track_number = last_song.nil? ? 0 : last_song.track_number
      song_id = params[:new_song][:song_id]
      unless params[:new_song][:song_name].blank?
        song_id = Song.create(title: params[:new_song][:song_name]).id
      end
      @playlist_song =  PlaylistSong.create(
                          song_id: song_id,
                          playlist_id: params[:playlist_id],
                          track_number: track_number + 1
                        )
    end
  end

  def remove_song_entry
    @playlist_song = PlaylistSong.where(playlist_id: params[:playlist_id], song_id: params[:song_id]).destroy_all
  end

  def change_track_number
    params[:order].each_with_index do |element, index|
      song = PlaylistSong.where("playlist_id = ? and song_id = ?", params[:playlist_id], element).first
      song.update_attribute(:track_number, index + 1)
    end
  end

  def add_to_basket
    unless Video.exists?(playlist_id: params[:playlist_id], youtube_id: params[:youtube_id])
      Video.create(playlist_id: params[:playlist_id], youtube_id: params[:youtube_id], name: params[:name])
    end
  end

  def remove_from_basket
    Video.where(id: params[:video_id], playlist_id: params[:playlist_id]).first.destroy
  end

  def add_video
    @video = Video.find(params[:video_id])
    @playlist_video = Video.create(params.slice(:cell_id, :song_id))
    @playlist_video.update_attributes(name: @video.name, youtube_id: @video.youtube_id)
  end

  def remove_video
    @video = Video.find(params[:video_id]).destroy
  end

  private

  alias_method :get_playlists, :index
  alias_method :show_playlist, :show

  def find_playlist
    id = params[:id] || params[:playlist_id]
    @playlist = Playlist.find(id)
  end

  def get_basket
    @basket = @playlist.videos
  end

  def render *args
    if %w{create update destroy}.include?(self.action_name)
      get_playlists
      super partial: 'list'
    elsif %w{add_video remove_video change_track_number create_song_entry remove_song_entry}.include?(self.action_name)
      find_playlist
      show_playlist
      super partial: 'song_list'
    elsif %w{add_to_basket remove_from_basket}.include?(self.action_name)
      super partial: 'remove_from_basket'
    else
      super
    end
  end
end