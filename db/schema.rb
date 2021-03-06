# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140331194923) do

  create_table "media", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.string   "type"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "navigations", :force => true do |t|
    t.string   "title"
    t.integer  "parent_nav_id"
    t.integer  "rotation"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "playlist_songs", :force => true do |t|
    t.integer  "song_id"
    t.integer  "playlist_id"
    t.integer  "track_number"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "videos", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.integer  "song_id"
    t.integer  "cell_id"
    t.string   "youtube_id"
    t.integer  "playlist_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

end
