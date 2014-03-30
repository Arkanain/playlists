Playlists::Application.routes.draw do
  resources :playlists do
    get     :new_song_entry
    post    :create_song_entry
    delete  :remove_song_entry
    put     :change_track_number
    post    :add_video
    delete  'remove_video/:video_id', to: 'playlists#remove_video', as: 'remove_video'
    put     :add_to_basket
    delete  :remove_from_basket
    get     'show_video/:video_id', to: 'playlists#show_video', as: 'show_video'
  end

  root to: 'playlists#index'
end